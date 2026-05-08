import React from "react";
import { BarChart2, AlertTriangle, MapPin, Activity, Shield, TrendingUp, Zap } from "lucide-react";

export type ActiveView = "dashboard" | "anomalies" | "cityview" | "trends";

type Props = {
  anomalyCount: number;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
};

const NAV = [
  { id: "dashboard" as ActiveView, label: "Dashboard",  Icon: BarChart2 },
  { id: "anomalies" as ActiveView, label: "Anomalies",  Icon: AlertTriangle, badge: true },
  { id: "cityview"  as ActiveView, label: "City View",  Icon: MapPin },
  { id: "trends"    as ActiveView, label: "Trends",     Icon: TrendingUp },
];

export default function Sidebar({ anomalyCount, activeView, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <Shield size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
              <span className="logo-hi">रक्षि</span>
              <span className="logo-de">त्र</span>
            </div>
            <div className="logo-sub">Crime Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-label">Analysis</div>
        {NAV.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            className={`nav-item${activeView === id ? " active" : ""}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={15} />
            {label}
            {badge && anomalyCount > 0 && (
              <span className="nav-badge">{anomalyCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer stats */}
      <div className="sidebar-footer">
        <div className="sb-stat">
          <span className="sb-stat-label">
            <span className="status-pulse" style={{ display: "inline-block", marginRight: 6 }} />
            API Status
          </span>
          <span className="sb-stat-val">LIVE</span>
        </div>
        <div className="sb-stat">
          <span className="sb-stat-label">Port</span>
          <span className="sb-stat-val">5000</span>
        </div>
        <div className="sb-stat" style={{ marginTop: 4 }}>
          <span className="sb-stat-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Zap size={11} />Anomalies
          </span>
          <span className="sb-stat-val" style={{ color: anomalyCount > 0 ? "#FCA5A5" : "#4ADE80" }}>
            {anomalyCount}
          </span>
        </div>
      </div>
    </aside>
  );
}