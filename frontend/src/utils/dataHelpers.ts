import { CrimeRecord } from "../types";

export function getMostCommonCrime(data: CrimeRecord[]): string {
  if (!data.length) return "—";
  const freq: Record<string, number> = {};
  data.forEach(d => { freq[d.crime] = (freq[d.crime] || 0) + d.count; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
}

export function getPeakDays(data: CrimeRecord[], n = 3): CrimeRecord[] {
  return [...data].sort((a, b) => b.count - a.count).slice(0, n);
}

export function groupByCity(data: CrimeRecord[]): { city: string; total: number }[] {
  const map: Record<string, number> = {};
  data.forEach(d => { map[d.city] = (map[d.city] || 0) + d.count; });
  return Object.entries(map)
    .map(([city, total]) => ({ city, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

export function groupByCrime(data: CrimeRecord[]): { crime: string; total: number }[] {
  const map: Record<string, number> = {};
  data.forEach(d => {
    const key = d.crime === "Other" ? "Other" : d.crime;
    map[key] = (map[key] || 0) + d.count;
  });
  return Object.entries(map)
    .map(([crime, total]) => ({ crime, total }))
    .sort((a, b) => b.total - a.total);
}

export function groupByDate(data: CrimeRecord[]): { date: string; [crime: string]: any }[] {
  const map: Record<string, Record<string, number>> = {};
  data.forEach(d => {
    if (!map[d.date]) map[d.date] = {};
    map[d.date][d.crime] = (map[d.date][d.crime] || 0) + d.count;
  });
  return Object.entries(map)
    .map(([date, crimes]) => ({ date, ...crimes }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function groupByMonth(data: CrimeRecord[]): { month: string; total: number }[] {
  const map: Record<string, number> = {};
  data.forEach(d => {
    const month = d.date.slice(0, 7);
    map[month] = (map[month] || 0) + d.count;
  });
  return Object.entries(map)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getHeatmapData(data: CrimeRecord[]) {
  const cities = [...new Set(data.map(d => d.city))].slice(0, 8);
  const crimes = [...new Set(data.map(d => d.crime))].filter(c => c !== "Other").slice(0, 7);

  const cells: { city: string; crime: string; value: number }[] = [];
  cities.forEach(city => {
    crimes.forEach(crime => {
      const total = data.filter(d => d.city === city && d.crime === crime)
        .reduce((s, d) => s + d.count, 0);
      if (total > 0) cells.push({ city, crime, value: total });
    });
  });
  return { cities, crimes, cells };
}

export function getWeeklyPattern(data: CrimeRecord[]): { day: string; total: number }[] {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const map: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  data.forEach(d => {
    const dow = new Date(d.date).getDay();
    if (!isNaN(dow)) map[dow] = (map[dow] || 0) + d.count;
  });
  return DAYS.map((day, i) => ({ day, total: map[i] }));
}

export function uniqueCities(data: CrimeRecord[]): string[] {
  return [...new Set(data.map(d => d.city))].sort();
}