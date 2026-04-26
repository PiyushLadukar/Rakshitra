from flask import Flask, request, jsonify
from flask_cors import CORS
from model import run_model

app = Flask(__name__)
CORS(app)
@app.route("/dashboard")
def dashboard():

    city = request.args.get("city")
    crime = request.args.get("crime")

    result = run_model(city=city, crime_type=crime)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)