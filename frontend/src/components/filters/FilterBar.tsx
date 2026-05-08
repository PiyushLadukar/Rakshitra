import React, { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Filters } from "../../types";

type Props = {
  onApply: (f: Filters) => void;
  loading: boolean;
  cities: string[];
  crimeTypes?: string[];
};

const EMPTY: Filters = { city: "", crime: "", dateFrom: "", dateTo: "" };

export default function FilterBar({ onApply, loading, cities, crimeTypes = [] }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY);

  const set = (key: keyof Filters, val: string) =>
    setFilters(prev => ({ ...prev, [key]: val }));

  const reset = () => {
    setFilters(EMPTY);
    onApply(EMPTY);
  };

  const activeTags = Object.entries(filters).filter(([, v]) => v !== "");

  const CRIMES = crimeTypes.length ? crimeTypes : [
    "Assault", "Theft", "Cyber Crime", "Homicide", "Rape",
    "Kidnapping", "Extortion", "Vandalism", "Other"
  ];

  return (
    <div className="filter-bar">
      {/* City */}
      <div className="filter-group">
        <label className="filter-label">City</label>
        <div className="filter-select-wrap">
          <select className="filter-select" value={filters.city} onChange={e => set("city", e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Crime Type */}
      <div className="filter-group">
        <label className="filter-label">Crime Type</label>
        <div className="filter-select-wrap">
          <select className="filter-select" value={filters.crime} onChange={e => set("crime", e.target.value)}>
            <option value="">All Types</option>
            {CRIMES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Date range */}
      <div className="filter-group" style={{ minWidth: 200 }}>
        <label className="filter-label">Date Range</label>
        <div className="date-range-wrap">
          <input type="date" className="filter-input" value={filters.dateFrom} onChange={e => set("dateFrom", e.target.value)} style={{ flex: 1 }} />
          <span className="date-sep">→</span>
          <input type="date" className="filter-input" value={filters.dateTo} onChange={e => set("dateTo", e.target.value)} style={{ flex: 1 }} />
        </div>
      </div>

      {/* Actions */}
      <div className="filter-actions">
        <button className="btn-primary" onClick={() => onApply(filters)} disabled={loading}>
          <SlidersHorizontal size={14} />
          {loading ? "Loading…" : "Apply"}
        </button>
        {activeTags.length > 0 && (
          <button className="btn-ghost" onClick={reset}>
            <X size={13} /> Reset
          </button>
        )}
      </div>

      {/* Active tags */}
      {activeTags.length > 0 && (
        <div className="active-tags">
          {activeTags.map(([k, v]) => (
            <span key={k} className="tag">
              <span>{k}: <strong>{v}</strong></span>
              <button onClick={() => { set(k as keyof Filters, ""); }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}