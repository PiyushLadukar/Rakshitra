import React from "react";

export function SkeletonKPI() {
  return (
    <div className="kpi-grid">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="skel skel-kpi" />
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 280 }: { height?: number }) {
  return <div className="skel skel-chart" style={{ height }} />;
}

export function SkeletonRows({ n = 6 }: { n?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 0" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skel skel-row" style={{ opacity: 1 - i * 0.12 }} />
      ))}
    </div>
  );
}

export default function Loader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: 10, color: "var(--text-muted)" }}>
      <div style={{ width: 20, height: 20, border: "2.5px solid var(--teal-500)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      Loading data…
    </div>
  );
}