import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { DashboardResponse, Filters } from "../types";

const BASE = "http://127.0.0.1:5000";

const DEFAULT_RESPONSE: DashboardResponse = {
  total_records: 0,
  total_anomalies: 0,
  most_common_crime: "—",
  peak_day: "—",
  data: [],
  anomalies: [],
  cities: [],
  crime_types: [],
};

export function useDashboardData() {
  const [response, setResponse] = useState<DashboardResponse>(DEFAULT_RESPONSE);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const abortRef                = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (filters: Filters) => {
    // cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {};
      if (filters.city)     params.city      = filters.city;
      if (filters.crime)    params.crime      = filters.crime;
      if (filters.dateFrom) params.date_from  = filters.dateFrom;
      if (filters.dateTo)   params.date_to    = filters.dateTo;

      const res = await axios.get(`${BASE}/dashboard`, {
        params,
        signal: abortRef.current.signal,
      });
      setResponse({ ...DEFAULT_RESPONSE, ...res.data });
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      setError(err?.message ?? "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMeta = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/meta`);
      setResponse(prev => ({
        ...prev,
        cities: res.data.cities ?? [],
        crime_types: res.data.crime_types ?? [],
      }));
    } catch {
      // meta is optional, silently fail
    }
  }, []);

  return { response, loading, error, fetchData, fetchMeta };
}