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

const METHOD_META = {
  mpesa: { label: "M-Pesa",        color: "#15803d", bg: "#dcfce7" },
  bank:  { label: "Bank Transfer", color: "#1d4ed8", bg: "#dbeafe" },
  cash:  { label: "Cash",          color: "#a16207", bg: "#fef9c3" },
};

const responsiveStyles = `
  @media (max-width: 640px) {
    .fp-header { padding: 16px 16px !important; }
    .fp-header h1 { font-size: 17px !important; }
    .fp-header-right { width: 100%; justify-content: space-between !important; }
    .fp-stat-cards { grid-template-columns: 1fr !important; }
    .fp-stat-card { padding: 14px 16px !important; }
    .fp-toolbar { padding: 12px 12px !important; flex-direction: column !important; align-items: stretch !important; }
    .fp-filter-tabs { width: 100%; justify-content: stretch !important; }
    .fp-filter-tab { flex: 1; text-align: center; }
    .fp-search-wrap { width: 100% !important; min-width: unset !important; }
    .fp-table-header { padding: 12px 14px !important; }
    .fp-table th, .fp-table td { padding: 10px 10px !important; font-size: 12px !important; }
    .fp-download-btn { width: 100%; justify-content: center !important; }
    .fp-header-stats { display: none !important; }
  }
  @media (max-width: 400px) {
    .fp-filter-tabs button { padding: 6px 6px !important; font-size: 11px !important; }
  }
`;

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function FeePayments() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = responsiveStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await feesAPI.getPayments();
        setPayments(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load payment history. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = payments.filter(p => {
    const matchFilter = filter === "all" || p.payment_method === filter;
    const matchSearch = !search ||
      (p.transaction_ref || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.academic_year_label || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.semester_name || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPaid     = payments.filter(p => p.verified).reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const totalUnverif  = payments.filter(p => !p.verified).reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const verifiedCount = payments.filter(p => p.verified).length;

  const handleDownload = () => {
    const rows = filtered.map((p, i) => {
      const method = METHOD_META[p.payment_method] || { label: p.payment_method || "—", color: "#64748b", bg: "#f1f5f9" };
      return `
        <tr>
          <td>${String(i + 1).padStart(2, "0")}</td>
          <td>${fmt(p.payment_date)}</td>
          <td>${p.transaction_ref || "—"}</td>
          <td><span class="badge" style="background:${method.bg};color:${method.color}">${method.label}</span></td>
          <td>${p.semester_name || "—"}</td>
          <td>${p.academic_year_label || p.academic_year || "—"}</td>
          <td><strong>KES ${Number(p.amount_paid || 0).toLocaleString()}</strong></td>
          <td>
            <span class="badge ${p.verified ? "badge-green" : "badge-amber"}">
              ${p.verified ? "Verified" : "Pending"}
            </span>
          </td>
        </tr>
      `;
    }).join("");

    const html = `
      <div class="summary-grid">
        <div class="summary-box accent">
          <div class="label">Total Verified</div>
          <div class="value">KES ${totalPaid.toLocaleString()}</div>
        </div>
        <div class="summary-box">
          <div class="label">Verified Payments</div>
          <div class="value">${verifiedCount} of ${payments.length}</div>
        </div>
        <div class="summary-box">
          <div class="label">Pending Verification</div>
          <div class="value">KES ${totalUnverif.toLocaleString()}</div>
        </div>
      </div>

      <h2 class="pdf-section-title">Payment History${filter !== "all" ? ` — ${METHOD_META[filter]?.label || filter}` : ""}</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Payment Date</th>
            <th>Transaction Ref</th>
            <th>Method</th>
            <th>Semester</th>
            <th>Academic Year</th>
            <th>Amount (KES)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#eff6ff;">
            <td colspan="6" style="text-align:right;font-weight:700;color:#1e293b;">
              Total Verified Paid
            </td>
            <td colspan="2" style="color:#0274BE;font-weight:800;font-size:14px;">
              KES ${totalPaid.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    `;

    printToPDF(html, "My Payments — Thika TTI");
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading payment history…</p>
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
      <div className="fp-header" style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Finance</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>My Payments 🧾</h1>
        </div>
        <div className="fp-header-right" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="fp-header-stats" style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Total Paid",  value: `KES ${totalPaid.toLocaleString()}` },
              { label: "Payments",    value: payments.length },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <p style={{ color: WHITE, fontWeight: 800, fontSize: 16, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <button
            className="fp-download-btn"
            onClick={handleDownload}
            disabled={payments.length === 0}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
              color: WHITE, fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6,
              cursor: payments.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7,
              opacity: payments.length === 0 ? 0.5 : 1,
            }}
          >
            <span>⬇️</span> Download PDF
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="fp-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Verified Paid", value: `KES ${totalPaid.toLocaleString()}`,    icon: "✅", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Payments Verified",   value: `${verifiedCount} / ${payments.length}`, icon: "🧾", color: P,        bg: "#eff6ff", border: "#bfdbfe" },
          { label: "Pending Verification",value: `KES ${totalUnverif.toLocaleString()}`,  icon: "⏳", color: "#a16207", bg: "#fefce8", border: "#fde68a" },
        ].map(s => (
          <div className="fp-stat-card" key={s.label} style={{
            background: s.bg, border: `1px solid ${s.border}`,
            borderRadius: 8, padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 8, flexShrink: 0,
              background: WHITE, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>{s.icon}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 3px" }}>
                {s.label}
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1, wordBreak: "break-word" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH + FILTER ── */}
      <div className="fp-toolbar" style={{
        background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
        padding: "14px 18px", marginBottom: 16,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        {/* Method filter tabs */}
        <div className="fp-filter-tabs" style={{ display: "flex", background: GREY1, borderRadius: 6, padding: 3, gap: 2 }}>
          {["all", "mpesa", "bank", "cash"].map(f => (
            <button className="fp-filter-tab" key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? WHITE : "transparent",
              border: filter === f ? `1px solid ${GREY3}` : "1px solid transparent",
              borderRadius: 5, padding: "6px 14px",
              fontSize: 12.5, fontWeight: filter === f ? 700 : 500,
              color: filter === f ? P : GREY4,
              cursor: "pointer", textTransform: "capitalize",
              boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s", fontFamily: "inherit",
            }}>
              {f === "all" ? "All" : METHOD_META[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="fp-search-wrap" style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
          <input
            placeholder="Search by transaction ref, semester, year…"
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
        <span style={{ fontSize: 13, color: GREY4, whiteSpace: "nowrap" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── TABLE ── */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        <div className="fp-table-header" style={{
          padding: "14px 22px", borderBottom: `1px solid ${GREY3}`,
          background: GREY1, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Payment Records</h3>
          <span style={{ fontSize: 12, color: GREY4 }}>Sorted by most recent</span>
        </div>

        {payments.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧾</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No payments recorded</p>
            <p style={{ fontSize: 13, color: GREY4 }}>
              Your payment history will appear here once payments are recorded by the Finance office.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📭</div>
            <p style={{ fontSize: 14, color: DARK, fontWeight: 700, marginBottom: 6 }}>No records match</p>
            <p style={{ fontSize: 13, color: GREY4 }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="fp-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 680 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Date", "Transaction Ref", "Method", "Semester", "Academic Year", "Amount (KES)", "Status"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: GREY4,
                      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const method = METHOD_META[p.payment_method] || { label: p.payment_method || "—", color: GREY4, bg: GREY2 };
                  return (
                    <tr key={p.id || i}
                      style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 16px", color: GREY4, fontSize: 12, fontWeight: 600 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "13px 16px", color: DARK, whiteSpace: "nowrap" }}>
                        {fmt(p.payment_date)}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <code style={{
                          background: GREY2, color: DARK,
                          padding: "2px 8px", borderRadius: 4,
                          fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                        }}>{p.transaction_ref || "—"}</code>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          background: method.bg, color: method.color,
                          fontSize: 12, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 99,
                        }}>{method.label}</span>
                      </td>
                      <td style={{ padding: "13px 16px", color: DARK, whiteSpace: "nowrap" }}>
                        {p.semester_name || "—"}
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          background: `${P}12`, color: P,
                          fontSize: 12, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 99,
                        }}>{p.academic_year_label || p.academic_year || "—"}</span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: DARK }}>
                          KES {Number(p.amount_paid || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{
                          background: p.verified ? "#dcfce7" : "#fef9c3",
                          color: p.verified ? "#15803d" : "#a16207",
                          fontSize: 12, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 99,
                        }}>
                          {p.verified ? "✓ Verified" : "⏳ Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals footer */}
              <tfoot>
                <tr style={{ background: `${P}08`, borderTop: `2px solid ${P}30` }}>
                  <td colSpan={6} style={{
                    padding: "13px 16px", fontWeight: 700, color: DARK,
                    fontSize: 13.5, textAlign: "right",
                  }}>
                    Total Verified Paid
                  </td>
                  <td colSpan={2} style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: P }}>
                      KES {totalPaid.toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}