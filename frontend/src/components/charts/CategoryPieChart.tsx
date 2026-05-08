import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CrimeRecord } from "../../types";
import { groupByCrime } from "../../utils/dataHelpers";

const COLORS = ["#0EA5E9","#7C3AED","#10B981","#F59E0B","#EF4444","#F43F5E","#06B6D4","#8B5CF6"];

type Props = { data: CrimeRecord[] };

export default function CategoryPieChart({ data }: Props) {
  const chartData = useMemo(() => {
    const grouped = groupByCrime(data);
    const total = grouped.reduce((s, d) => s + d.total, 0);
    // collapse small slices into "Other" if < 2%
    const big = grouped.filter(d => d.crime !== "Other" && d.total / total >= 0.02);
    const smallTotal = grouped.filter(d => d.crime === "Other" || d.total / total < 0.02)
      .reduce((s, d) => s + d.total, 0);
    if (smallTotal > 0) big.push({ crime: "Other", total: smallTotal });
    return { items: big, total };
  }, [data]);

  if (!chartData.items.length) return <div className="empty"><div className="empty-ico">🍩</div><div className="empty-t">No data</div></div>;

  return (
    <div>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie
            data={chartData.items}
            dataKey="total"
            nameKey="crime"
            cx="50%" cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            stroke="none"
          >
            {chartData.items.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: number) => [`${val} (${((val / chartData.total) * 100).toFixed(1)}%)`, ""]}
            contentStyle={{ background: "var(--navy-900)", border: "none", borderRadius: 10, padding: "10px 14px" }}
            labelStyle={{ color: "#7DD3FC", fontSize: 11, fontWeight: 600 }}
            itemStyle={{ color: "#E2E8F0", fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="donut-legend">
        {chartData.items.slice(0, 6).map((d, i) => (
          <div key={d.crime} className="donut-legend-item">
            <div className="donut-legend-left">
              <div className="donut-dot" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="donut-name">{d.crime}</span>
            </div>
            <span className="donut-val">{((d.total / chartData.total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}