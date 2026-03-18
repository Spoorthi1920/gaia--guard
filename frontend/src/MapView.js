import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

function MapView({ setCoords }) {
  const [roi, setRoi] = useState(null);

  const onCreated = (e) => {
    const layer = e.layer;
    const geoJSON = layer.toGeoJSON();

    console.log("Selected ROI:", geoJSON);
    setRoi(geoJSON);

    // Optional: extract center point if needed
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
        attribution="&copy; OpenStreetMap contributors"
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
    </MapContainer>
  );
}

export default MapView;