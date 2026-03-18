from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    lat = data.get("lat")
    lng = data.get("lng")

    print("Received:", lat, lng)

    # Dummy response (we’ll connect ML later)
    return jsonify({
        "status": "success",
        "forest_loss": 12.5
    })
@app.route("/")
def home():
    return "GaiaGuard Backend Running 🚀"

if __name__ == "__main__":
    app.run(debug=True)