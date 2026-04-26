import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CrimeRecord } from "../../types";
import { aggregateByCrime } from "../../utils/dataHelpers";

type Props = { data: CrimeRecord[] };

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 700, fontFamily: "var(--font-body)" }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CategoryPieChart({ data }: Props) {
  const chartData = useMemo(() => aggregateByCrime(data), [data]);

  if (!chartData.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🥧</div>
        <div className="empty-title">No category data</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--ink-900)", border: "none",
              borderRadius: 10, fontSize: 12, fontFamily: "var(--font-body)"
            }}
            labelStyle={{ color: "var(--cream-200)" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {chartData.slice(0, 6).map(entry => (
          <div key={entry.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--ink-500)", fontWeight: 500 }}>{entry.name}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-700)" }}>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}