import { useState, useEffect } from "react";
import { attachmentsAPI } from "../api/api";

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
  completed:{ color: "#0274BE", bg: "#dbeafe", label: "Completed"},
};

function useScreenSize() {
  const [size, setSize] = useState({
    isMobile: window.innerWidth <= 640,
    isTablet: window.innerWidth > 640 && window.innerWidth <= 1024,
  });
  useEffect(() => {
    const fn = () => setSize({
      isMobile: window.innerWidth <= 640,
      isTablet: window.innerWidth > 640 && window.innerWidth <= 1024,
    });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

export default function Attachments() {
  const { isMobile, isTablet } = useScreenSize();

  const [attachments, setAttachments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState(null);
  const [success,     setSuccess]     = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  const [form, setForm] = useState({
    company_name: "", supervisor_name: "", supervisor_phone: "",
    supervisor_email: "", start_date: "", end_date: "", location: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await attachmentsAPI.getAttachments();
        setAttachments(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load attachment records. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.company_name) { setError("Company name is required."); return; }
    if (!form.start_date)   { setError("Start date is required.");   return; }
    if (!form.end_date)     { setError("End date is required.");     return; }
    setSubmitting(true);
    try {
      const res = await attachmentsAPI.createAttachment(form);
      setAttachments(prev => [res.data, ...prev]);
      setForm({ company_name: "", supervisor_name: "", supervisor_phone: "", supervisor_email: "", start_date: "", end_date: "", location: "" });
      setShowForm(false); setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setError(Object.values(data)[0]);
      else setError("Failed to submit attachment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading attachments…</p>
      </div>
    </div>
  );

  const Field = ({ label, children }) => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`,
    borderRadius: 6, fontSize: 13.5, color: DARK, outline: "none",
    background: WHITE, fontFamily: "inherit",
  };

  // Responsive grid: 1 col on mobile, 2 cols on tablet+
  const formGridCols = isMobile ? "1fr" : "1fr 1fr";

  return (
    <div style={{ width: "100%" }}>

      {/* HEADER */}
      <div style={{
        background: P, borderRadius: 8,
        padding: isMobile ? "18px 16px" : "22px 28px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center",
        marginBottom: 24, gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Services</p>
          <h1 style={{ color: WHITE, fontSize: isMobile ? 17 : 20, fontWeight: 800, margin: 0 }}>Attachments 🏭</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 18px", textAlign: "center" }}>
            <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{attachments.length}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>Records</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(null); }}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
              color: WHITE, fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
              flex: isMobile ? 1 : "none",
            }}
          >{showForm ? "✕ Cancel" : "+ Add Attachment"}</button>
        </div>
      </div>

      {/* BANNERS */}
      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>✅</span><span style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>Attachment submitted successfully!</span>
        </div>
      )}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>⚠️</span><span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div style={{
          background: WHITE, border: `1px solid ${P}`, borderRadius: 8,
          padding: isMobile ? "18px 14px" : "24px 26px",
          marginBottom: 24, boxShadow: `0 0 0 3px ${P}15`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "0 0 20px", paddingBottom: 14, borderBottom: `1px solid ${GREY3}` }}>
            New Industrial Attachment
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: formGridCols, gap: 16, marginBottom: 16 }}>
            <Field label="Company Name *">
              <input value={form.company_name} onChange={e => set("company_name", e.target.value)} placeholder="e.g. Kenya Power Ltd" style={inputStyle} />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Nairobi, Kenya" style={inputStyle} />
            </Field>
            <Field label="Supervisor Name">
              <input value={form.supervisor_name} onChange={e => set("supervisor_name", e.target.value)} placeholder="Supervisor full name" style={inputStyle} />
            </Field>
            <Field label="Supervisor Phone">
              <input value={form.supervisor_phone} onChange={e => set("supervisor_phone", e.target.value)} placeholder="e.g. 0712345678" style={inputStyle} />
            </Field>
            <Field label="Supervisor Email">
              <input type="email" value={form.supervisor_email} onChange={e => set("supervisor_email", e.target.value)} placeholder="supervisor@company.com" style={inputStyle} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: formGridCols, gap: 16, marginBottom: 20 }}>
            <Field label="Start Date *">
              <input type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="End Date *">
              <input type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} style={inputStyle} />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              onClick={() => { setShowForm(false); setError(null); }}
              style={{
                padding: "10px 22px", background: GREY2, border: `1px solid ${GREY3}`,
                borderRadius: 6, color: DARK, fontWeight: 600, fontSize: 13.5,
                cursor: "pointer", fontFamily: "inherit",
                flex: isMobile ? 1 : "none",
              }}
            >Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: "10px 28px", background: submitting ? GREY4 : P,
                border: "none", borderRadius: 6, color: WHITE, fontWeight: 700,
                fontSize: 13.5, cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit", flex: isMobile ? 1 : "none",
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = PDARK; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = submitting ? GREY4 : P; }}
            >{submitting ? "Submitting…" : "Submit Attachment"}</button>
          </div>
        </div>
      )}

      {/* TABLE / CARDS */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{
          padding: "16px 22px", borderBottom: `1px solid ${GREY3}`,
          background: GREY1, display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Attachment Records</h3>
          <span style={{ fontSize: 12.5, color: GREY4 }}>{attachments.length} record{attachments.length !== 1 ? "s" : ""}</span>
        </div>

        {attachments.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏭</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No attachments recorded</p>
            <p style={{ fontSize: 13, color: GREY4, marginBottom: 20 }}>Submit your industrial attachment details using the button above.</p>
            <button onClick={() => setShowForm(true)} style={{ background: P, color: WHITE, fontWeight: 700, fontSize: 13.5, padding: "10px 24px", borderRadius: 6, cursor: "pointer", border: "none", fontFamily: "inherit" }}>+ Add Attachment</button>
          </div>
        ) : isMobile ? (
          /* ── MOBILE CARD VIEW ── */
          <div style={{ padding: "12px" }}>
            {attachments.map((a, i) => {
              const meta  = STATUS_META[a.status] || STATUS_META.pending;
              const start = a.start_date ? new Date(a.start_date) : null;
              const end   = a.end_date   ? new Date(a.end_date)   : null;
              const days  = start && end ? Math.round((end - start) / (1000 * 60 * 60 * 24)) : null;
              return (
                <div key={a.id || i} style={{
                  background: GREY1, border: `1px solid ${GREY3}`, borderRadius: 8,
                  padding: "14px 16px", marginBottom: 10,
                  borderLeft: `4px solid ${P}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: "0 0 2px" }}>{a.company_name || "—"}</p>
                      <p style={{ fontSize: 12, color: GREY4, margin: 0 }}>{a.location || "No location"}</p>
                    </div>
                    <span style={{ background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0 }}>{meta.label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 10, color: GREY4, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 2px" }}>Supervisor</p>
                      <p style={{ fontSize: 12.5, color: DARK, margin: 0 }}>{a.supervisor_name || "—"}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: GREY4, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 2px" }}>Duration</p>
                      <p style={{ fontSize: 12.5, color: DARK, margin: 0 }}>
                        {days !== null
                          ? <span style={{ background: `${P}12`, color: P, fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{days} days</span>
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: GREY4, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 2px" }}>Start</p>
                      <p style={{ fontSize: 12.5, color: DARK, margin: 0 }}>
                        {start ? start.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: GREY4, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 2px" }}>End</p>
                      <p style={{ fontSize: 12.5, color: DARK, margin: 0 }}>
                        {end ? end.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── DESKTOP TABLE VIEW ── */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Company", "Location", "Supervisor", "Start Date", "End Date", "Duration", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attachments.map((a, i) => {
                  const meta  = STATUS_META[a.status] || STATUS_META.pending;
                  const start = a.start_date ? new Date(a.start_date) : null;
                  const end   = a.end_date   ? new Date(a.end_date)   : null;
                  const days  = start && end ? Math.round((end - start) / (1000 * 60 * 60 * 24)) : null;
                  return (
                    <tr key={a.id || i} style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ padding: "13px 18px", fontWeight: 700, color: DARK, whiteSpace: "nowrap" }}>{a.company_name || "—"}</td>
                      <td style={{ padding: "13px 18px", color: DARK }}>{a.location || "—"}</td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>{a.supervisor_name || "—"}</td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {start ? start.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {end ? end.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "13px 18px" }}>
                        {days !== null
                          ? <span style={{ background: `${P}12`, color: P, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>{days} days</span>
                          : <span style={{ color: GREY4 }}>—</span>}
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