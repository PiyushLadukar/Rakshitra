import React from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: "teal" | "red" | "amber" | "emerald" | "violet" | "rose";
  sub?: string;
  trend?: { value: string; dir: "up" | "down" | "neutral" };
  index?: number;
};

export default function KPICard({ title, value, icon, accent, sub, trend, index = 0 }: Props) {
  return (
    <motion.div
      className={`kpi-card ${accent}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="kpi-top-bar" />
      <div className="kpi-row">
        <div className="kpi-icon">{icon}</div>
        {trend && (
          <span className={`kpi-pill ${trend.dir === "up" ? "up" : trend.dir === "down" ? "down" : "flat"}`}>
            {trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "—"} {trend.value}
          </span>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{title}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </motion.div>
  );
}