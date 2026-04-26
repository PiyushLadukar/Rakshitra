import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { CrimeRecord } from "../../types";
import { aggregateByDateAndCrime, CHART_PALETTE, CRIME_TYPES } from "../../utils/dataHelpers";

type Props = { data: CrimeRecord[] };

export default function CrimeTrendLine({ data }: Props) {
  const chartData = useMemo(() => aggregateByDateAndCrime(data), [data]);
  const activeCrimes = useMemo(() => {
    const s = new Set(data.map(d => d.crime));
    return CRIME_TYPES.filter(c => s.has(c));
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📈</div>
        <div className="empty-title">No trend data</div>
        <div className="empty-sub">Adjust filters to see crime trends</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="var(--cream-200)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--ink-400)", fontFamily: "var(--font-body)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => v.slice(5)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--ink-400)", fontFamily: "var(--font-body)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--ink-900)", border: "none",
            borderRadius: 10, fontSize: 12,
            fontFamily: "var(--font-body)", color: "var(--cream-100)"
          }}
          labelStyle={{ color: "var(--cream-200)", marginBottom: 4 }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-body)", color: "var(--ink-400)" }}
        />
        {activeCrimes.map((crime, i) => (
          <Line
            key={crime}
            type="monotone"
            dataKey={crime}
            stroke={CHART_PALETTE[i % CHART_PALETTE.length]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}