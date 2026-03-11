import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { resultsAPI, examCardAPI, feesAPI, unitsAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

function gradeColor(g) {
  if (!g) return GREY4;
  const f = g[0];
  if (f === "A") return "#16a34a";
  if (f === "B") return P;
  if (f === "C") return "#d97706";
  return "#dc2626";
}

function SectionTitle({ title, action, actionPath }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0 }}>{title}</h2>
      {action && (
        <Link to={actionPath} style={{ fontSize: 12.5, color: P, fontWeight: 600, textDecoration: "none" }}>
          {action} →
        </Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [units,    setUnits]    = useState([]);
  const [results,  setResults]  = useState([]);
  const [examCard, setExamCard] = useState(null);
  const [fees,     setFees]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [unitsRes, resultsRes, examRes, feesRes] = await Promise.all([
          unitsAPI.getUnits(),
          resultsAPI.getResults(),
          examCardAPI.getExamCards(),
          feesAPI.getFeeSummary(),
        ]);
        setUnits(unitsRes.data?.results || unitsRes.data || []);
        setResults(resultsRes.data?.results || resultsRes.data || []);
        setExamCard((examRes.data?.results || examRes.data || [])[0] || null);
        setFees(feesRes.data || null);
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading your dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", color: "#dc2626" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14 }}>{error}</p>
      </div>
    </div>
  );

  const totalFee    = fees?.total_fee     || fees?.total     || 0;
  const paidFee     = fees?.amount_paid   || fees?.paid      || 0;
  const balanceFee  = fees?.balance       || (totalFee - paidFee) || 0;
  const lastPay     = fees?.last_payment  || null;
  const paidPct     = totalFee > 0 ? Math.min(100, Math.round((paidFee / totalFee) * 100)) : 0;

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + (r.marks || r.score || 0), 0) / results.length)
    : 0;

  return (
    <div style={{ width: "100%", padding: 0 }}>

      {/* ── WELCOME STRIP ── */}
      <div style={{
        background: P,
        borderRadius: 8,
        padding: "22px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 4 }}>
            Student Portal Dashboard
          </p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>
            Welcome back 👋
          </h1>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: "10px 20px",
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            Exam Card
          </p>
          <p style={{ color: WHITE, fontWeight: 800, fontSize: 15, marginTop: 4, margin: 0 }}>
            {examCard ? (examCard.is_available || examCard.available ? "✅ Available" : "❌ Not Available") : "—"}
          </p>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}>
        {[
          { label: "Fee Balance",      value: balanceFee > 0 ? `KES ${balanceFee.toLocaleString()}` : "Cleared", icon: "💳" },
          { label: "Total Fee",        value: totalFee > 0 ? `KES ${totalFee.toLocaleString()}` : "—",           icon: "📊" },
          { label: "Registered Units", value: units.length || "—",                                               icon: "📚" },
          { label: "Average Score",    value: avg > 0 ? `${avg}%` : "—",                                        icon: "🎓" },
        ].map((s, i) => (
          <div key={i} style={{
            background: WHITE,
            border: `1px solid ${GREY3}`,
            borderTop: `3px solid ${P}`,
            borderRadius: 8,
            padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, margin: "0 0 8px" }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: DARK, margin: 0, lineHeight: 1 }}>{s.value}</p>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background: `${P}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FEE + EXAM CARD ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Fee Summary */}
        <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px" }}>
          <SectionTitle title="Fee Summary" action="View Payments" actionPath="/fees/payments" />

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: GREY4 }}>Payment Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: P }}>{paidPct}%</span>
            </div>
            <div style={{ height: 8, background: GREY2, borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${paidPct}%`,
                background: paidPct >= 80 ? "#16a34a" : paidPct >= 50 ? P : "#d97706",
                borderRadius: 99,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>

          {[
            { label: "Total Fee",   value: totalFee > 0 ? `KES ${totalFee.toLocaleString()}` : "—",   color: DARK,      bold: false },
            { label: "Amount Paid", value: paidFee > 0  ? `KES ${paidFee.toLocaleString()}`  : "—",   color: "#16a34a", bold: false },
            { label: "Balance Due", value: `KES ${balanceFee.toLocaleString()}`,                       color: balanceFee > 0 ? "#d97706" : "#16a34a", bold: true },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < 2 ? `1px solid ${GREY3}` : "none",
            }}>
              <span style={{ fontSize: 13.5, color: GREY4 }}>{row.label}</span>
              <span style={{ fontSize: 13.5, fontWeight: row.bold ? 700 : 600, color: row.color }}>{row.value}</span>
            </div>
          ))}

          {lastPay && (
            <div style={{
              marginTop: 16, background: GREY1, borderRadius: 6,
              padding: "10px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontSize: 11, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 2px" }}>Last Payment</p>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: DARK, margin: 0 }}>
                  KES {(lastPay.amount || 0).toLocaleString()}
                </p>
              </div>
              <p style={{ fontSize: 12, color: GREY4, margin: 0 }}>{lastPay.date || lastPay.payment_date || ""}</p>
            </div>
          )}

          <Link to="/fees/structure" style={{
            display: "block", marginTop: 16, textAlign: "center",
            padding: "10px", background: `${P}10`, borderRadius: 6,
            color: P, fontWeight: 700, fontSize: 13, textDecoration: "none",
          }}
            onMouseEnter={e => e.currentTarget.style.background = `${P}20`}
            onMouseLeave={e => e.currentTarget.style.background = `${P}10`}
          >View Fee Structure</Link>
        </div>

        {/* Exam Card */}
        <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px" }}>
          <SectionTitle title="Exam Card" action="View Full Card" actionPath="/exam-card" />

          {examCard ? (
            <>
              <div style={{
                background: (examCard.is_available || examCard.available) ? `${P}08` : GREY2,
                border: `1px solid ${(examCard.is_available || examCard.available) ? P : GREY3}`,
                borderRadius: 8, padding: "20px", marginBottom: 16, textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>
                  {(examCard.is_available || examCard.available) ? "✅" : "❌"}
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: (examCard.is_available || examCard.available) ? P : GREY4, marginBottom: 4, margin: "0 0 4px" }}>
                  {(examCard.is_available || examCard.available) ? "Exam Card Available" : "Exam Card Not Available"}
                </p>
                <p style={{ fontSize: 12.5, color: GREY4, margin: 0 }}>{examCard.semester || examCard.academic_year || ""}</p>
              </div>

              {[
                { label: "Issued Date",  value: examCard.issued_date  || examCard.issue_date  || "—" },
                { label: "Expiry Date",  value: examCard.expiry_date  || examCard.expire_date || "—" },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: i < 1 ? `1px solid ${GREY3}` : "none",
                }}>
                  <span style={{ fontSize: 13, color: GREY4 }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{row.value}</span>
                </div>
              ))}

              {(examCard.is_available || examCard.available) && (
                <Link to="/exam-card" style={{
                  display: "block", marginTop: 16, textAlign: "center",
                  padding: "11px", background: P, borderRadius: 6,
                  color: WHITE, fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = PDARK}
                  onMouseLeave={e => e.currentTarget.style.background = P}
                >Download Exam Card</Link>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: GREY4 }}>
              <p style={{ fontSize: 14 }}>No exam card data available</p>
            </div>
          )}
        </div>
      </div>

      {/* ── REGISTERED UNITS ── */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px", marginBottom: 20 }}>
        <SectionTitle title="Registered Units — Current Semester" action="Register Units" actionPath="/unit-registration" />

        {units.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: GREY1, borderBottom: `2px solid ${GREY3}` }}>
                  {["Code", "Unit Name", "Lecturer", "Schedule"].map(h => (
                    <th key={h} style={{
                      padding: "10px 14px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: GREY4,
                      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${GREY3}` }}
                    onMouseEnter={e => e.currentTarget.style.background = GREY1}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <span style={{
                        background: `${P}12`, color: P,
                        padding: "3px 8px", borderRadius: 4,
                        fontSize: 12, fontWeight: 700,
                      }}>{u.unit_code || u.code || "—"}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: DARK, fontWeight: 500 }}>
                      {u.unit_name || u.name || u.title || "—"}
                    </td>
                    <td style={{ padding: "12px 14px", color: GREY4, whiteSpace: "nowrap" }}>
                      {u.lecturer_name || u.lecturer || "—"}
                    </td>
                    <td style={{ padding: "12px 14px", color: GREY4, whiteSpace: "nowrap" }}>
                      {u.schedule || u.timetable || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: GREY4 }}>
            <p style={{ fontSize: 14 }}>No units registered for this semester.</p>
            <Link to="/unit-registration" style={{ color: P, fontWeight: 600, fontSize: 13 }}>
              Register Units →
            </Link>
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px" }}>
        <SectionTitle title="Previous Semester Results" action="View All Results" actionPath="/results" />

        {results.length > 0 ? (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ background: GREY1, borderBottom: `2px solid ${GREY3}` }}>
                    {["Code", "Unit Name", "Marks", "Grade", "Status"].map(h => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: "left",
                        fontSize: 11, fontWeight: 700, color: GREY4,
                        letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const marks  = r.marks || r.score || r.total_marks || 0;
                    const grade  = r.grade || r.letter_grade || "—";
                    const status = r.status || r.result_status || (marks >= 40 ? "Pass" : "Fail");
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${GREY3}` }}
                        onMouseEnter={e => e.currentTarget.style.background = GREY1}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <span style={{
                            background: `${P}12`, color: P,
                            padding: "3px 8px", borderRadius: 4,
                            fontSize: 12, fontWeight: 700,
                          }}>{r.unit_code || r.code || "—"}</span>
                        </td>
                        <td style={{ padding: "12px 14px", color: DARK, fontWeight: 500 }}>
                          {r.unit_name || r.name || r.title || "—"}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: GREY2, borderRadius: 99, overflow: "hidden", minWidth: 80 }}>
                              <div style={{
                                height: "100%", width: `${marks}%`,
                                background: gradeColor(grade), borderRadius: 99,
                              }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>{marks}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            background: `${gradeColor(grade)}18`,
                            color: gradeColor(grade),
                            padding: "3px 10px", borderRadius: 4,
                            fontSize: 12.5, fontWeight: 700,
                          }}>{grade}</span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            background: status === "Pass" ? "#dcfce7" : "#fee2e2",
                            color: status === "Pass" ? "#16a34a" : "#dc2626",
                            padding: "3px 10px", borderRadius: 4,
                            fontSize: 12, fontWeight: 600,
                          }}>{status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: 16, padding: "12px 14px",
              background: GREY1, borderRadius: 6,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>Semester Average</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: P }}>{avg}%</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: GREY4 }}>
            <p style={{ fontSize: 14 }}>No results available yet.</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: 24 }} />
    </div>
  );
}