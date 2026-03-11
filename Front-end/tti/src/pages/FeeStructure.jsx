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

export default function FeeStructure() {
  const [structures, setStructures] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await feesAPI.getFeeStructure();
        setStructures(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load fee structure. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = () => {
    const rows = structures.map((s, i) => `
      <tr>
        <td>${String(i + 1).padStart(2, "0")}</td>
        <td>${s.course || "—"}</td>
        <td>${s.academic_year_label || s.academic_year || "—"}</td>
        <td>Year ${s.year_of_study || "—"}</td>
        <td><strong>KES ${Number(s.total_fees || 0).toLocaleString()}</strong></td>
      </tr>
    `).join("");

    const totalSum = structures.reduce((sum, s) => sum + Number(s.total_fees || 0), 0);

    const html = `
      <h2 class="pdf-section-title">Fee Structure</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Course</th>
            <th>Academic Year</th>
            <th>Year of Study</th>
            <th>Total Fees (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#eff6ff; font-weight:700;">
            <td colspan="4" style="text-align:right; font-weight:700; color:#1e293b;">
              Grand Total
            </td>
            <td style="color:#0274BE; font-weight:800; font-size:14px;">
              KES ${totalSum.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <p style="font-size:11px;color:#94a3b8;margin-top:8px;">
        * All amounts are in Kenyan Shillings (KES). This fee structure is subject to change. Confirm with the Finance Office for the most current rates.
      </p>
    `;

    printToPDF(html, "Fee Structure — Thika TTI");
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading fee structure…</p>
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

  const totalSum = structures.reduce((sum, s) => sum + Number(s.total_fees || 0), 0);

  return (
    <div style={{ width: "100%" }}>

      {/* ── HEADER ── */}
      <div style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Finance</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Fee Structure 💰</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 18px", textAlign: "center" }}>
            <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{structures.length}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>Records</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={structures.length === 0}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
              color: WHITE, fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, cursor: structures.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7,
              opacity: structures.length === 0 ? 0.5 : 1,
            }}
          >
            <span>⬇️</span> Download PDF
          </button>
        </div>
      </div>

      {/* ── TABLE CARD ── */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>

        {/* Card title bar */}
        <div style={{
          padding: "16px 22px", borderBottom: `1px solid ${GREY3}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: GREY1,
        }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Fee Breakdown</h3>
            <p style={{ fontSize: 12, color: GREY4, margin: "3px 0 0" }}>
              Fees applicable to your course and year of study
            </p>
          </div>
          <span style={{ fontSize: 12.5, color: GREY4 }}>
            {structures.length} record{structures.length !== 1 ? "s" : ""}
          </span>
        </div>

        {structures.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No fee structure found</p>
            <p style={{ fontSize: 13, color: GREY4 }}>
              No fee structure has been configured for your course and year yet. Contact the Finance office.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Course", "Academic Year", "Year of Study", "Total Fees (KES)"].map(h => (
                    <th key={h} style={{
                      padding: "12px 18px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: GREY4,
                      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {structures.map((s, i) => (
                  <tr key={s.id || i}
                    style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = GREY1}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 18px", color: GREY4, fontSize: 12.5, fontWeight: 600 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "14px 18px", color: DARK, fontWeight: 600 }}>
                      {s.course || "—"}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{
                        background: `${P}12`, color: P,
                        fontSize: 12, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 99,
                      }}>{s.academic_year_label || s.academic_year || "—"}</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{
                        background: GREY2, color: DARK,
                        fontSize: 12.5, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 99,
                      }}>Year {s.year_of_study || "—"}</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: DARK }}>
                        KES {Number(s.total_fees || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Grand total row */}
                <tr style={{ background: `${P}08`, borderTop: `2px solid ${P}30` }}>
                  <td colSpan={4} style={{
                    padding: "14px 18px",
                    fontWeight: 700, color: DARK,
                    fontSize: 13.5, textAlign: "right",
                  }}>
                    Grand Total
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: P }}>
                      KES {totalSum.toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── NOTICE ── */}
      <div style={{
        background: `${P}08`, border: `1px solid ${P}25`,
        borderRadius: 8, padding: "14px 20px",
        display: "flex", alignItems: "flex-start", gap: 12,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: 13, color: DARK, lineHeight: 1.6, margin: 0 }}>
          The fees shown above are for your registered course and year of study.
          For payment queries or discrepancies, please visit the <strong>Finance Office</strong> or check your{" "}
          <strong>Fee Summary</strong> for the current balance.
        </p>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}