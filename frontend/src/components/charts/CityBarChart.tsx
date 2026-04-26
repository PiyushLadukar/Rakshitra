import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from "recharts";
import { CrimeRecord } from "../../types";
import { aggregateByCity } from "../../utils/dataHelpers";

type Props = { data: CrimeRecord[] };

export default function CityBarChart({ data }: Props) {
  const chartData = useMemo(() => aggregateByCity(data), [data]);

  if (!chartData.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏙</div>
        <div className="empty-title">No city data</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--cream-200)" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "var(--ink-400)", fontFamily: "var(--font-body)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="city"
          width={80}
          tick={{ fontSize: 11, fill: "var(--ink-500)", fontFamily: "var(--font-body)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--ink-900)", border: "none",
            borderRadius: 10, fontSize: 12, fontFamily: "var(--font-body)"
          }}
          labelStyle={{ color: "var(--cream-200)" }}
          cursor={{ fill: "rgba(249,115,22,0.06)" }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={i === 0 ? "var(--orange-500)" : i === 1 ? "var(--orange-400)" : "var(--cream-300)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}