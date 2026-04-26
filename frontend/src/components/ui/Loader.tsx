import React from "react";

export function SkeletonKPI() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
      {[0,1,2,3].map(i => (
        <div key={i} className="skeleton skeleton-kpi" />
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 280 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 20 }} />;
}

export function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 0" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-row" style={{ opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  );
}

export default function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 28 }}>
      <SkeletonKPI />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
}