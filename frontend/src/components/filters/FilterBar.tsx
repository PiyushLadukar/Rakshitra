import React, { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Filters } from "../../types";
import { CRIME_TYPES } from "../../utils/dataHelpers";

type Props = {
  onApply: (f: Filters) => void;
  loading: boolean;
  cities: string[];
};

const EMPTY: Filters = { city: "", crime: "", dateFrom: "", dateTo: "" };

export default function FilterBar({ onApply, loading, cities }: Props) {
  const [f, setF] = useState<Filters>(EMPTY);

  const set = (key: keyof Filters, val: string) =>
    setF(prev => ({ ...prev, [key]: val }));

  const activeTags: { key: keyof Filters; label: string }[] = [];
  if (f.city)     activeTags.push({ key: "city",     label: `City: ${f.city}` });
  if (f.crime)    activeTags.push({ key: "crime",    label: `Crime: ${f.crime}` });
  if (f.dateFrom) activeTags.push({ key: "dateFrom", label: `From: ${f.dateFrom}` });
  if (f.dateTo)   activeTags.push({ key: "dateTo",   label: `To: ${f.dateTo}` });

  const removeTag = (key: keyof Filters) => {
    const next = { ...f, [key]: "" };
    setF(next);
    onApply(next);
  };

  const handleApply = () => onApply(f);

  const handleReset = () => {
    setF(EMPTY);
    onApply(EMPTY);
  };

  return (
    <div className="filter-bar">
      {/* City */}
      <div className="filter-group" style={{ minWidth: 160 }}>
        <label className="filter-label">City</label>
        <div className="filter-select-wrap">
          <select
            className="filter-select"
            value={f.city}
            onChange={e => set("city", e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Crime Type */}
      <div className="filter-group" style={{ minWidth: 160 }}>
        <label className="filter-label">Crime Type</label>
        <div className="filter-select-wrap">
          <select
            className="filter-select"
            value={f.crime}
            onChange={e => set("crime", e.target.value)}
          >
            <option value="">All Types</option>
            {CRIME_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="filter-group" style={{ minWidth: 260 }}>
        <label className="filter-label">Date Range</label>
        <div className="date-range-group">
          <input
            type="date"
            className="filter-input"
            value={f.dateFrom}
            onChange={e => set("dateFrom", e.target.value)}
          />
          <span className="date-separator">→</span>
          <input
            type="date"
            className="filter-input"
            value={f.dateTo}
            onChange={e => set("dateTo", e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="filter-actions">
        <button className="btn-primary" onClick={handleApply} disabled={loading}>
          <Search size={14} />
          {loading ? "Loading…" : "Apply"}
        </button>
        {activeTags.length > 0 && (
          <button className="btn-secondary" onClick={handleReset}>
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeTags.length > 0 && (
        <div className="active-filters">
          <SlidersHorizontal size={13} style={{ color: "var(--ink-400)", marginTop: 2 }} />
          {activeTags.map(tag => (
            <span key={tag.key} className="filter-tag">
              {tag.label}
              <button onClick={() => removeTag(tag.key)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}