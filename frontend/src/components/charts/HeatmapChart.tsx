import React, { useMemo } from "react";
import { CrimeRecord } from "../../types";
import { getHeatmapData } from "../../utils/dataHelpers";

type Props = { data: CrimeRecord[] };

function lerp(t: number, a: string, b: string) {
  // simple teal gradient by t (0..1)
  const r = Math.round(14 + t * (7 - 14));
  const g = Math.round(165 + t * (62 - 165));
  const bl = Math.round(233 + t * (237 - 233));
  return `rgba(${r},${g},${bl},${0.12 + t * 0.75})`;
}

export default function HeatmapChart({ data }: Props) {
  const { cities, crimes, cells } = useMemo(() => getHeatmapData(data), [data]);

  if (!cells.length) return (
    <div className="empty"><div className="empty-ico">🔥</div><div className="empty-t">No heatmap data</div></div>
  );

  const maxVal = Math.max(...cells.map(c => c.value));

  const CELL_W = 72;
  const CELL_H = 34;
  const LABEL_W = 90;
  const HEADER_H = 50;

  const svgW = LABEL_W + crimes.length * CELL_W + 8;
  const svgH = HEADER_H + cities.length * CELL_H + 8;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={svgW} height={svgH} style={{ display: "block" }}>
        {/* Crime headers */}
        {crimes.map((crime, ci) => (
          <text
            key={crime}
            x={LABEL_W + ci * CELL_W + CELL_W / 2}
            y={HEADER_H - 8}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="var(--text-muted)"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {crime.length > 10 ? crime.slice(0, 9) + "…" : crime}
          </text>
        ))}

        {/* City labels + cells */}
        {cities.map((city, ri) => (
          <g key={city}>
            <text
              x={LABEL_W - 8}
              y={HEADER_H + ri * CELL_H + CELL_H / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fontWeight={500}
              fill="var(--text-secondary)"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {city}
            </text>
            {crimes.map((crime, ci) => {
              const cell = cells.find(c => c.city === city && c.crime === crime);
              const val = cell?.value ?? 0;
              const t = maxVal > 0 ? val / maxVal : 0;
              return (
                <g key={crime}>
                  <rect
                    x={LABEL_W + ci * CELL_W + 2}
                    y={HEADER_H + ri * CELL_H + 2}
                    width={CELL_W - 4}
                    height={CELL_H - 4}
                    rx={6}
                    fill={val > 0 ? lerp(t, "", "") : "var(--bg)"}
                    stroke="var(--border)"
                    strokeWidth={0.5}
                    style={{ cursor: "pointer", transition: "transform 0.15s" }}
                  />
                  {val > 0 && (
                    <text
                      x={LABEL_W + ci * CELL_W + CELL_W / 2}
                      y={HEADER_H + ri * CELL_H + CELL_H / 2 + 4}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill={t > 0.5 ? "white" : "var(--navy-900)"}
                      style={{ fontFamily: "var(--font-mono)", pointerEvents: "none" }}
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}