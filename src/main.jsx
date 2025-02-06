import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Import your App component

// Get the root element from index.html
const rootElement = document.getElementById("root");

// Create the root and render the App component
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);