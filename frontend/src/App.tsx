import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/layouts/Sidebar";
import "./styles/global.css";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="app-shell">
      <Dashboard />
    </div>
  );
}