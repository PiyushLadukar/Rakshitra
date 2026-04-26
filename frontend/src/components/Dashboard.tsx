import React, { useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Database, AlertTriangle, TrendingUp, Shield
} from "lucide-react";

import Sidebar from "./layouts/Sidebar";
import Topbar from "./layouts/Topbar";
import KPICard from "./ui/KPICard";
import FilterBar from "./filters/FilterBar";
import CrimeTrendLine from "./charts/CrimeTrendLine";
import CityBarChart from "./charts/CityBarChart";
import CategoryPieChart from "./charts/CategoryPieChart";
import HeatmapChart from "./charts/HeatmapChart";
import CrimeTable from "./table/CrimeTable";
import { SkeletonKPI, SkeletonChart } from "./ui/Loader";

import { useDashboardData } from "../hooks/useDashboardData";
import { Filters } from "../types";
import { getMostCommonCrime, getPeakDays } from "../utils/dataHelpers";

const EMPTY_FILTERS: Filters = { city: "", crime: "", dateFrom: "", dateTo: "" };

export default function Dashboard() {
  const { response, loading, error, fetchData, fetchMeta } = useDashboardData();

  // Initial load
  useEffect(() => {
    fetchMeta();
    fetchData(EMPTY_FILTERS);
  }, [fetchData, fetchMeta]);

  const handleApply = useCallback((f: Filters) => {
    fetchData(f);
  }, [fetchData]);

  const { data, total_records, total_anomalies, cities = [], crime_types = [] } = response;

  const mostCommon    = useMemo(() => getMostCommonCrime(data), [data]);
  const peakDays      = useMemo(() => getPeakDays(data, 3), [data]);
  const anomalyRate   = total_records > 0
    ? ((total_anomalies / total_records) * 100).toFixed(1) + "%"
    : "0%";

  const lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="app-shell">
      <Sidebar anomalyCount={total_anomalies} />

      <div className="main-content">
        <Topbar
          title="Crime Intelligence Dashboard"
          subtitle="India — Real-time anomaly detection & analysis"
          loading={loading}
          onRefresh={() => fetchData(EMPTY_FILTERS)}
          lastUpdated={lastUpdated}
        />

        <div className="page-body">

          {/* ── Error Banner ───────────────────────────── */}
          {error && (
            <div style={{
              background: "var(--red-soft)", border: "1px solid var(--red-border)",
              borderRadius: "var(--radius-md)", padding: "14px 18px",
              color: "var(--red-text)", fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <AlertTriangle size={16} />
              {error} — make sure the Flask API is running on port 5000.
            </div>
          )}

          {/* ── Filters ────────────────────────────────── */}
          <FilterBar
            onApply={handleApply}
            loading={loading}
            cities={cities.length ? cities : [...new Set(data.map(d => d.city))].sort()}
          />

          {/* ── KPI Cards ──────────────────────────────── */}
          {loading ? <SkeletonKPI /> : (
            <div className="kpi-grid">
              <KPICard
                index={0}
                title="Total Records"
                value={total_records}
                icon={<Database size={18} />}
                accent="accent-orange"
                sub={`${data.length} grouped incidents`}
              />
              <KPICard
                index={1}
                title="Total Anomalies"
                value={total_anomalies}
                icon={<AlertTriangle size={18} />}
                accent="accent-red"
                trend={{ value: anomalyRate, dir: total_anomalies > 0 ? "up" : "neutral" }}
                sub="Isolation Forest detection"
              />
              <KPICard
                index={2}
                title="Most Common Crime"
                value={mostCommon}
                icon={<TrendingUp size={18} />}
                accent="accent-amber"
                sub="By total incident count"
              />
              <KPICard
                index={3}
                title="Cities Analysed"
                value={[...new Set(data.map(d => d.city))].length}
                icon={<Shield size={18} />}
                accent="accent-green"
                sub={peakDays[0] ? `Peak: ${peakDays[0].date}` : "No peaks detected"}
              />
            </div>
          )}

          {/* ── Trend Line (full width) ─────────────────── */}
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <div className="chart-header">
              <div>
                <div className="chart-title">Crime Trend Over Time</div>
                <div className="chart-subtitle">Multi-category comparison by date</div>
              </div>
            </div>
            {loading ? <SkeletonChart /> : <CrimeTrendLine data={data} />}
          </motion.div>

          {/* ── Bar + Pie ──────────────────────────────── */}
          <div className="chart-grid-2">
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.38 }}
            >
              <div className="chart-header">
                <div>
                  <div className="chart-title">Crime by City</div>
                  <div className="chart-subtitle">Top 10 cities by total incidents</div>
                </div>
              </div>
              {loading ? <SkeletonChart height={240} /> : <CityBarChart data={data} />}
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.44 }}
            >
              <div className="chart-header">
                <div>
                  <div className="chart-title">Category Distribution</div>
                  <div className="chart-subtitle">Share of each crime type</div>
                </div>
              </div>
              {loading ? <SkeletonChart height={240} /> : <CategoryPieChart data={data} />}
            </motion.div>
          </div>

          {/* ── Heatmap ────────────────────────────────── */}
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
          >
            <div className="chart-header">
              <div>
                <div className="chart-title">City × Crime Heatmap</div>
                <div className="chart-subtitle">Intensity of each crime type per city</div>
              </div>
            </div>
            {loading ? <SkeletonChart height={200} /> : <HeatmapChart data={data} />}
          </motion.div>

          {/* ── Table ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.56 }}
          >
            <CrimeTable data={data} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}