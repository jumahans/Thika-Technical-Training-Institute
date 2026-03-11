import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { unitsAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function Units() {
  const [units,   setUnits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [view,    setView]    = useState("grid"); // "grid" | "table"

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsAPI.getUnits();
        setUnits(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load units. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = units.filter(u =>
    !search ||
    (u.code || u.unit_code || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.name || u.unit_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.lecturer_name || u.lecturer || "").toLowerCase().includes(search.toLowerCase())
  );

  // Group by semester
  const bySemester = filtered.reduce((acc, u) => {
    const sem = u.semester_name || u.semester || "Semester";
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(u);
    return acc;
  }, {});

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading units…</p>
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
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>My Units 📚</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 8,
            padding: "10px 20px", textAlign: "center",
          }}>
            <p style={{ color: WHITE, fontWeight: 800, fontSize: 20, margin: 0, lineHeight: 1 }}>{units.length}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>Total Units</p>
          </div>
          <Link to="/unit-registration" style={{
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
            color: WHITE, fontWeight: 700, fontSize: 13,
            padding: "9px 18px", borderRadius: 6,
            textDecoration: "none", whiteSpace: "nowrap",
          }}>+ Register Units</Link>
        </div>
      </div>

      {/* ── SEARCH + VIEW TOGGLE ── */}
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
            placeholder="Search by code, name, lecturer…"
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
        {/* View toggle */}
        <div style={{ display: "flex", background: GREY1, borderRadius: 6, padding: 3, gap: 2 }}>
          {[{ id: "grid", icon: "⊞" }, { id: "table", icon: "☰" }].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              background: view === v.id ? WHITE : "transparent",
              border: view === v.id ? `1px solid ${GREY3}` : "1px solid transparent",
              borderRadius: 5, padding: "5px 14px",
              fontSize: 14, cursor: "pointer",
              color: view === v.id ? P : GREY4,
              boxShadow: view === v.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s",
            }}>{v.icon}</button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: GREY4 }}>
          {filtered.length} unit{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── EMPTY ── */}
      {filtered.length === 0 && (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "60px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No units found</p>
          <p style={{ fontSize: 13, color: GREY4, marginBottom: 20 }}>
            {search ? "Try adjusting your search." : "No units assigned to your course and year yet."}
          </p>
          <Link to="/unit-registration" style={{
            background: P, color: WHITE, fontWeight: 700, fontSize: 13.5,
            padding: "10px 24px", borderRadius: 6, textDecoration: "none",
          }}>Go to Unit Registration</Link>
        </div>
      )}

      {/* ── CONTENT ── */}
      {filtered.length > 0 && Object.entries(bySemester).map(([semName, semUnits]) => (
        <div key={semName} style={{ marginBottom: 24 }}>

          {/* Semester label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
          }}>
            <div style={{
              background: `${P}12`, color: P, fontSize: 12, fontWeight: 700,
              padding: "4px 14px", borderRadius: 99, letterSpacing: 0.5,
            }}>{semName}</div>
            <div style={{ flex: 1, height: 1, background: GREY3 }} />
            <span style={{ fontSize: 12, color: GREY4 }}>{semUnits.length} unit{semUnits.length !== 1 ? "s" : ""}</span>
          </div>

          {/* GRID VIEW */}
          {view === "grid" && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}>
              {semUnits.map((u, i) => {
                const code    = u.code || u.unit_code || "—";
                const name    = u.name || u.unit_name || "—";
                const lect    = u.lecturer_name || u.lecturer || "—";
                const yr      = u.academic_year || u.year_of_study || "—";

                return (
                  <div key={u.id || i} style={{
                    background: WHITE,
                    border: `1px solid ${GREY3}`,
                    borderTop: `3px solid ${P}`,
                    borderRadius: 8,
                    padding: "18px 20px",
                    transition: "box-shadow 0.15s, transform 0.15s",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {/* Code badge */}
                    <div style={{ marginBottom: 10 }}>
                      <span style={{
                        background: `${P}12`, color: P,
                        fontSize: 11.5, fontWeight: 800,
                        padding: "3px 10px", borderRadius: 4,
                        letterSpacing: 0.5,
                      }}>{code}</span>
                    </div>

                    <h3 style={{
                      fontSize: 14, fontWeight: 700, color: DARK,
                      margin: "0 0 14px", lineHeight: 1.4,
                    }}>{name}</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {[
                        { icon: "👨‍🏫", label: "Lecturer", value: lect },
                        { icon: "📅", label: "Academic Year", value: yr },
                      ].map((row, ri) => (
                        <div key={ri} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13 }}>{row.icon}</span>
                          <span style={{ fontSize: 12, color: GREY4 }}>{row.label}:</span>
                          <span style={{ fontSize: 12.5, color: DARK, fontWeight: 600, marginLeft: "auto" }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {view === "table" && (
            <div style={{
              background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: GREY1, borderBottom: `2px solid ${GREY3}` }}>
                      {["Code", "Unit Name", "Lecturer", "Academic Year"].map(h => (
                        <th key={h} style={{
                          padding: "11px 16px", textAlign: "left",
                          fontSize: 11, fontWeight: 700, color: GREY4,
                          letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {semUnits.map((u, i) => (
                      <tr key={u.id || i}
                        style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = GREY1}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                          <span style={{
                            background: `${P}12`, color: P,
                            padding: "3px 9px", borderRadius: 4,
                            fontSize: 12, fontWeight: 700,
                          }}>{u.code || u.unit_code || "—"}</span>
                        </td>
                        <td style={{ padding: "13px 16px", color: DARK, fontWeight: 500 }}>
                          {u.name || u.unit_name || "—"}
                        </td>
                        <td style={{ padding: "13px 16px", color: GREY4, whiteSpace: "nowrap" }}>
                          {u.lecturer_name || u.lecturer || "—"}
                        </td>
                        <td style={{ padding: "13px 16px", color: GREY4, whiteSpace: "nowrap" }}>
                          {u.academic_year || u.year_of_study || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ height: 24 }} />
    </div>
  );
}