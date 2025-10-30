import { useState } from "react";
import TreeVisualizer from "./components/TreeVisualizer";
import { ReactFlowProvider } from "reactflow";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");

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

  return (
    <div className="container">
      <h1>JSON Tree Visualizer</h1>

      <div className="content">
        <div className="input-section">
          <textarea
            placeholder="Enter your JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="json-input"
          ></textarea>

          <button onClick={handleParse}>Visualize JSON</button>
          {error && <p className="error">{error}</p>}
        </div>

        {parsedData && (
          <div className="output">
            <h2>JSON Tree Structure</h2>

            <input
              type="text"
              placeholder="Search by JSON path (e.g. $.user.name)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "50%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <ReactFlowProvider>
              <TreeVisualizer
                data={parsedData}
                searchQuery={searchQuery}
                setSearchResult={setSearchResult}
              />
            </ReactFlowProvider>

            {searchResult && (
              <p style={{ color: searchResult.includes("No") ? "red" : "green" }}>
                {searchResult}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
