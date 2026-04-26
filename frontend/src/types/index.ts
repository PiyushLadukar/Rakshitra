export type CrimeRecord = {
  city: string;
  crime: string;
  date: string;
  count: number;
  anomaly: number;
  day?: number;
  month?: number;
};

export type DashboardResponse = {
  total_records: number;
  total_anomalies: number;
  data: CrimeRecord[];
  anomalies: CrimeRecord[];
  most_common_crime?: string;
  peak_day?: string;
  cities?: string[];
  crime_types?: string[];
};

export type Filters = {
  city: string;
  crime: string;
  dateFrom: string;
  dateTo: string;
};

export type SortConfig = {
  key: keyof CrimeRecord;
  dir: 'asc' | 'desc';
};