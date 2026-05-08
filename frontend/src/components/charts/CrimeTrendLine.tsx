import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { CrimeRecord } from "../../types";
import { groupByDate } from "../../utils/dataHelpers";

const COLORS = ["#0EA5E9","#7C3AED","#10B981","#F59E0B","#EF4444","#F43F5E","#06B6D4","#8B5CF6"];

type Props = { data: CrimeRecord[] };

export default function CrimeTrendLine({ data }: Props) {
  const { chartData, crimes } = useMemo(() => {
    const crimes = [...new Set(data.map(d => d.crime))].slice(0, 6);
    const byDate = groupByDate(data);
    // sample every N points if too many
    const step = Math.max(1, Math.floor(byDate.length / 60));
    const chartData = byDate.filter((_, i) => i % step === 0).map(row => ({
      ...row,
      date: row.date.slice(5), // MM-DD
    }));
    return { chartData, crimes };
  }, [data]);

  if (!chartData.length) return <div className="empty"><div className="empty-ico">📈</div><div className="empty-t">No trend data</div></div>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--navy-900)", border: "none", borderRadius: 10, padding: "10px 14px" }}
          labelStyle={{ color: "#7DD3FC", fontSize: 11, fontWeight: 600 }}
          itemStyle={{ color: "#E2E8F0", fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }} />
        {crimes.map((crime, i) => (
          <Line
            key={crime}
            type="monotone"
            dataKey={crime}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}