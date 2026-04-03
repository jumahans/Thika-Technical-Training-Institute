import { useState, useEffect } from "react";
import { reportingAPI, referenceAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const STATUS_META = {
  reported: { color: "#15803d", bg: "#dcfce7", label: "Reported" },
  absent:   { color: "#dc2626", bg: "#fee2e2", label: "Absent"   },
};

export default function OnlineReporting() {
  const [reports,    setReports]    = useState([]);
  const [semesters,  setSemesters]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);

  const [selectedSemester, setSelectedSemester] = useState("");
  const [reportDate,       setReportDate]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [repRes, semRes] = await Promise.all([
          reportingAPI.getReporting(),
          referenceAPI.getSemesters(),
        ]);
        setReports(repRes.data?.results   || repRes.data   || []);
        setSemesters(semRes.data?.results || semRes.data   || []);
      } catch {
        setError("Failed to load reporting data. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!selectedSemester) { setError("Please select a semester.");    return; }
    if (!reportDate)       { setError("Please select a report date."); return; }
    setSubmitting(true);
    try {
      const res = await reportingAPI.createReporting({
        semester:       parseInt(selectedSemester),
        reporting_date: reportDate,
        status:         "reported",
      });
      setReports(prev => [res.data, ...prev]);
      setSelectedSemester("");
      setReportDate("");
      setShowForm(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setError(Object.values(data)[0]);
      else setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading reporting data…</p>
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>

      {/* HEADER */}
      <div style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Services</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Reporting 📝</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 18px", textAlign: "center" }}>
            <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{reports.length}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>Reports</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setError(null); }} style={{
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
            color: WHITE, fontWeight: 700, fontSize: 13,
            padding: "9px 18px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
          }}>{showForm ? "✕ Cancel" : "+ Report Attendance"}</button>
        </div>
      </div>

      {/* BANNERS */}
      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>✅</span>
          <span style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>Report submitted successfully!</span>
        </div>
      )}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>⚠️</span>
          <span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div style={{ background: WHITE, border: `1px solid ${P}`, borderRadius: 8, padding: "24px 26px", marginBottom: 24, boxShadow: `0 0 0 3px ${P}15` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "0 0 20px", paddingBottom: 14, borderBottom: `1px solid ${GREY3}` }}>
            Submit Semester Report
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Semester *</label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: selectedSemester ? DARK : GREY4, outline: "none", background: WHITE, fontFamily: "inherit", cursor: "pointer" }}
              >
                <option value="">Select semester…</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.is_current ? " (Current)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Report Date *</label>
              <input
                type="date"
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: DARK, outline: "none", background: WHITE, fontFamily: "inherit" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={() => { setShowForm(false); setError(null); }}
              style={{ padding: "10px 22px", background: GREY2, border: `1px solid ${GREY3}`, borderRadius: 6, color: DARK, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}
            >Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ padding: "10px 28px", background: submitting ? GREY4 : P, border: "none", borderRadius: 6, color: WHITE, fontWeight: 700, fontSize: 13.5, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = PDARK; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = submitting ? GREY4 : P; }}
            >{submitting ? "Submitting…" : "Submit Report"}</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Reporting History</h3>
          <span style={{ fontSize: 12.5, color: GREY4 }}>{reports.length} record{reports.length !== 1 ? "s" : ""}</span>
        </div>

        {reports.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No reports submitted yet</p>
            <p style={{ fontSize: 13, color: GREY4, marginBottom: 20 }}>Submit your semester attendance report using the button above.</p>
            <button
              onClick={() => setShowForm(true)}
              style={{ background: P, color: WHITE, fontWeight: 700, fontSize: 13.5, padding: "10px 24px", borderRadius: 6, cursor: "pointer", border: "none", fontFamily: "inherit" }}
            >+ Report Attendance</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Semester", "Report Date", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => {
                  const meta = STATUS_META[r.status] || STATUS_META.reported;
                  return (
                    <tr
                      key={r.id || i}
                      style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ padding: "13px 18px", fontWeight: 600, color: DARK }}>{r.semester_name || r.semester || "—"}</td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {r.reporting_date ? new Date(r.reporting_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "13px 18px" }}>
                        <span style={{ background: meta.bg, color: meta.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{meta.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}