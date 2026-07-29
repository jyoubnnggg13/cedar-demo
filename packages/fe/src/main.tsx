import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/**
* astryx css config
*/
import "@astryxdesign/core/reset.css";
import "@astryxdesign/theme-neutral/theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
