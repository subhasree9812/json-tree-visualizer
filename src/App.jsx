import { useState } from "react";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState("");

  const handleParse = () => {
    try {
      const json = JSON.parse(jsonInput);
      setParsedData(json);
      setError("");
    } catch (e) {
      setError("Invalid JSON format. Please check your input.");
      setParsedData(null);
    }
  };

  const renderTree = (data) => {
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {typeof value === "object" ? renderTree(value) : String(value)}
            </li>
          ))}
        </ul>
      );
    }
    return String(data);
  };

  return (
    <div className="container">
      <h1>JSON Tree Visualizer</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Enter your JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleParse}>Visualize JSON</button>
      {error && <p className="error">{error}</p>}
      {parsedData && (
        <div className="output">
          <h2>JSON Structure</h2>
          {renderTree(parsedData)}
        </div>
      )}
    </div>
  );
}

export default App;
