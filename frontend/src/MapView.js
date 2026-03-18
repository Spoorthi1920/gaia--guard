import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

function MapView({ setCoords, setRoi, geoData }) {

  const onCreated = (e) => {
    const layer = e.layer;
    const geoJSON = layer.toGeoJSON();

    setRoi(geoJSON);

    const center = layer.getBounds().getCenter();
    setCoords({ lat: center.lat, lng: center.lng });
  };

  return (
    <MapContainer
      center={[20, 78]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: true,
            polygon: true,
            circle: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>

      {/* 🔴 LOSS AREAS */}
      {geoData && (
        <GeoJSON
          data={geoData}
          style={{
            color: "red",
            weight: 1,
            fillOpacity: 0.5,
          }}
        />
      )}
    </MapContainer>
  );
}

export default MapView;