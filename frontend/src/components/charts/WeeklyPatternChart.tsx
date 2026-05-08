import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CrimeRecord } from "../../types";
import { getWeeklyPattern } from "../../utils/dataHelpers";

const DAY_COLORS = ["#7C3AED","#0EA5E9","#0EA5E9","#0EA5E9","#0EA5E9","#10B981","#7C3AED"];

type Props = { data: CrimeRecord[] };

export default function WeeklyPatternChart({ data }: Props) {
  const chartData = useMemo(() => getWeeklyPattern(data), [data]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--text-muted)", fontWeight: 600 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "var(--text-faint)" }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--navy-900)", border: "none", borderRadius: 10, padding: "10px 14px" }}
          labelStyle={{ color: "#7DD3FC", fontSize: 11, fontWeight: 600 }}
          itemStyle={{ color: "#E2E8F0", fontSize: 12 }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={DAY_COLORS[i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}