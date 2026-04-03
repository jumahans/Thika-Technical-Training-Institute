import { useState, useEffect } from "react";
import { unitRegistrationAPI, unitsAPI, referenceAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const STATUS_META = {
  approved: { color: "#15803d", bg: "#dcfce7", label: "Approved" },
  pending:  { color: "#a16207", bg: "#fef9c3", label: "Pending"  },
  rejected: { color: "#dc2626", bg: "#fee2e2", label: "Rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11.5, fontWeight: 700,
      padding: "3px 10px", borderRadius: 99,
    }}>{s.label}</span>
  );
}

export default function UnitRegistration() {
  const [registrations, setRegistrations] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [semesters,      setSemesters]      = useState([]);
  const [academicYears,  setAcademicYears]  = useState([]);

  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(false);

  // Form state
  const [selectedUnits,    setSelectedUnits]    = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear,     setSelectedYear]     = useState("");
  const [showForm,         setShowForm]         = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [regRes, unitRes, semRes, yearRes] = await Promise.all([
          unitRegistrationAPI.getRegistrations(),
          unitsAPI.getAvailableUnits(),
          referenceAPI.getSemesters(),
          referenceAPI.getAcademicYears(),
        ]);
        setRegistrations(regRes.data?.results || regRes.data || []);
        setAvailableUnits(unitRes.data?.results || unitRes.data || []);
        setSemesters(semRes.data?.results || semRes.data || []);
        setAcademicYears(yearRes.data?.results || yearRes.data || []);
      } catch {
        setError("Failed to load registration data. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleUnit = (id) => {
    setSelectedUnits(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    if (!selectedSemester) { setError("Please select a semester."); return; }
    if (!selectedYear)     { setError("Please select an academic year."); return; }
    if (selectedUnits.length === 0) { setError("Please select at least one unit."); return; }

    setSubmitting(true);
    try {
      const res = await unitRegistrationAPI.createRegistration({
        semester:      parseInt(selectedSemester),
        academic_year: parseInt(selectedYear),
        unit_ids:      selectedUnits,
      });
      setRegistrations(prev => [res.data, ...prev]);
      setSelectedUnits([]);
      setSelectedSemester("");
      setSelectedYear("");
      setShowForm(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const first = Object.entries(data)[0];
        setError(`${first[1]}`);
      } else {
        setError("Failed to submit registration. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading registration data…</p>
      </div>
    </div>
  );

  if (error && registrations.length === 0 && !showForm) return (
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
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Unit Registration 📋</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { label: "Registrations", count: registrations.length },
            { label: "Approved",      count: registrations.filter(r => r.status === "approved").length },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.15)", borderRadius: 8,
              padding: "8px 18px", textAlign: "center",
            }}>
              <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.count}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
          <button
            onClick={() => { setShowForm(!showForm); setError(null); }}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
              color: WHITE, fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >{showForm ? "✕ Cancel" : "+ New Registration"}</button>
        </div>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {success && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6,
          padding: "12px 18px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>
            Registration submitted successfully! It is pending approval.
          </span>
        </div>
      )}

      {/* ── ERROR BANNER ── */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6,
          padding: "12px 18px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* ── NEW REGISTRATION FORM ── */}
      {showForm && (
        <div style={{
          background: WHITE, border: `1px solid ${P}`,
          borderRadius: 8, padding: "24px 26px",
          marginBottom: 24,
          boxShadow: `0 0 0 3px ${P}15`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "0 0 20px", paddingBottom: 14, borderBottom: `1px solid ${GREY3}` }}>
            New Unit Registration
          </h3>

          {/* Semester + Year row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Semester *
              </label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: `1px solid ${GREY3}`, borderRadius: 6,
                  fontSize: 13.5, color: selectedSemester ? DARK : GREY4,
                  outline: "none", background: WHITE, fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">Select semester…</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.academic_year_label ? `— ${s.academic_year_label}` : ""}
                    {s.is_current ? " (Current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Academic Year *
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: `1px solid ${GREY3}`, borderRadius: 6,
                  fontSize: 13.5, color: selectedYear ? DARK : GREY4,
                  outline: "none", background: WHITE, fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">Select academic year…</option>
                {academicYears.map(y => (
                  <option key={y.id} value={y.id}>
                    {y.label}{y.is_current ? " (Current)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit selection */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase" }}>
                Select Units * ({selectedUnits.length} selected)
              </label>
              {selectedUnits.length > 0 && (
                <button
                  onClick={() => setSelectedUnits([])}
                  style={{
                    background: "none", border: "none", color: GREY4,
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}
                >Clear all</button>
              )}
            </div>

              {availableUnits.length === 0 ? (
                <div style={{
                  background: GREY1, border: `1px solid ${GREY3}`, borderRadius: 6,
                  padding: "20px", color: GREY4, fontSize: 13,
                }}>
                  <p style={{ fontWeight: 700, color: DARK, marginBottom: 8 }}>Debug Info:</p>
                  <p>Units from API: {JSON.stringify(availableUnits)}</p>
                  <p>Semesters: {JSON.stringify(semesters)}</p>
                  <p>Academic Years: {JSON.stringify(academicYears)}</p>
                </div>
              ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 10,
                maxHeight: 340, overflowY: "auto",
                padding: "2px",
              }}>
                {availableUnits.map(u => {
                  const id       = u.id;
                  const checked  = selectedUnits.includes(id);
                  const code     = u.code || u.unit_code || "—";
                  const name     = u.name || u.unit_name || "—";
                  const lecturer = u.lecturer_name || u.lecturer || "—";
                  return (
                    <div
                      key={id}
                      onClick={() => toggleUnit(id)}
                      style={{
                        border: `2px solid ${checked ? P : GREY3}`,
                        borderRadius: 7,
                        padding: "12px 14px",
                        cursor: "pointer",
                        background: checked ? `${P}08` : WHITE,
                        transition: "all 0.15s",
                        userSelect: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        {/* Checkbox */}
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                          border: `2px solid ${checked ? P : GREY3}`,
                          background: checked ? P : WHITE,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          {checked && <span style={{ color: WHITE, fontSize: 11, fontWeight: 800 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ marginBottom: 4 }}>
                            <span style={{
                              background: checked ? P : `${P}12`,
                              color: checked ? WHITE : P,
                              fontSize: 10.5, fontWeight: 800,
                              padding: "2px 7px", borderRadius: 3,
                              transition: "all 0.15s",
                            }}>{code}</span>
                          </div>
                          <p style={{
                            fontSize: 13, fontWeight: 600, color: DARK,
                            margin: "0 0 3px", lineHeight: 1.3,
                          }}>{name}</p>
                          <p style={{ fontSize: 11.5, color: GREY4, margin: 0 }}>
                            👨‍🏫 {lecturer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={() => { setShowForm(false); setError(null); setSelectedUnits([]); }}
              style={{
                padding: "10px 22px", background: GREY2,
                border: `1px solid ${GREY3}`, borderRadius: 6,
                color: DARK, fontWeight: 600, fontSize: 13.5,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: "10px 28px",
                background: submitting ? GREY4 : P,
                border: "none", borderRadius: 6,
                color: WHITE, fontWeight: 700, fontSize: 13.5,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.15s",
                opacity: submitting ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = PDARK; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = submitting ? GREY4 : P; }}
            >
              {submitting ? "Submitting…" : `Submit Registration (${selectedUnits.length} unit${selectedUnits.length !== 1 ? "s" : ""})`}
            </button>
          </div>
        </div>
      )}

      {/* ── PAST REGISTRATIONS ── */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${GREY3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Registration History</h3>
          <span style={{ fontSize: 12.5, color: GREY4 }}>{registrations.length} record{registrations.length !== 1 ? "s" : ""}</span>
        </div>

        {registrations.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📋</div>
            <p style={{ fontSize: 14, color: DARK, fontWeight: 700, marginBottom: 6 }}>No registrations yet</p>
            <p style={{ fontSize: 13, color: GREY4, marginBottom: 20 }}>
              Click "New Registration" to register your units for the current semester.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: P, color: WHITE, fontWeight: 700, fontSize: 13.5,
                padding: "10px 24px", borderRadius: 6, cursor: "pointer",
                border: "none", fontFamily: "inherit",
              }}
            >+ New Registration</button>
          </div>
        ) : (
          <div>
            {registrations.map((reg, i) => (
              <div key={reg.id || i} style={{
                borderBottom: i < registrations.length - 1 ? `1px solid ${GREY3}` : "none",
              }}>
                {/* Registration header */}
                <div style={{
                  padding: "16px 22px",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", flexWrap: "wrap", gap: 10,
                  background: i % 2 === 0 ? WHITE : GREY1,
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>
                        {reg.semester_name || `Semester ${reg.semester}`}
                      </span>
                      <StatusBadge status={reg.status} />
                    </div>
                    <span style={{ fontSize: 12, color: GREY4 }}>
                      Academic Year: {reg.academic_year_label || reg.academic_year || "—"}
                      {reg.registered_at ? ` · Submitted ${new Date(reg.registered_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                    </span>
                  </div>
                  <div style={{
                    background: `${P}10`, color: P,
                    fontSize: 12.5, fontWeight: 700,
                    padding: "5px 14px", borderRadius: 99,
                  }}>
                    {(reg.units || []).length} Unit{(reg.units || []).length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Units in this registration */}
                {(reg.units || []).length > 0 && (
                  <div style={{
                    padding: "12px 22px 16px",
                    background: i % 2 === 0 ? WHITE : GREY1,
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: 8,
                    }}>
                      {(reg.units || []).map((u, ui) => (
                        <div key={u.id || ui} style={{
                          background: GREY2, borderRadius: 5,
                          padding: "8px 12px",
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <span style={{
                            background: `${P}12`, color: P,
                            fontSize: 10.5, fontWeight: 800,
                            padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap",
                          }}>{u.code || u.unit_code || "—"}</span>
                          <span style={{
                            fontSize: 12.5, color: DARK, fontWeight: 500,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{u.name || u.unit_name || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}