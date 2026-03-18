import { useState } from "react";
import MapView from "./MapView";

function App() {
  const [coords, setCoords] = useState(null);
  const [roi, setRoi] = useState(null);
  const [result, setResult] = useState(null);

  const [startDate1, setStartDate1] = useState("2022-01-01");
  const [endDate1, setEndDate1] = useState("2022-03-01");

  const [startDate2, setStartDate2] = useState("2023-01-01");
  const [endDate2, setEndDate2] = useState("2023-03-01");

  const analyzeArea = async () => {
    if (!roi) {
      alert("Select an area first");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roi,
        startDate1,
        endDate1,
        startDate2,
        endDate2,
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2>🌍 GaiaGuard</h2>

      <MapView
        setCoords={setCoords}
        setRoi={setRoi}
        geoData={result?.geojson}
      />

      <h3>📅 Select Time</h3>

      <div>
        <b>Before:</b>
        <input type="date" value={startDate1} onChange={(e) => setStartDate1(e.target.value)} />
        <input type="date" value={endDate1} onChange={(e) => setEndDate1(e.target.value)} />
      </div>

      <div>
        <b>After:</b>
        <input type="date" value={startDate2} onChange={(e) => setStartDate2(e.target.value)} />
        <input type="date" value={endDate2} onChange={(e) => setEndDate2(e.target.value)} />
      </div>

      <button onClick={analyzeArea}>🔍 Analyze Area</button>

      {coords && (
        <div>
          <p>Lat: {coords.lat}</p>
          <p>Lng: {coords.lng}</p>
        </div>
      )}

      {result && (
        <div>
          <h3>📊 Result</h3>
          <p>🌳 Forest Loss: <b>{result.forest_loss}%</b></p>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default App;