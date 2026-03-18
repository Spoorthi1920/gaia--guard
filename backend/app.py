from flask import Flask, request, jsonify
from flask_cors import CORS
import ee

# Initialize Earth Engine
ee.Initialize(project='gaiaguard-461606')

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json

        roi = data.get("roi")
        start1 = data.get("startDate1")
        end1 = data.get("endDate1")
        start2 = data.get("startDate2")
        end2 = data.get("endDate2")

        if not roi:
            return jsonify({"status": "error", "message": "No ROI provided"}), 400

        region = ee.Geometry(roi["geometry"])

        dataset = ee.ImageCollection("COPERNICUS/S2") \
            .filterBounds(region) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))

        before_col = dataset.filterDate(start1, end1)
        after_col = dataset.filterDate(start2, end2)

        if before_col.size().getInfo() == 0 or after_col.size().getInfo() == 0:
            return jsonify({
                "status": "error",
                "message": "No satellite data available"
            }), 400

        before = before_col.sort('CLOUDY_PIXEL_PERCENTAGE').first()
        after = after_col.sort('CLOUDY_PIXEL_PERCENTAGE').first()

        ndvi_before = before.normalizedDifference(['B8', 'B4'])
        ndvi_after = after.normalizedDifference(['B8', 'B4'])

        ndvi_change = ndvi_after.subtract(ndvi_before)

        forest_before = ndvi_before.gt(0.4)
        loss = forest_before.And(ndvi_change.lt(-0.1))

        pixelArea = ee.Image.pixelArea()

        lossArea = loss.multiply(pixelArea).reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region,
            scale=10,
            maxPixels=1e13
        )

        totalArea = pixelArea.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region,
            scale=10,
            maxPixels=1e13
        )

        loss_ha = ee.Number(lossArea.values().get(0)).divide(10000)
        total_ha = ee.Number(totalArea.values().get(0)).divide(10000)

        percent_loss = loss_ha.divide(total_ha).multiply(100)
        percent_value = percent_loss.getInfo()

        # 🔴 Convert loss mask → polygons
        loss_vectors = loss.selfMask().reduceToVectors(
            geometry=region,
            scale=10,
            geometryType='polygon',
            reducer=ee.Reducer.countEvery(),
            maxPixels=1e13
        )

        geojson = loss_vectors.getInfo()

        if percent_value > 5:
            status = "🚨 High Forest Loss"
        elif percent_value > 1:
            status = "⚠️ Moderate Loss"
        else:
            status = "✅ Low / No Significant Loss"

        return jsonify({
            "status": status,
            "forest_loss": round(percent_value, 2),
            "geojson": geojson
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/")
def home():
    return "GaiaGuard Backend Running 🚀"


if __name__ == "__main__":
    app.run(debug=True)