import { CrimeRecord } from "../types";

export const CRIME_COLORS: Record<string, string> = {
  "Assault":    "#F97316",
  "Theft":      "#FB923C",
  "Cyber Crime":"#FBBF24",
  "Homicide":   "#EF4444",
  "Rape":       "#DC2626",
  "Kidnapping": "#F59E0B",
  "Extortion":  "#D97706",
  "Vandalism":  "#A78BFA",
  "Other":      "#94A3B8",
};

export const CRIME_TYPES = [
  "Assault", "Theft", "Cyber Crime", "Homicide",
  "Rape", "Kidnapping", "Extortion", "Vandalism", "Other"
];

export const CHART_PALETTE = [
  "#F97316","#FBBF24","#EF4444","#22C55E",
  "#A78BFA","#38BDF8","#FB7185","#34D399","#F472B6"
];

/** Aggregate count by date for line chart */
export function aggregateByDate(data: CrimeRecord[]) {
  const map: Record<string, number> = {};
  data.forEach(d => {
    map[d.date] = (map[d.date] || 0) + d.count;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

/** Multi-line: one series per crime type */
export function aggregateByDateAndCrime(data: CrimeRecord[]) {
  const map: Record<string, Record<string, number>> = {};
  data.forEach(d => {
    if (!map[d.date]) map[d.date] = {};
    map[d.date][d.crime] = (map[d.date][d.crime] || 0) + d.count;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, crimes]) => ({ date, ...crimes }));
}

/** Bar chart: crime count per city */
export function aggregateByCity(data: CrimeRecord[]) {
  const map: Record<string, number> = {};
  data.forEach(d => { map[d.city] = (map[d.city] || 0) + d.count; });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));
}

/** Pie chart: crime category distribution */
export function aggregateByCrime(data: CrimeRecord[]) {
  const map: Record<string, number> = {};
  data.forEach(d => { map[d.crime] = (map[d.crime] || 0) + d.count; });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value, color: CRIME_COLORS[name] || "#94A3B8" }));
}

/** Heatmap: city vs crime */
export function buildHeatmap(data: CrimeRecord[]) {
  const cities = [...new Set(data.map(d => d.city))].slice(0, 10);
  const crimes = [...new Set(data.map(d => d.crime))];
  const map: Record<string, Record<string, number>> = {};
  data.forEach(d => {
    if (!map[d.city]) map[d.city] = {};
    map[d.city][d.crime] = (map[d.city][d.crime] || 0) + d.count;
  });
  return { cities, crimes, map };
}

/** Peak crime days (anomalies sorted by count) */
export function getPeakDays(data: CrimeRecord[], top = 5) {
  return [...data]
    .filter(d => d.anomaly === 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, top);
}

/** Most common crime */
export function getMostCommonCrime(data: CrimeRecord[]): string {
  const agg = aggregateByCrime(data);
  return agg[0]?.name ?? "—";
}

/** Format large numbers */
export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}