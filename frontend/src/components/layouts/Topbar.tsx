import React from "react";
import { Bell, Search } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
};

export default function Topbar({ title, subtitle }: Props) {
  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <div className="topbar-title">
          <span className="topbar-hi">{title.slice(0, 4)}</span>
          <span className="topbar-de">{title.slice(4)}</span>
        </div>
        {subtitle && <div className="topbar-crumb">{subtitle}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="topbar-chip">
          <Search size={12} />
          <span style={{ color: "var(--text-faint)", fontSize: 12 }}>Search…</span>
        </div>
        <button className="btn-ghost" style={{ padding: "7px 10px" }}>
          <Bell size={15} />
        </button>
      </div>
    </header>
  );
}