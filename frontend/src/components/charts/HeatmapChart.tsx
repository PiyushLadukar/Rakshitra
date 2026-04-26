import React, { useMemo, useState } from "react";
import { CrimeRecord } from "../../types";
import { buildHeatmap } from "../../utils/dataHelpers";

type Props = { data: CrimeRecord[] };

function heatColor(value: number, max: number) {
  if (max === 0) return "var(--cream-200)";
  const t = value / max;
  if (t === 0) return "var(--cream-100)";
  if (t < 0.25) return "rgba(253,186,116,0.4)";
  if (t < 0.5)  return "rgba(249,115,22,0.5)";
  if (t < 0.75) return "rgba(234,88,12,0.7)";
  return "rgba(194,65,12,0.9)";
}

export default function HeatmapChart({ data }: Props) {
  const { cities, crimes, map } = useMemo(() => buildHeatmap(data), [data]);
  const [tooltip, setTooltip] = useState<{ city: string; crime: string; count: number } | null>(null);

  if (!cities.length) {
    return (
      <div className="empty-state">
        <div className="empty-title">No heatmap data</div>
      </div>
    );
  }

  const maxVal = Math.max(...cities.flatMap(c => crimes.map(cr => map[c]?.[cr] || 0)));

  return (
    <div style={{ overflowX: "auto" }}>
      {/* Column headers (crimes) */}
      <div style={{ display: "grid", gridTemplateColumns: `100px repeat(${crimes.length}, 1fr)`, gap: 3, marginBottom: 3 }}>
        <div />
        {crimes.map(cr => (
          <div key={cr} style={{
            fontSize: 10, fontWeight: 700, color: "var(--ink-400)",
            textAlign: "center", transform: "rotate(-35deg)", transformOrigin: "bottom left",
            whiteSpace: "nowrap", height: 50, display: "flex", alignItems: "flex-end", paddingBottom: 4
          }}>
            {cr}
          </div>
        ))}
      </div>

      {/* Rows (cities) */}
      {cities.map(city => (
        <div key={city} style={{ display: "grid", gridTemplateColumns: `100px repeat(${crimes.length}, 1fr)`, gap: 3, marginBottom: 3 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-500)", display: "flex", alignItems: "center", paddingRight: 8 }}>
            {city}
          </div>
          {crimes.map(crime => {
            const count = map[city]?.[crime] || 0;
            return (
              <div
                key={crime}
                className="heatmap-cell"
                style={{
                  height: 28,
                  background: heatColor(count, maxVal),
                  border: "1px solid rgba(255,255,255,0.6)",
                  position: "relative"
                }}
                title={`${city} / ${crime}: ${count}`}
                onMouseEnter={() => setTooltip({ city, crime, count })}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </div>
      ))}

      {/* Scale */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 10, color: "var(--ink-400)" }}>Low</span>
        {["rgba(253,186,116,0.3)","rgba(249,115,22,0.5)","rgba(234,88,12,0.7)","rgba(194,65,12,0.9)"].map((c, i) => (
          <div key={i} style={{ width: 24, height: 14, background: c, borderRadius: 3 }} />
        ))}
        <span style={{ fontSize: 10, color: "var(--ink-400)" }}>High</span>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div style={{
          marginTop: 8, padding: "6px 12px",
          background: "var(--ink-900)", color: "var(--cream-100)",
          borderRadius: 8, fontSize: 12, display: "inline-block"
        }}>
          <b>{tooltip.city}</b> — {tooltip.crime}: <b>{tooltip.count}</b> incidents
        </div>
      )}
    </div>
  );
}