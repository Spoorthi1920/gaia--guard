import { useState } from "react";
import MapView from "./MapView";

function App() {
  const [coords, setCoords] = useState(null);
  const [roi, setRoi] = useState(null); 
  const [result, setResult] = useState(null);

  const analyzeArea = async () => {
    if (!roi) {
      alert("Please select an area on map");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roi }), 
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>GaiaGuard 🌍</h2>

      <MapView setCoords={setCoords} setRoi={setRoi} />

      <button onClick={analyzeArea}>Analyze Area</button>

      {coords && (
        <div>
          <p>Lat: {coords.lat}</p>
          <p>Lng: {coords.lng}</p>
        </div>
      )}

      {result && (
        <div>
          <h3>Analysis Result</h3>
          <p>Forest Loss: {result.forest_loss}%</p>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default App;