import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { CrimeRecord } from "../../types";
import { groupByCity } from "../../utils/dataHelpers";

const COLORS = ["#0EA5E9","#38BDF8","#7DD3FC","#BAE6FD","#7C3AED","#8B5CF6","#A78BFA","#C4B5FD","#10B981","#34D399"];

type Props = { data: CrimeRecord[] };

export default function CityBarChart({ data }: Props) {
  const chartData = useMemo(() => groupByCity(data), [data]);

  if (!chartData.length) return <div className="empty"><div className="empty-ico">🏙️</div><div className="empty-t">No city data</div></div>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
        <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: "var(--text-secondary)", fontWeight: 500 }} tickLine={false} axisLine={false} width={80} />
        <Tooltip
          contentStyle={{ background: "var(--navy-900)", border: "none", borderRadius: 10, padding: "10px 14px" }}
          labelStyle={{ color: "#7DD3FC", fontSize: 11, fontWeight: 600 }}
          itemStyle={{ color: "#E2E8F0", fontSize: 12 }}
        />
        <Bar dataKey="total" radius={[0, 6, 6, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}