import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminList from "./components/AdminList.js";
import CpuGauge from "./components/CpuGauge.js";
import RamGauge from "./components/RamGauge.js";
import ProcessList from "./components/ProcessList.js";

const gaugesContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
  gap: "1.5rem",
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <h1>Admin Dashbaord</h1>
    <div style={gaugesContainerStyle}>
      <CpuGauge />
      <RamGauge />
    </div>
    <AdminList />
    <ProcessList />
  </StrictMode>,
);
