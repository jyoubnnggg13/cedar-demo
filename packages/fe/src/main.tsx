import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@astryxdesign/core";
import { neutralTheme } from "@astryxdesign/theme-neutral";
import { App } from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme theme={neutralTheme} mode="system">
      <App />
    </Theme>
  </React.StrictMode>
);
