import React from "react";
import { motion } from "framer-motion";
import { formatNum } from "../../utils/dataHelpers";

type Props = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accent: "accent-orange" | "accent-red" | "accent-amber" | "accent-green";
  trend?: { value: string; dir: "up" | "down" | "neutral" };
  sub?: string;
  index?: number;
};

export default function KPICard({ title, value, icon, accent, trend, sub, index = 0 }: Props) {
  const displayed = typeof value === "number" ? formatNum(value) : value;

  return (
    <motion.div
      className={`kpi-card ${accent}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="kpi-header">
        <div className="kpi-icon-wrap">{icon}</div>
        {trend && (
          <div className={`kpi-trend ${trend.dir}`}>
            {trend.dir === "up" ? "↑" : trend.dir === "down" ? "↓" : "—"} {trend.value}
          </div>
        )}
      </div>
      <div className="kpi-value">{displayed}</div>
      <div className="kpi-label">{title}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </motion.div>
  );
}