from flask import Flask, request, jsonify
from flask_cors import CORS
from model import run_model
from preprocess import load_data
from feature_engineering import map_crime

app = Flask(__name__)
CORS(app)


@app.route("/dashboard")
def dashboard():
    city       = request.args.get("city")
    crime      = request.args.get("crime")
    date_from  = request.args.get("date_from")
    date_to    = request.args.get("date_to")

    result = run_model(
        city=city,
        crime_type=crime,
        date_from=date_from,
        date_to=date_to
    )
    return jsonify(result)


@app.route("/meta")
def meta():
    """Return distinct cities and crime types for dropdown filters."""
    try:
        df = load_data()
        df['crime'] = df['crime_description'].apply(map_crime)

        cities      = sorted(df['city'].dropna().unique().tolist())
        crime_types = sorted(df['crime'].dropna().unique().tolist())

        return jsonify({"cities": cities, "crime_types": crime_types})
    except Exception as e:
        return jsonify({"cities": [], "crime_types": [], "error": str(e)}), 500


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)