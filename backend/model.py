import pandas as pd
from preprocess import load_data
from feature_engineering import map_crime
from sklearn.ensemble import IsolationForest


def run_model(city=None, crime_type=None):

    df = load_data()

    # map crime categories
    df['crime'] = df['crime_description'].apply(map_crime)

    # -------------------------------
    # FILTERS
    # -------------------------------
    if city:
        city = city.strip().title()
        df = df[df['city'] == city]

    if crime_type:
        crime_type = crime_type.strip().title()
        df = df[df['crime'] == crime_type]

    # -------------------------------
    # HANDLE EMPTY DATA
    # -------------------------------
    if df.empty:
        return {
            "total_records": 0,
            "total_anomalies": 0,
            "data": [],
            "anomalies": []
        }

    # -------------------------------
    # GROUPING
    # -------------------------------
    df_group = df.groupby(['city', 'crime', 'date']).size().reset_index(name='count')

    df_group['date'] = pd.to_datetime(df_group['date'])
    df_group['day'] = df_group['date'].dt.dayofweek
    df_group['month'] = df_group['date'].dt.month

    # -------------------------------
    # MODEL
    # -------------------------------
    X = df_group[['count', 'day', 'month']]

    if len(X) < 10:
        return {
            "total_records": len(df_group),
            "total_anomalies": 0,
            "data": df_group.to_dict(orient="records"),
            "anomalies": []
        }

    model = IsolationForest(contamination=0.05, random_state=42)

    df_group['anomaly'] = model.fit_predict(X)
    df_group['anomaly'] = df_group['anomaly'].map({1: 0, -1: 1})

    anomalies = df_group[df_group['anomaly'] == 1]

    # -------------------------------
    # FORMAT DATE (REMOVE GMT)
    # -------------------------------
    df_group['date'] = df_group['date'].dt.strftime('%Y-%m-%d')
    anomalies['date'] = anomalies['date'].dt.strftime('%Y-%m-%d')

    # -------------------------------
    # FINAL RETURN
    # -------------------------------
    return {
        "total_records": int(len(df_group)),
        "total_anomalies": int(len(anomalies)),
        "data": df_group.to_dict(orient="records"),
        "anomalies": anomalies.to_dict(orient="records")
    }