import pandas as pd
from preprocess import load_data
from feature_engineering import map_crime
from sklearn.ensemble import IsolationForest


def run_model(city=None, crime_type=None, date_from=None, date_to=None):

    df = load_data()

    df['crime'] = df['crime_description'].apply(map_crime)

    # ── Filters ────────────────────────────────────────────────
    if city:
        city = city.strip().title()
        df = df[df['city'] == city]

    if crime_type:
        crime_type = crime_type.strip().title()
        df = df[df['crime'] == crime_type]

    if date_from:
        df = df[df['datetime'] >= pd.to_datetime(date_from, errors='coerce')]

    if date_to:
        df = df[df['datetime'] <= pd.to_datetime(date_to, errors='coerce') + pd.Timedelta(days=1)]

    # ── Empty guard ─────────────────────────────────────────────
    if df.empty:
        return {
            "total_records": 0,
            "total_anomalies": 0,
            "data": [],
            "anomalies": [],
            "most_common_crime": None,
            "peak_day": None,
        }

    # ── Grouping ────────────────────────────────────────────────
    df_group = df.groupby(['city', 'crime', 'date']).size().reset_index(name='count')
    df_group['date']  = pd.to_datetime(df_group['date'])
    df_group['day']   = df_group['date'].dt.dayofweek
    df_group['month'] = df_group['date'].dt.month

    # ── Anomaly Detection ────────────────────────────────────────
    X = df_group[['count', 'day', 'month']]

    if len(X) >= 10:
        model = IsolationForest(contamination=0.05, random_state=42)
        df_group['anomaly'] = model.fit_predict(X)
        df_group['anomaly'] = df_group['anomaly'].map({1: 0, -1: 1})
    else:
        df_group['anomaly'] = 0

    anomalies = df_group[df_group['anomaly'] == 1]

    # ── Insights ────────────────────────────────────────────────
    most_common = df_group.groupby('crime')['count'].sum().idxmax() if not df_group.empty else None
    peak_day    = df_group.loc[df_group['count'].idxmax(), 'date'] if not df_group.empty else None

    # ── Format dates ─────────────────────────────────────────────
    df_group['date'] = df_group['date'].dt.strftime('%Y-%m-%d')
    anomalies = anomalies.copy()
    anomalies['date'] = anomalies['date'].dt.strftime('%Y-%m-%d')


    return {
        "total_records":    int(len(df_group)),
        "total_anomalies":  int(len(anomalies)),
        "data":             df_group.to_dict(orient="records"),
        "anomalies":        anomalies.to_dict(orient="records"),
        "most_common_crime": most_common,
        "peak_day":          str(peak_day)[:10] if peak_day is not None else None,
    }