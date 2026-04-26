import React from "react";
import { RefreshCw, Wifi } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: string;
};

export default function Topbar({ title, subtitle, loading, onRefresh, lastUpdated }: Props) {
  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <div className="topbar-title">{title}</div>
        <div className="topbar-subtitle">{subtitle}</div>
      </div>

      <div className="topbar-actions">
        {lastUpdated && (
          <div className="topbar-chip">
            <Wifi size={11} />
            Updated {lastUpdated}
          </div>
        )}

        <div className="topbar-chip live">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
          Live
        </div>

        <button
          className="btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          style={{ padding: "7px 13px" }}
        >
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>
    </header>
  );
}