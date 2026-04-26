import pandas as pd

def load_data():

    df = pd.read_csv("data/crime_dataset_india.csv")

    # clean columns
    df.columns = df.columns.str.lower().str.replace(" ", "_")

    # parse datetime (use date_of_occurrence which already has time)
    df['datetime'] = pd.to_datetime(
        df['date_of_occurrence'],
        format='%d-%m-%Y %H:%M',
        errors='coerce'
    )

    df = df.dropna(subset=['datetime'])

    # clean city
    df['city'] = df['city'].astype(str).str.strip().str.title()

    # extract time features
    df['date'] = df['datetime'].dt.date
    df['hour'] = df['datetime'].dt.hour
    df['day'] = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month

    return df