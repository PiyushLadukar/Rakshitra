import pandas as pd
from preprocess import load_data
from feature_engineering import map_crime, map_weapon, age_group
from sklearn.ensemble import IsolationForest


def run_model(city=None, crime_type=None, date_from=None, date_to=None):
    df = load_data()

    # Feature engineering
    df['crime']      = df['crime_description'].apply(map_crime)
    df['weapon_cat'] = df['weapon_used'].apply(map_weapon)
    df['age_group']  = df['victim_age'].apply(age_group)

    # ── Filters ──────────────────────────────────────────────
    if city:
        df = df[df['city'] == city.strip().title()]
    if crime_type:
        df = df[df['crime'] == crime_type.strip().title()]
    if date_from:
        df = df[df['datetime'] >= pd.to_datetime(date_from, errors='coerce')]
    if date_to:
        df = df[df['datetime'] <= pd.to_datetime(date_to, errors='coerce') + pd.Timedelta(days=1)]

    if df.empty:
        return _empty()

    # ── Rich stats ────────────────────────────────────────────
    total_raw = int(len(df))

    # Gender distribution
    gender_dist = df['victim_gender'].value_counts().to_dict()

    # Weapon distribution
    weapon_dist = df['weapon_cat'].value_counts().head(8).to_dict()

    # Age group distribution
    age_dist = df['age_group'].value_counts().to_dict()

    # Case closure rate
    closed = int((df['case_closed'] == 'YES').sum())
    closure_rate = round(closed / total_raw * 100, 1) if total_raw > 0 else 0

    # Crime domain split
    domain_dist = df['crime_domain'].value_counts().to_dict()

    # Avg police deployed
    avg_police = round(df['police_deployed'].mean(), 1) if 'police_deployed' in df else 0

    # Hour distribution (for heatmap)
    hour_dist = df['hour'].value_counts().sort_index().to_dict()

    # ── Grouping for main analysis ────────────────────────────
    df_group = df.groupby(['city', 'crime', 'date']).size().reset_index(name='count')
    df_group['date']  = pd.to_datetime(df_group['date'])
    df_group['day']   = df_group['date'].dt.dayofweek
    df_group['month'] = df_group['date'].dt.month

    # ── Anomaly detection ─────────────────────────────────────
    X = df_group[['count', 'day', 'month']]
    if len(X) >= 10:
        model = IsolationForest(contamination=0.05, random_state=42)
        df_group['anomaly'] = model.fit_predict(X)
        df_group['anomaly'] = df_group['anomaly'].map({1: 0, -1: 1})
    else:
        df_group['anomaly'] = 0

    anomalies    = df_group[df_group['anomaly'] == 1]
    most_common  = df_group.groupby('crime')['count'].sum().idxmax() if not df_group.empty else None
    peak_row     = df_group.loc[df_group['count'].idxmax()] if not df_group.empty else None

    # Format dates
    df_group  = df_group.copy()
    anomalies = anomalies.copy()
    df_group['date']  = df_group['date'].dt.strftime('%Y-%m-%d')
    anomalies['date'] = anomalies['date'].dt.strftime('%Y-%m-%d')

    # ── Crime by city (for bar chart) ─────────────────────────
    city_crime = df.groupby(['city', 'crime']).size().reset_index(name='count')
    city_crime_list = city_crime.sort_values('count', ascending=False).head(50).to_dict(orient='records')

    # ── Monthly stats ─────────────────────────────────────────
    df['month_label'] = df['datetime'].dt.strftime('%Y-%m')
    monthly = df.groupby('month_label').size().reset_index(name='count')
    monthly_list = monthly.to_dict(orient='records')

    return {
        "total_records":    total_raw,
        "total_anomalies":  int(len(anomalies)),
        "closure_rate":     closure_rate,
        "avg_police":       avg_police,
        "most_common_crime": most_common,
        "peak_day":         str(peak_row['date'])[:10] if peak_row is not None else None,
        "peak_city":        str(peak_row['city']) if peak_row is not None else None,

        "data":      df_group.to_dict(orient="records"),
        "anomalies": anomalies.to_dict(orient="records"),

        # Rich breakdown data
        "gender_dist":   gender_dist,
        "weapon_dist":   weapon_dist,
        "age_dist":      age_dist,
        "domain_dist":   domain_dist,
        "hour_dist":     {str(k): v for k, v in hour_dist.items()},
        "city_crime":    city_crime_list,
        "monthly":       monthly_list,
    }


def _empty():
    return {
        "total_records": 0, "total_anomalies": 0,
        "closure_rate": 0, "avg_police": 0,
        "most_common_crime": None, "peak_day": None, "peak_city": None,
        "data": [], "anomalies": [],
        "gender_dist": {}, "weapon_dist": {}, "age_dist": {},
        "domain_dist": {}, "hour_dist": {}, "city_crime": [], "monthly": [],
    }