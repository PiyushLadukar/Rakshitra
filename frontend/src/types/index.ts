export interface CrimeRecord {
  city: string;
  crime: string;
  date: string;
  count: number;
  anomaly: number;
  // rich fields from upgraded backend
  victim_age?: number;
  victim_gender?: string;
  weapon_used?: string;
  crime_domain?: string;
  police_deployed?: number;
  case_closed?: string;
  hour?: number;
  day?: number;
  month?: number;
}

export interface DashboardResponse {
  total_records: number;
  total_anomalies: number;
  most_common_crime: string;
  peak_day: string;
  data: CrimeRecord[];
  anomalies: CrimeRecord[];
  cities: string[];
  crime_types: string[];
  // rich analytics
  gender_breakdown?: Record<string, number>;
  weapon_breakdown?: Record<string, number>;
  closure_rate?: number;
  avg_police_deployed?: number;
}

export interface Filters {
  city: string;
  crime: string;
  dateFrom: string;
  dateTo: string;
}