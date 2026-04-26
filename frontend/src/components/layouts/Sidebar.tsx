import React from "react";
import { BarChart2, AlertTriangle, MapPin, Activity, Shield } from "lucide-react";

type Props = {
  anomalyCount: number;
};

export default function Sidebar({ anomalyCount }: Props) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <Shield size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="logo-text">Rakshitra</div>
            <div className="logo-sub">Crime Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Analysis</div>

        <button className="nav-item active">
          <BarChart2 size={16} />
          Dashboard
        </button>

        <button className="nav-item">
          <AlertTriangle size={16} />
          Anomalies
          {anomalyCount > 0 && (
            <span className="nav-badge">{anomalyCount}</span>
          )}
        </button>

        <button className="nav-item">
          <MapPin size={16} />
          City View
        </button>

        <button className="nav-item">
          <Activity size={16} />
          Trends
        </button>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="status-dot" />
          <div>
            <div className="status-text">API Connected</div>
          </div>
        </div>
      </div>
    </aside>
  );
}