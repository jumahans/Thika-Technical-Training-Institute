import { useState, useEffect } from "react";
import { lostCardAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const STATUS_META = {
  approved:    { color: "#15803d", bg: "#dcfce7", label: "Approved"     },
  pending:     { color: "#a16207", bg: "#fef9c3", label: "Pending"      },
  rejected:    { color: "#dc2626", bg: "#fee2e2", label: "Rejected"     },
  processing:  { color: "#0274BE", bg: "#dbeafe", label: "Processing"   },
  ready:       { color: "#7c3aed", bg: "#ede9fe", label: "Ready to Pick"},
  collected:   { color: "#15803d", bg: "#dcfce7", label: "Collected"    },
};

export default function LostCard() {
  const [requests,   setRequests]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);

  const [reason,      setReason]      = useState("");
  const [reportDate,  setReportDate]  = useState("");
  const [policeAbstract, setPoliceAbstract] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await lostCardAPI.getRequests();
        setRequests(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load ID card requests. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!reason)     { setError("Please describe the reason for loss."); return; }
    if (!reportDate) { setError("Please provide the date of loss.");     return; }
    setSubmitting(true);
    try {
      const res = await lostCardAPI.createRequest({
        reason,
        date_lost:       reportDate,
        police_abstract: policeAbstract.trim() || undefined,
      });
      setRequests(prev => [res.data, ...prev]);
      setReason(""); setReportDate(""); setPoliceAbstract("");
      setShowForm(false); setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setError(Object.values(data)[0]);
      else setError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading ID card requests…</p>
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
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Lost ID Card 🪪</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { label: "Requests",  value: requests.length },
            { label: "Pending",   value: requests.filter(r => r.status === "pending").length },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
              <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
          <button onClick={() => { setShowForm(!showForm); setError(null); }} style={{
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
            color: WHITE, fontWeight: 700, fontSize: 13,
            padding: "9px 18px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
          }}>{showForm ? "✕ Cancel" : "+ Report Lost Card"}</button>
        </div>
      </div>

      {/* INFO NOTICE */}
      <div style={{
        background: `${P}08`, border: `1px solid ${P}25`, borderRadius: 8,
        padding: "14px 20px", marginBottom: 20,
        display: "flex", alignItems: "flex-start", gap: 12,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: 13, color: DARK, lineHeight: 1.6, margin: 0 }}>
          To apply for a replacement ID card, fill in the form below. You will be required to pay a replacement fee at the Finance office.
          A police abstract is recommended where applicable. Your new card will be ready for collection once your request is approved.
        </p>
      </div>

      {/* BANNERS */}
      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>✅</span><span style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>Request submitted! Please visit the office and pay the replacement fee.</span>
        </div>
      )}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>⚠️</span><span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div style={{ background: WHITE, border: `1px solid ${P}`, borderRadius: 8, padding: "24px 26px", marginBottom: 24, boxShadow: `0 0 0 3px ${P}15` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "0 0 20px", paddingBottom: 14, borderBottom: `1px solid ${GREY3}` }}>
            Report Lost ID Card
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Date of Loss *</label>
              <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: DARK, outline: "none", background: WHITE, fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Police Abstract No. (optional)</label>
              <input value={policeAbstract} onChange={e => setPoliceAbstract(e.target.value)} placeholder="e.g. OB/123/2024"
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: DARK, outline: "none", background: WHITE, fontFamily: "inherit" }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Reason for Loss *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} placeholder="Describe how the ID was lost (e.g. misplaced during travel, stolen at market…)"
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: DARK, outline: "none", background: WHITE, fontFamily: "inherit", resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => { setShowForm(false); setError(null); }}
              style={{ padding: "10px 22px", background: GREY2, border: `1px solid ${GREY3}`, borderRadius: 6, color: DARK, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ padding: "10px 28px", background: submitting ? GREY4 : P, border: "none", borderRadius: 6, color: WHITE, fontWeight: 700, fontSize: 13.5, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = PDARK; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = submitting ? GREY4 : P; }}
            >{submitting ? "Submitting…" : "Submit Request"}</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Request History</h3>
          <span style={{ fontSize: 12.5, color: GREY4 }}>{requests.length} record{requests.length !== 1 ? "s" : ""}</span>
        </div>

        {requests.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🪪</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No lost card requests</p>
            <p style={{ fontSize: 13, color: GREY4, marginBottom: 20 }}>If you have lost your ID card, report it using the button above.</p>
            <button onClick={() => setShowForm(true)} style={{ background: P, color: WHITE, fontWeight: 700, fontSize: 13.5, padding: "10px 24px", borderRadius: 6, cursor: "pointer", border: "none", fontFamily: "inherit" }}>+ Report Lost Card</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Date of Loss", "Police Abstract", "Reason", "Submitted On", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => {
                  const meta = STATUS_META[r.status] || STATUS_META.pending;
                  return (
                    <tr key={r.id || i} style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {r.date_lost ? new Date(r.date_lost).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "13px 18px" }}>
                        {r.police_abstract
                          ? <code style={{ background: GREY2, color: DARK, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{r.police_abstract}</code>
                          : <span style={{ color: GREY4, fontSize: 12.5 }}>Not provided</span>}
                      </td>
                      <td style={{ padding: "13px 18px", color: DARK, maxWidth: 240 }}>
                        <span style={{
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>{r.reason || "—"}</span>
                      </td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "13px 18px" }}>
                        <span style={{ background: meta.bg, color: meta.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>{meta.label}</span>
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