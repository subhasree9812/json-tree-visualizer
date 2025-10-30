import React, { useMemo, useEffect, useState, useRef } from "react";
import ReactFlow, { Controls } from "reactflow";
import "reactflow/dist/style.css";

const TreeVisualizer = ({ data, searchQuery, setSearchResult }) => {
  const [highlightedId, setHighlightedId] = useState(null);
  const instanceRef = useRef(null); //  proper ref for ReactFlow instance

  // Recursive function to generate nodes and edges
  const generateGraph = (obj, parentId = null, depth = 0, x = 0) => {
    const nodes = [];
    const edges = [];

    Object.entries(obj).forEach(([key, value], index) => {
      const id = `${parentId ? parentId + "-" : ""}${key}`;
      const y = depth * 120;
      const xPos = x + index * 220;

      const nodeType =
        Array.isArray(value) ? "array" : typeof value === "object" ? "object" : "primitive";

      nodes.push({
        id,
        data: { label: `${key}${nodeType === "primitive" ? `: ${value}` : ""}` },
        position: { x: xPos, y },
        style: {
          background:
            id === highlightedId
              ? "yellow"
              : nodeType === "object"
              ? "#9b5de5"
              : nodeType === "array"
              ? "#00bb72"
              : "#f8961e",
          color: id === highlightedId ? "black" : "white",
          borderRadius: 8,
          padding: 8,
          fontSize: 12,
          border: id === highlightedId ? "2px solid black" : "none",
        },
      });

      if (parentId) {
        edges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: "smoothstep",
        });
      }

      if (typeof value === "object" && value !== null) {
        const child = generateGraph(value, id, depth + 1, xPos);
        nodes.push(...child.nodes);
        edges.push(...child.edges);
      }
    });

    return { nodes, edges };
  };

  const { nodes, edges } = useMemo(
    () => generateGraph(data || {}, null, 0, 0),
    [data, highlightedId]
  );

  // Handle search and highlight
  useEffect(() => {
    if (!searchQuery || !nodes.length) return;

    // normalize the path to match node IDs
    const normalizedQuery = searchQuery
      .trim()
      .replace(/^\$\./, "")
      .replace(/\[(\d+)\]/g, "-$1")
      .replace(/\./g, "-");

    const match = nodes.find((n) => n.id === normalizedQuery);

    if (match) {
      setHighlightedId(match.id);
      setSearchResult("Match found!");
      // auto-center to that node
      setTimeout(() => {
        if (instanceRef.current) {
          instanceRef.current.setCenter(match.position.x, match.position.y, {
            zoom: 1.2,
            duration: 700,
          });
        }
      }, 100);
    } else {
      setHighlightedId(null);
      setSearchResult("No match found");
    }
  }, [searchQuery, nodes, setSearchResult]);

  // Capture instance safely
  const handleInit = (instance) => {
    instanceRef.current = instance;
    setTimeout(() => {
      instance.fitView({ padding: 0.2, duration: 500 });
    }, 200);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        background: "#bf31e6",
        overflow: "auto",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={handleInit}
        fitView={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        defaultEdgeOptions={{ type: "smoothstep" }}
        style={{ width: "2000px", height: "1500px" }}
      >
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
    </div>
  );
};

export default TreeVisualizer;
