import { useState, useEffect } from "react";
import { disciplinaryAPI } from "../api/api";

const P     = "#0274BE";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const SEVERITY_META = {
  minor:    { color: "#a16207", bg: "#fef9c3", label: "Minor"    },
  moderate: { color: "#c2410c", bg: "#ffedd5", label: "Moderate" },
  major:    { color: "#dc2626", bg: "#fee2e2", label: "Major"    },
};

const STATUS_META = {
  open:     { color: "#dc2626", bg: "#fee2e2", label: "Open"     },
  resolved: { color: "#15803d", bg: "#dcfce7", label: "Resolved" },
  pending:  { color: "#a16207", bg: "#fef9c3", label: "Pending"  },
  closed:   { color: GREY4,     bg: GREY2,     label: "Closed"   },
};

export default function Disciplinary() {
  const [cases,   setCases]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [expanded, setExpanded] = useState(null); // id of expanded row

  useEffect(() => {
    (async () => {
      try {
        const res = await disciplinaryAPI.getCases();
        setCases(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load disciplinary records. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === "all" ? cases : cases.filter(c => c.status === filter);

  const openCount     = cases.filter(c => c.status === "open").length;
  const resolvedCount = cases.filter(c => c.status === "resolved").length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading disciplinary records…</p>
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

      {/* HEADER */}
      <div style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Services</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Disciplinary Records ⚖️</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Total Cases", value: cases.length },
            { label: "Open",        value: openCount     },
            { label: "Resolved",    value: resolvedCount },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
              <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OPEN CASE BANNER */}
      {openCount > 0 && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: 8, padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: "0 0 3px" }}>
              You have {openCount} open disciplinary case{openCount !== 1 ? "s" : ""}
            </p>
            <p style={{ fontSize: 12.5, color: "#ef4444", margin: 0 }}>
              Please attend all scheduled hearings. Failure to appear may result in additional penalties.
            </p>
          </div>
        </div>
      )}

      {/* CLEAN RECORD NOTICE */}
      {cases.length === 0 && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 8, padding: "60px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <p style={{ fontSize: 15, color: "#15803d", fontWeight: 700, marginBottom: 6 }}>Clean disciplinary record</p>
          <p style={{ fontSize: 13, color: "#16a34a" }}>You have no disciplinary cases on record. Keep it up!</p>
        </div>
      )}

      {/* FILTER TABS */}
      {cases.length > 0 && (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "12px 16px", marginBottom: 16,
          display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 12.5, color: GREY4, fontWeight: 600, marginRight: 4 }}>Filter:</span>
          {["all", "open", "pending", "resolved", "closed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? P : GREY1,
              border: `1px solid ${filter === f ? P : GREY3}`,
              color: filter === f ? WHITE : GREY4,
              fontSize: 12.5, fontWeight: filter === f ? 700 : 500,
              padding: "5px 14px", borderRadius: 99, cursor: "pointer",
              textTransform: "capitalize", fontFamily: "inherit", transition: "all 0.15s",
            }}>
              {f === "all" ? `All (${cases.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${cases.filter(c => c.status === f).length})`}
            </button>
          ))}
        </div>
      )}

      {/* TABLE */}
      {cases.length > 0 && (
        <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Case Records</h3>
            <span style={{ fontSize: 12.5, color: GREY4 }}>{filtered.length} of {cases.length} record{cases.length !== 1 ? "s" : ""}</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ color: GREY4, fontSize: 13 }}>No cases match the selected filter.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                    {["#", "Case Reference", "Offence", "Severity", "Date", "Hearing Date", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const statusMeta   = STATUS_META[c.status]     || STATUS_META.pending;
                    const severityMeta = SEVERITY_META[c.severity] || SEVERITY_META.minor;
                    const isExpanded   = expanded === (c.id || i);
                    return (
                      <>
                        <tr key={c.id || i}
                          style={{
                            borderBottom: isExpanded ? "none" : `1px solid ${GREY3}`,
                            background: isExpanded ? `${P}05` : "transparent",
                            transition: "background 0.12s",
                            cursor: (c.description || c.resolution || c.penalty) ? "pointer" : "default",
                          }}
                          onClick={() => setExpanded(isExpanded ? null : (c.id || i))}
                          onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = GREY1; }}
                          onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                        >
                          <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                          <td style={{ padding: "13px 18px" }}>
                            <code style={{ background: GREY2, color: DARK, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                              {c.case_reference || c.reference || `CASE-${String(c.id || i + 1).padStart(4, "0")}`}
                            </code>
                          </td>
                          <td style={{ padding: "13px 18px", fontWeight: 600, color: DARK, maxWidth: 200 }}>
                            <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {c.offence || c.offense || c.description || "—"}
                            </span>
                          </td>
                          <td style={{ padding: "13px 18px" }}>
                            <span style={{ background: severityMeta.bg, color: severityMeta.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{severityMeta.label}</span>
                          </td>
                          <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                            {c.date_of_offence || c.incident_date
                              ? new Date(c.date_of_offence || c.incident_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                            {c.hearing_date
                              ? new Date(c.hearing_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                              : <span style={{ color: GREY4 }}>Not scheduled</span>}
                          </td>
                          <td style={{ padding: "13px 18px" }}>
                            <span style={{ background: statusMeta.bg, color: statusMeta.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{statusMeta.label}</span>
                          </td>
                          <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12 }}>
                            {(c.description || c.resolution || c.penalty) && (
                              <span style={{ fontSize: 14 }}>{isExpanded ? "▲" : "▼"}</span>
                            )}
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {isExpanded && (
                          <tr key={`${c.id || i}-detail`} style={{ borderBottom: `1px solid ${GREY3}` }}>
                            <td colSpan={8} style={{ padding: "0 18px 18px 52px", background: `${P}05` }}>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, paddingTop: 4 }}>
                                {c.description && (
                                  <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 5px" }}>Full Description</p>
                                    <p style={{ fontSize: 13, color: DARK, lineHeight: 1.6, margin: 0 }}>{c.description}</p>
                                  </div>
                                )}
                                {c.penalty && (
                                  <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 5px" }}>Penalty / Sanction</p>
                                    <p style={{ fontSize: 13, color: "#dc2626", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{c.penalty}</p>
                                  </div>
                                )}
                                {c.resolution && (
                                  <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 5px" }}>Resolution</p>
                                    <p style={{ fontSize: 13, color: "#15803d", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{c.resolution}</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}