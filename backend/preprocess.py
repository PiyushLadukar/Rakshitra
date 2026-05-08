import pandas as pd

def load_data():
    df = pd.read_csv("data/crime_dataset_india.csv")

    # Normalise column names
    df.columns = df.columns.str.lower().str.strip().str.replace(" ", "_")

    # Parse datetime
    df['datetime'] = pd.to_datetime(df['date_of_occurrence'], format='%d-%m-%Y %H:%M', errors='coerce')
    df = df.dropna(subset=['datetime'])

    # Parse time_of_occurrence → hour
    df['time_dt'] = pd.to_datetime(df['time_of_occurrence'], format='%d-%m-%Y %H:%M', errors='coerce')
    df['hour'] = df['time_dt'].dt.hour

    # Clean fields
    df['city']            = df['city'].astype(str).str.strip().str.title()
    df['victim_gender']   = df['victim_gender'].astype(str).str.strip().str.upper()
    df['weapon_used']     = df['weapon_used'].astype(str).str.strip().str.title()
    df['crime_domain']    = df['crime_domain'].astype(str).str.strip()
    df['case_closed']     = df['case_closed'].astype(str).str.strip().str.upper()
    df['victim_age']      = pd.to_numeric(df['victim_age'], errors='coerce')
    df['police_deployed'] = pd.to_numeric(df['police_deployed'], errors='coerce')

    # Time features
    df['date']  = df['datetime'].dt.date
    df['day']   = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month
    df['year']  = df['datetime'].dt.year

    return df