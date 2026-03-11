import { useState, useEffect } from "react";
import { resultsAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const GRADE_META = {
  mastery:       { label: "Mastery",       color: "#15803d", bg: "#dcfce7", bar: "#22c55e", score: 90 },
  proficient:    { label: "Proficient",    color: "#1d4ed8", bg: "#dbeafe", bar: "#3b82f6", score: 75 },
  competent:     { label: "Competent",     color: "#a16207", bg: "#fef9c3", bar: "#eab308", score: 60 },
  not_competent: { label: "Not Competent", color: "#dc2626", bg: "#fee2e2", bar: "#ef4444", score: 30 },
};

function gradeScore(grade) {
  return GRADE_META[grade]?.score ?? 0;
}

function GradeBadge({ grade }) {
  const meta = GRADE_META[grade] || { label: grade || "—", color: GREY4, bg: GREY2 };
  return (
    <span style={{
      background: meta.bg, color: meta.color,
      fontSize: 11.5, fontWeight: 700,
      padding: "3px 10px", borderRadius: 99,
      whiteSpace: "nowrap",
    }}>{meta.label}</span>
  );
}

function ScoreBar({ grade }) {
  const meta  = GRADE_META[grade];
  const score = meta?.score ?? 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 90, height: 6, background: GREY2, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${score}%`,
          background: meta?.bar || GREY4,
          borderRadius: 99,
          transition: "width 0.5s ease",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: meta?.color || GREY4 }}>{score}%</span>
    </div>
  );
}

export default function Results() {
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState("all"); // "all" | grade key
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState({});    // {semesterKey: bool}

  useEffect(() => {
    (async () => {
      try {
        const res = await resultsAPI.getResults();
        const data = res.data?.results || res.data || [];
        setResults(data);
        // Auto-expand all semesters on load
        const grouped = groupBySemester(data);
        const initial = {};
        Object.keys(grouped).forEach(k => { initial[k] = true; });
        setExpanded(initial);
      } catch {
        setError("Failed to load results. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function groupBySemester(data) {
    return data.reduce((acc, r) => {
      const key = r.semester_name
        ? `${r.semester_name}${r.academic_year ? ` · ${r.academic_year}` : ""}`
        : r.semester
        ? `Semester ${r.semester}`
        : "Results";
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
  }

  const filtered = results.filter(r => {
    const matchGrade = filter === "all" || r.grade === filter;
    const matchSearch = !search ||
      (r.unit_code || r.code || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.unit_name || r.name || r.title || "").toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const bySemester = groupBySemester(filtered);

  // Overall stats from ALL results (unfiltered)
  const totalUnits   = results.length;
  const passCount    = results.filter(r => r.grade && r.grade !== "not_competent").length;
  const failCount    = results.filter(r => r.grade === "not_competent").length;
  const masteryCount = results.filter(r => r.grade === "mastery").length;
  const avgScore     = totalUnits > 0
    ? Math.round(results.reduce((s, r) => s + gradeScore(r.grade), 0) / totalUnits)
    : 0;

  const toggleSem = key => setExpanded(p => ({ ...p, [key]: !p[key] }));

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading results…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", color: "#dc2626" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14 }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>

      {/* ── HEADER ── */}
      <div style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Academic Progress</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Academic Results 🎓</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Total Units",  value: totalUnits },
            { label: "Passed",       value: passCount  },
            { label: "Not Competent",value: failCount  },
            { label: "Avg Score",    value: avgScore > 0 ? `${avgScore}%` : "—" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.15)", borderRadius: 8,
              padding: "8px 16px", textAlign: "center",
            }}>
              <p style={{ color: WHITE, fontWeight: 800, fontSize: 17, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10.5, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── GRADE SUMMARY CARDS ── */}
      {totalUnits > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {Object.entries(GRADE_META).map(([key, meta]) => {
            const count = results.filter(r => r.grade === key).length;
            const pct   = totalUnits > 0 ? Math.round((count / totalUnits) * 100) : 0;
            return (
              <div
                key={key}
                onClick={() => setFilter(filter === key ? "all" : key)}
                style={{
                  background: WHITE,
                  border: `2px solid ${filter === key ? meta.color : GREY3}`,
                  borderRadius: 8, padding: "16px 18px",
                  cursor: "pointer", transition: "all 0.15s",
                  boxShadow: filter === key ? `0 0 0 3px ${meta.color}20` : "none",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
                onMouseLeave={e => { if (filter !== key) e.currentTarget.style.borderColor = GREY3; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 24, fontWeight: 800, color: meta.color, margin: "0 0 2px", lineHeight: 1 }}>
                      {count}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: DARK, margin: 0 }}>{meta.label}</p>
                  </div>
                  <div style={{
                    background: meta.bg, color: meta.color,
                    fontSize: 12, fontWeight: 700,
                    padding: "3px 8px", borderRadius: 99,
                  }}>{pct}%</div>
                </div>
                {/* Mini bar */}
                <div style={{ marginTop: 12, height: 4, background: GREY2, borderRadius: 99 }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: meta.bar, borderRadius: 99,
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SEARCH + FILTER BAR ── */}
      <div style={{
        background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
        padding: "14px 18px", marginBottom: 20,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            fontSize: 14, pointerEvents: "none",
          }}>🔍</span>
          <input
            placeholder="Search by unit code or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px 8px 34px",
              border: `1px solid ${GREY3}`, borderRadius: 6,
              fontSize: 13, color: DARK, outline: "none",
              background: GREY1, fontFamily: "inherit",
            }}
          />
        </div>
        {filter !== "all" && (
          <button
            onClick={() => setFilter("all")}
            style={{
              background: GREY2, border: `1px solid ${GREY3}`,
              borderRadius: 5, padding: "7px 14px",
              fontSize: 12.5, color: DARK, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span>✕</span>
            <span>Clear filter: {GRADE_META[filter]?.label}</span>
          </button>
        )}
        <span style={{ fontSize: 13, color: GREY4, whiteSpace: "nowrap" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── EMPTY ── */}
      {results.length === 0 && (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "60px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📊</div>
          <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No results yet</p>
          <p style={{ fontSize: 13.5, color: GREY4, lineHeight: 1.6 }}>
            Results will appear here once they have been recorded by your lecturers.
          </p>
        </div>
      )}

      {filtered.length === 0 && results.length > 0 && (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "48px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>📭</div>
          <p style={{ fontSize: 14, color: DARK, fontWeight: 700, marginBottom: 6 }}>No results match</p>
          <p style={{ fontSize: 13, color: GREY4 }}>Try adjusting your search or filter.</p>
        </div>
      )}

      {/* ── RESULTS BY SEMESTER ── */}
      {Object.entries(bySemester).map(([semKey, semResults]) => {
        const isOpen    = expanded[semKey] !== false;
        const semPass   = semResults.filter(r => r.grade && r.grade !== "not_competent").length;
        const semFail   = semResults.filter(r => r.grade === "not_competent").length;
        const semAvg    = semResults.length > 0
          ? Math.round(semResults.reduce((s, r) => s + gradeScore(r.grade), 0) / semResults.length)
          : 0;

        return (
          <div key={semKey} style={{ marginBottom: 16 }}>
            {/* Semester header — clickable */}
            <div
              onClick={() => toggleSem(semKey)}
              style={{
                background: WHITE, border: `1px solid ${GREY3}`,
                borderRadius: isOpen ? "8px 8px 0 0" : 8,
                padding: "14px 20px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", cursor: "pointer",
                userSelect: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = GREY1}
              onMouseLeave={e => e.currentTarget.style.background = WHITE}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `${P}12`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 15,
                }}>📖</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>{semKey}</p>
                  <p style={{ fontSize: 12, color: GREY4, margin: "2px 0 0" }}>
                    {semResults.length} unit{semResults.length !== 1 ? "s" : ""} ·
                    {" "}{semPass} passed · {semFail} not competent · Avg {semAvg}%
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  background: semFail > 0 ? "#fee2e2" : "#dcfce7",
                  color: semFail > 0 ? "#dc2626" : "#15803d",
                  fontSize: 12, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 99,
                }}>
                  {semFail > 0 ? `${semFail} Not Competent` : "All Passed"}
                </div>
                <span style={{
                  fontSize: 16, color: GREY4,
                  transform: isOpen ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s", display: "inline-block",
                }}>›</span>
              </div>
            </div>

            {/* Results table */}
            {isOpen && (
              <div style={{
                border: `1px solid ${GREY3}`, borderTop: "none",
                borderRadius: "0 0 8px 8px", overflow: "hidden",
              }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                    <thead>
                      <tr style={{ background: GREY1, borderBottom: `2px solid ${GREY3}` }}>
                        {["#", "Unit Code", "Unit Name", "Score Indicator", "Grade", "Status"].map(h => (
                          <th key={h} style={{
                            padding: "11px 16px", textAlign: "left",
                            fontSize: 11, fontWeight: 700, color: GREY4,
                            letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {semResults.map((r, i) => {
                        const isPass = r.grade && r.grade !== "not_competent";
                        return (
                          <tr key={r.id || i}
                            style={{ borderBottom: i < semResults.length - 1 ? `1px solid ${GREY3}` : "none", transition: "background 0.12s" }}
                            onMouseEnter={e => e.currentTarget.style.background = GREY1}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "13px 16px", color: GREY4, fontSize: 12, fontWeight: 600 }}>
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                              <span style={{
                                background: `${P}12`, color: P,
                                padding: "3px 9px", borderRadius: 4,
                                fontSize: 12, fontWeight: 700,
                              }}>{r.unit_code || r.code || "—"}</span>
                            </td>
                            <td style={{ padding: "13px 16px", color: DARK, fontWeight: 500 }}>
                              {r.unit_name || r.name || r.title || "—"}
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <ScoreBar grade={r.grade} />
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <GradeBadge grade={r.grade} />
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <span style={{
                                background: isPass ? "#dcfce7" : "#fee2e2",
                                color: isPass ? "#15803d" : "#dc2626",
                                fontSize: 11.5, fontWeight: 600,
                                padding: "3px 10px", borderRadius: 99,
                              }}>
                                {isPass ? "Pass" : "Fail"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Semester summary footer */}
                <div style={{
                  padding: "12px 18px",
                  background: GREY1, borderTop: `2px solid ${GREY3}`,
                  display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: GREY4, fontWeight: 600 }}>Semester Average:</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: P }}>{semAvg}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {Object.entries(GRADE_META).map(([key, meta]) => {
                      const cnt = semResults.filter(r => r.grade === key).length;
                      if (cnt === 0) return null;
                      return (
                        <span key={key} style={{
                          background: meta.bg, color: meta.color,
                          fontSize: 11.5, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 99,
                        }}>{cnt} {meta.label}</span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── OVERALL SUMMARY ── */}
      {results.length > 0 && (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`,
          borderTop: `3px solid ${P}`,
          borderRadius: 8, padding: "20px 24px",
          marginTop: 8,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
              Overall Academic Performance
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: P, margin: 0 }}>
              {avgScore}% Average
            </p>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Total Units",  value: totalUnits,   color: DARK },
              { label: "Passed",       value: passCount,    color: "#15803d" },
              { label: "Not Competent",value: failCount,    color: "#dc2626" },
              { label: "Mastery",      value: masteryCount, color: "#0274BE" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: "0 0 2px", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: GREY4, margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}