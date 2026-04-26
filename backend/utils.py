import pandas as pd

df = pd.read_csv("cities_india.csv")

df['city'] = df['city'].str.lower()
df['state'] = df['state'].str.lower()

CITIES = df['city'].tolist()
CITY_TO_STATE = dict(zip(df['city'], df['state']))