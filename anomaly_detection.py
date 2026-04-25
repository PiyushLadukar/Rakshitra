import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


def detect_crime_anomalies(df, city=None, contamination=0.1):

    if city:
        df = df[df['city'] == city].copy()

    df['datetime'] = pd.to_datetime(df['time_of_occurrence'], errors='coerce')
    df = df.dropna(subset=['datetime'])

    df['date'] = df['datetime'].dt.date
    df['hour'] = df['datetime'].dt.hour

    def slot(h):
        if 0 <= h < 6: return 'Night'
        elif 6 <= h < 12: return 'Morning'
        elif 12 <= h < 18: return 'Afternoon'
        else: return 'Evening'

    df['time_slot'] = df['hour'].apply(slot)

    df_group = (
        df.groupby(['city', 'date', 'time_slot'])
        .size()
        .reset_index(name='count')
        .sort_values('date')
    )

    df_group['date'] = pd.to_datetime(df_group['date'])
    df_group['day_of_week'] = df_group['date'].dt.dayofweek
    df_group['month'] = df_group['date'].dt.month

    df_group['rolling_mean_3'] = df_group.groupby('time_slot')['count'].transform(lambda x: x.rolling(3).mean())
    df_group['rolling_std_3'] = df_group.groupby('time_slot')['count'].transform(lambda x: x.rolling(3).std())

    df_group['rolling_mean_7'] = df_group.groupby('time_slot')['count'].transform(lambda x: x.rolling(7).mean())
    df_group['rolling_std_7'] = df_group.groupby('time_slot')['count'].transform(lambda x: x.rolling(7).std())

    df_group = df_group.fillna(0)

    feature_cols = [
        'count',
        'day_of_week',
        'month',
        'rolling_mean_3',
        'rolling_std_3',
        'rolling_mean_7',
        'rolling_std_7'
    ]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df_group[feature_cols])

    split_index = int(len(X_scaled) * 0.8)
    X_train = X_scaled[:split_index]

    model = IsolationForest(
        contamination=contamination,
        n_estimators=300,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train)

    df_group['anomaly'] = model.predict(X_scaled)
    df_group['anomaly'] = df_group['anomaly'].map({1: 0, -1: 1})

    df_group['anomaly_score'] = model.decision_function(X_scaled)

    anomalies = df_group[df_group['anomaly'] == 1]

    peak_record = df_group.loc[df_group['count'].idxmax()] if len(df_group) > 0 else None

    return {
        "city": city if city else "all",
        "total_records": int(len(df_group)),
        "total_anomalies": int(len(anomalies)),
        "peak_date": str(peak_record['date']) if peak_record is not None else None,
        "peak_time_slot": peak_record['time_slot'] if peak_record is not None else None,
        "data": df_group.to_dict(orient="records"),
        "anomalies": anomalies.to_dict(orient="records")
    }


if __name__ == "__main__":
    df = pd.read_csv("data/crime_dataset_india.csv")

    df.columns = df.columns.str.lower().str.replace(" ", "_")

    result = detect_crime_anomalies(df, city="Nagpur")

    print("Total anomalies:", result["total_anomalies"])

    print("\nCrime Alerts:")
    for a in result["anomalies"][:5]:
        print(f"🚨 {a['time_slot']} spike in {a['city']} on {a['date']}")

 
        