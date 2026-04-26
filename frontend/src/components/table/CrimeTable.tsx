import React, { useMemo, useState } from "react";
import { Search, AlertTriangle, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CrimeRecord, SortConfig } from "../../types";

type Props = { data: CrimeRecord[] };

const PAGE_SIZE = 12;

export default function CrimeTable({ data }: Props) {
  const [search, setSearch]           = useState("");
  const [onlyAnomalies, setOnlyAnom]  = useState(false);
  const [sort, setSort]               = useState<SortConfig>({ key: "date", dir: "desc" });
  const [page, setPage]               = useState(1);

  // Filter
  const filtered = useMemo(() => {
    let d = onlyAnomalies ? data.filter(r => r.anomaly === 1) : data;
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(r =>
        r.city.toLowerCase().includes(q) ||
        r.crime.toLowerCase().includes(q) ||
        r.date.includes(q)
      );
    }
    return d;
  }, [data, search, onlyAnomalies]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === "number" ? (av as number) - (bv as number)
                : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sort]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: keyof CrimeRecord) => {
    setSort(prev => prev.key === key
      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { key, dir: "desc" }
    );
    setPage(1);
  };

  const SortIcon = ({ col }: { col: keyof CrimeRecord }) => {
    if (sort.key !== col) return <ChevronsUpDown size={12} className="sort-arrow" />;
    return sort.dir === "asc"
      ? <ChevronUp size={12} className="sort-arrow" style={{ opacity: 1, color: "var(--orange-500)" }} />
      : <ChevronDown size={12} className="sort-arrow" style={{ opacity: 1, color: "var(--orange-500)" }} />;
  };

  const anomalyCount = data.filter(d => d.anomaly === 1).length;

  return (
    <div className="table-card">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-title">
          Crime Records
          <span style={{ fontSize: 12, color: "var(--ink-400)", fontWeight: 400, marginLeft: 8 }}>
            {filtered.length.toLocaleString()} rows
          </span>
        </div>

        <div className="search-input-wrap">
          <Search size={14} />
          <input
            className="search-input"
            placeholder="Search city, crime, date…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <button
          className={`toggle-btn ${onlyAnomalies ? "active" : ""}`}
          onClick={() => { setOnlyAnom(v => !v); setPage(1); }}
        >
          <AlertTriangle size={13} />
          Anomalies {anomalyCount > 0 && `(${anomalyCount})`}
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {(["city","crime","date","count"] as (keyof CrimeRecord)[]).map(col => (
                <th key={col} onClick={() => handleSort(col)}>
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  <SortIcon col={col} />
                </th>
              ))}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-icon"><Search size={22} /></div>
                      <div className="empty-title">No results found</div>
                      <div className="empty-sub">Try a different search term or filter</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <motion.tr
                    key={`${row.city}-${row.crime}-${row.date}-${i}`}
                    className={row.anomaly === 1 ? "row-anomaly" : ""}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                  >
                    <td style={{ fontWeight: 600 }}>{row.city}</td>
                    <td>
                      <span className="badge badge-crime">{row.crime}</span>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 13 }}>{row.date}</td>
                    <td style={{ fontWeight: 700 }}>{row.count}</td>
                    <td>
                      {row.anomaly === 1
                        ? <span className="badge badge-anomaly">⚠ Anomaly</span>
                        : <span className="badge badge-normal">✓ Normal</span>
                      }
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <span>
          Page {page} of {totalPages} · {sorted.length.toLocaleString()} total
        </span>
        <div className="pagination-btns">
          <button className="pg-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            return (
              <button
                key={p}
                className={`pg-btn ${p === page ? "current" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            );
          })}
          <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          <button className="pg-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}