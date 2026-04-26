import { useState, useCallback } from "react";
import axios from "axios";
import { DashboardResponse, Filters } from "../types";

const BASE = "http://127.0.0.1:5000";

const EMPTY: DashboardResponse = {
  total_records: 0,
  total_anomalies: 0,
  data: [],
  anomalies: [],
  cities: [],
  crime_types: [],
};

export function useDashboardData() {
  const [response, setResponse] = useState<DashboardResponse>(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetchData = useCallback(async (filters: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (filters.city)     params.city      = filters.city;
      if (filters.crime)    params.crime      = filters.crime;
      if (filters.dateFrom) params.date_from  = filters.dateFrom;
      if (filters.dateTo)   params.date_to    = filters.dateTo;

      const res = await axios.get<DashboardResponse>(`${BASE}/dashboard`, { params });
      setResponse(res.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMeta = useCallback(async () => {
    try {
      const res = await axios.get<{ cities: string[]; crime_types: string[] }>(`${BASE}/meta`);
      setResponse(prev => ({ ...prev, cities: res.data.cities, crime_types: res.data.crime_types }));
    } catch {
      // meta is optional
    }
  }, []);

  return { response, loading, error, fetchData, fetchMeta };
}