import { useState, useEffect } from "react";
import { feesAPI } from "../api/api";
import { printToPDF } from "../utils/pdfUtils";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const responsiveStyles = `
  @media (max-width: 640px) {
    .fsm-header { padding: 16px 16px !important; }
    .fsm-header h1 { font-size: 17px !important; }
    .fsm-header-right { width: 100%; }
    .fsm-download-btn { width: 100%; justify-content: center !important; }
    .fsm-stat-cards { grid-template-columns: 1fr !important; gap: 10px !important; }
    .fsm-stat-card { padding: 16px 16px !important; }
    .fsm-stat-value { font-size: 17px !important; }
    .fsm-progress { padding: 16px 16px !important; }
    .fsm-section-title { padding: 12px 14px !important; }
    .fsm-table th, .fsm-table td { padding: 10px 10px !important; font-size: 12px !important; }
    .fsm-balance-amount { font-size: 16px !important; }
  }
  @media (max-width: 400px) {
    .fsm-stat-cards { grid-template-columns: 1fr !important; }
  }
`;

export default function FeeSummary() {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = responsiveStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [sumRes, payRes] = await Promise.all([
          feesAPI.getFeeSummary(),
          feesAPI.getPayments(),
        ]);
        setSummary(sumRes.data || null);
        const pays = payRes.data?.results || payRes.data || [];
        setPayments(pays);
      } catch {
        setError("Failed to load fee summary. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRequired = Number(summary?.total_required || summary?.total_fee || summary?.total || 0);
  const totalPaid     = Number(summary?.total_paid     || summary?.amount_paid || summary?.paid || 0);
  const balance       = Number(summary?.balance        || (totalRequired - totalPaid) || 0);
  const paidPct       = totalRequired > 0 ? Math.min(100, Math.round((totalPaid / totalRequired) * 100)) : 0;

  const barColor = paidPct >= 80 ? "#15803d" : paidPct >= 50 ? P : "#d97706";

  const recentPayments = payments.filter(p => p.verified).slice(0, 5);

  const bySemester = payments.filter(p => p.verified).reduce((acc, p) => {
    const key = p.semester_name || `Semester ${p.semester}` || "Other";
    if (!acc[key]) acc[key] = { semester: key, year: p.academic_year_label || p.academic_year || "—", total: 0, count: 0 };
    acc[key].total += Number(p.amount_paid || 0);
    acc[key].count += 1;
    return acc;
  }, {});
  const semRows = Object.values(bySemester);

  const handleDownload = () => {
    const semTable = semRows.length > 0 ? `
      <h2 class="pdf-section-title">Payment Breakdown by Semester</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Semester</th>
            <th>Academic Year</th>
            <th>Payments Made</th>
            <th>Amount Paid (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${semRows.map((r, i) => `
            <tr>
              <td>${String(i + 1).padStart(2, "0")}</td>
              <td>${r.semester}</td>
              <td>${r.year}</td>
              <td>${r.count}</td>
              <td><strong>KES ${r.total.toLocaleString()}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    ` : "";

    const recentTable = recentPayments.length > 0 ? `
      <h2 class="pdf-section-title">Recent Verified Payments</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Transaction Ref</th>
            <th>Method</th>
            <th>Amount (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${recentPayments.map((p, i) => `
            <tr>
              <td>${String(i + 1).padStart(2, "0")}</td>
              <td>${p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
              <td>${p.transaction_ref || "—"}</td>
              <td>${p.payment_method ? p.payment_method.toUpperCase() : "—"}</td>
              <td><strong>KES ${Number(p.amount_paid || 0).toLocaleString()}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    ` : "";

    const html = `
      <h2 class="pdf-section-title">Fee Summary Statement</h2>

      <div class="summary-grid">
        <div class="summary-box">
          <div class="label">Total Fees Required</div>
          <div class="value">KES ${totalRequired.toLocaleString()}</div>
        </div>
        <div class="summary-box success">
          <div class="label">Total Amount Paid</div>
          <div class="value">KES ${totalPaid.toLocaleString()}</div>
        </div>
        <div class="summary-box ${balance > 0 ? "danger" : "success"}">
          <div class="label">Outstanding Balance</div>
          <div class="value">KES ${balance.toLocaleString()}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount (KES)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Fees Required</td>
            <td>KES ${totalRequired.toLocaleString()}</td>
            <td><span class="badge badge-grey">Required</span></td>
          </tr>
          <tr>
            <td>Total Amount Paid (Verified)</td>
            <td>KES ${totalPaid.toLocaleString()}</td>
            <td><span class="badge badge-green">Paid</span></td>
          </tr>
          <tr style="background:#eff6ff;">
            <td><strong>Outstanding Balance</strong></td>
            <td><strong>KES ${balance.toLocaleString()}</strong></td>
            <td>
              <span class="badge ${balance > 0 ? "badge-red" : "badge-green"}">
                ${balance > 0 ? "Unpaid" : "Cleared"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">
        Payment Progress: ${paidPct}% of total fees paid.
      </p>

      ${semTable}
      ${recentTable}
    `;

    printToPDF(html, "Fee Summary Statement — Thika TTI");
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading fee summary…</p>
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
      <div className="fsm-header" style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Finance</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Fee Summary 📊</h1>
        </div>
        <div className="fsm-header-right">
          <button
            className="fsm-download-btn"
            onClick={handleDownload}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
              color: WHITE, fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7,
            }}
          >
            <span>⬇️</span> Download PDF
          </button>
        </div>
      </div>

      {/* ── SUMMARY STAT CARDS ── */}
      <div className="fsm-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          {
            label: "Total Fees Required",
            value: totalRequired > 0 ? `KES ${totalRequired.toLocaleString()}` : "—",
            icon: "💰", color: DARK, bg: WHITE, border: GREY3, topBorder: P,
          },
          {
            label: "Total Paid (Verified)",
            value: `KES ${totalPaid.toLocaleString()}`,
            icon: "✅", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", topBorder: "#22c55e",
          },
          {
            label: "Outstanding Balance",
            value: `KES ${balance.toLocaleString()}`,
            icon: balance > 0 ? "⚠️" : "🎉",
            color: balance > 0 ? "#d97706" : "#15803d",
            bg: balance > 0 ? "#fffbeb" : "#f0fdf4",
            border: balance > 0 ? "#fde68a" : "#bbf7d0",
            topBorder: balance > 0 ? "#f59e0b" : "#22c55e",
          },
        ].map(s => (
          <div className="fsm-stat-card" key={s.label} style={{
            background: s.bg, border: `1px solid ${s.border}`,
            borderTop: `3px solid ${s.topBorder}`,
            borderRadius: 8, padding: "20px 22px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              background: WHITE, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}>{s.icon}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
                {s.label}
              </p>
              <p className="fsm-stat-value" style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1, wordBreak: "break-word" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PROGRESS CARD ── */}
      <div className="fsm-progress" style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 26px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Payment Progress</h3>
          <span style={{ fontSize: 16, fontWeight: 800, color: barColor }}>{paidPct}%</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 14, background: GREY2, borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
          <div style={{
            height: "100%", width: `${paidPct}%`,
            background: barColor, borderRadius: 99,
            transition: "width 0.8s ease",
            position: "relative",
          }}>
            {paidPct > 10 && (
              <span style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                color: WHITE, fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
              }}>{paidPct}%</span>
            )}
          </div>
        </div>

        {/* Balance status message */}
        <p style={{
          fontSize: 12.5, color: balance > 0 ? "#d97706" : "#15803d",
          fontWeight: 600, margin: 0,
        }}>
          {balance > 0
            ? `You have an outstanding balance of KES ${balance.toLocaleString()}. Please clear this to avoid academic disruptions.`
            : "🎉 Your fees are fully cleared! No outstanding balance."}
        </p>
      </div>

      {/* ── FEE BREAKDOWN TABLE ── */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
        <div className="fsm-section-title" style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Fee Summary Table</h3>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table className="fsm-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 420 }}>
            <thead>
              <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                {["Description", "Amount (KES)", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "12px 18px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: GREY4,
                    letterSpacing: 0.8, textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  description: "Total Fees Required",
                  amount: totalRequired,
                  badge: { text: "Required", color: GREY4, bg: GREY2 },
                },
                {
                  description: "Total Amount Paid (Verified)",
                  amount: totalPaid,
                  badge: { text: "Paid", color: "#15803d", bg: "#dcfce7" },
                },
              ].map((row, i) => (
                <tr key={i}
                  style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = GREY1}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 18px", color: DARK, fontWeight: 500 }}>{row.description}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: DARK }}>
                      KES {row.amount.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      background: row.badge.bg, color: row.badge.color,
                      fontSize: 12, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 99,
                    }}>{row.badge.text}</span>
                  </td>
                </tr>
              ))}

              {/* Balance row */}
              <tr style={{ background: balance > 0 ? "#fffbeb" : "#f0fdf4", borderTop: `2px solid ${balance > 0 ? "#fde68a" : "#bbf7d0"}` }}>
                <td style={{ padding: "14px 18px", fontWeight: 700, color: DARK, fontSize: 14 }}>
                  Outstanding Balance
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <span className="fsm-balance-amount" style={{ fontSize: 20, fontWeight: 800, color: balance > 0 ? "#d97706" : "#15803d" }}>
                    KES {balance.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{
                    background: balance > 0 ? "#fef9c3" : "#dcfce7",
                    color: balance > 0 ? "#a16207" : "#15803d",
                    fontSize: 12.5, fontWeight: 700,
                    padding: "4px 12px", borderRadius: 99,
                  }}>
                    {balance > 0 ? "⚠️ Unpaid" : "✅ Cleared"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAYMENT BREAKDOWN BY SEMESTER ── */}
      {semRows.length > 0 && (
        <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
          <div className="fsm-section-title" style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Payments by Semester</h3>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="fsm-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 480 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Semester", "Academic Year", "Payments Made", "Total Paid (KES)"].map(h => (
                    <th key={h} style={{
                      padding: "12px 18px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: GREY4,
                      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semRows.map((r, i) => (
                  <tr key={i}
                    style={{ borderBottom: i < semRows.length - 1 ? `1px solid ${GREY3}` : "none", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = GREY1}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "13px 18px", color: DARK, fontWeight: 600 }}>{r.semester}</td>
                    <td style={{ padding: "13px 18px" }}>
                      <span style={{
                        background: `${P}12`, color: P,
                        fontSize: 12, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 99,
                      }}>{r.year}</span>
                    </td>
                    <td style={{ padding: "13px 18px", color: DARK }}>
                      {r.count} payment{r.count !== 1 ? "s" : ""}
                    </td>
                    <td style={{ padding: "13px 18px" }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: DARK }}>
                        KES {r.total.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── RECENT PAYMENTS ── */}
      {recentPayments.length > 0 && (
        <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
          <div className="fsm-section-title" style={{
            padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 6,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Recent Verified Payments</h3>
            <span style={{ fontSize: 12, color: GREY4 }}>Last {recentPayments.length} records</span>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="fsm-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 420 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Date", "Transaction Ref", "Method", "Amount (KES)"].map(h => (
                    <th key={h} style={{
                      padding: "12px 18px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: GREY4,
                      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p, i) => {
                  const methodLabel = p.payment_method === "mpesa" ? "M-Pesa" : p.payment_method === "bank" ? "Bank Transfer" : p.payment_method === "cash" ? "Cash" : p.payment_method || "—";
                  return (
                    <tr key={p.id || i}
                      style={{ borderBottom: i < recentPayments.length - 1 ? `1px solid ${GREY3}` : "none", transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "13px 18px" }}>
                        <code style={{
                          background: GREY2, color: DARK,
                          padding: "2px 8px", borderRadius: 4,
                          fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                        }}>{p.transaction_ref || "—"}</code>
                      </td>
                      <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
                        <span style={{
                          background: p.payment_method === "mpesa" ? "#dcfce7" : p.payment_method === "bank" ? "#dbeafe" : GREY2,
                          color: p.payment_method === "mpesa" ? "#15803d" : p.payment_method === "bank" ? "#1d4ed8" : DARK,
                          fontSize: 12, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 99,
                        }}>{methodLabel}</span>
                      </td>
                      <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: DARK }}>
                          KES {Number(p.amount_paid || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}