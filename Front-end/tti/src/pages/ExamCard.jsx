import { useState, useEffect, useRef } from "react";
import { examCardAPI } from "../api/api";

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
    .ec-header { padding: 16px 16px !important; }
    .ec-header h1 { font-size: 17px !important; }
    .ec-banner { padding: 12px 14px !important; gap: 10px !important; }
    .ec-banner-icon { width: 34px !important; height: 34px !important; font-size: 16px !important; flex-shrink: 0; }
    .ec-card-header { padding: 16px 16px !important; gap: 12px !important; }
    .ec-card-header-icon { width: 40px !important; height: 40px !important; font-size: 18px !important; }
    .ec-card-header h2 { font-size: 15px !important; }
    .ec-card-header-badge { display: none !important; }
    .ec-info-grid { grid-template-columns: 1fr 1fr !important; }
    .ec-info-cell { padding: 12px 14px !important; border-right: none !important; border-bottom: 1px solid #e2e8f0 !important; }
    .ec-units-pad { padding: 14px 14px !important; }
    .ec-table th, .ec-table td { padding: 10px 10px !important; font-size: 12px !important; }
    .ec-footer { padding: 12px 14px !important; flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    .ec-not-cleared { padding: 16px 16px !important; }
    .ec-selector { display: flex; flex-wrap: wrap; }
    .ec-print-btn { width: 100%; justify-content: center; }
    .ec-header-actions { width: 100%; }
  }
  @media (max-width: 400px) {
    .ec-info-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function ExamCard() {
  const [cards,   setCards]   = useState([]);
  const [active,  setActive]  = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = responsiveStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await examCardAPI.getExamCards();
        const data = res.data?.results || res.data || [];
        setCards(data);
      } catch {
        setError("Failed to load exam card. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Exam Card — Thika TTI</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Barlow', sans-serif; background: #fff; padding: 32px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px 14px; border: 1px solid #e2e8f0; text-align: left; font-size: 13px; }
            th { background: #f1f5f9; font-weight: 700; }
            .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-weight: 700; font-size: 12px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading exam card…</p>
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

  if (cards.length === 0) return (
    <div style={{ width: "100%" }}>
      <div className="ec-header" style={{
        background: P, borderRadius: 8, padding: "22px 28px", marginBottom: 24,
      }}>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Academic Progress</p>
        <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Exam Card 🪪</h1>
      </div>
      <div style={{
        background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
        padding: "60px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🪪</div>
        <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 8 }}>No Exam Card Available</p>
        <p style={{ fontSize: 13.5, color: GREY4, lineHeight: 1.6 }}>
          Your exam card has not been generated yet.<br />
          Ensure you have completed unit registration and cleared all dues.
        </p>
      </div>
    </div>
  );

  const card = cards[active];
  const isCleared   = card?.is_cleared;
  const isAvailable = isCleared;
  const units       = card?.registered_units || [];

  return (
    <div style={{ width: "100%" }}>

      {/* ── HEADER ── */}
      <div className="ec-header" style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Academic Progress</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Exam Card 🪪</h1>
        </div>
        <div className="ec-header-actions" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {cards.length > 1 && (
            <div className="ec-selector" style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: 3, gap: 2 }}>
              {cards.map((c, i) => (
                <button key={c.id || i} onClick={() => setActive(i)} style={{
                  background: active === i ? WHITE : "transparent",
                  border: "none", borderRadius: 4,
                  padding: "5px 14px", fontSize: 12.5,
                  fontWeight: active === i ? 700 : 500,
                  color: active === i ? P : "rgba(255,255,255,0.8)",
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  {c.semester_name || `Card ${i + 1}`}
                </button>
              ))}
            </div>
          )}
          {isAvailable && (
            <button
              className="ec-print-btn"
              onClick={handlePrint}
              style={{
                background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
                color: WHITE, fontWeight: 700, fontSize: 13,
                padding: "9px 18px", borderRadius: 6, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >🖨️ Print / Download</button>
          )}
        </div>
      </div>

      {/* ── CLEARANCE STATUS BANNER ── */}
      <div className="ec-banner" style={{
        background: isCleared ? "#f0fdf4" : "#fef9c3",
        border: `1px solid ${isCleared ? "#bbf7d0" : "#fde68a"}`,
        borderRadius: 8, padding: "14px 20px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div className="ec-banner-icon" style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: isCleared ? "#dcfce7" : "#fef9c3",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {isCleared ? "✅" : "⚠️"}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: isCleared ? "#15803d" : "#a16207", margin: "0 0 3px" }}>
            {isCleared ? "You are cleared to sit for exams" : "Exam card not yet cleared"}
          </p>
          <p style={{ fontSize: 12.5, color: isCleared ? "#16a34a" : "#ca8a04", margin: 0 }}>
            {isCleared
              ? "All requirements have been met. Your exam card is valid."
              : "Please clear outstanding fees and other requirements to access your exam card."}
          </p>
        </div>
      </div>

      {/* ── PRINTABLE EXAM CARD ── */}
      <div ref={printRef}>
        <div style={{
          background: WHITE, border: `2px solid ${GREY3}`, borderRadius: 10,
          overflow: "hidden", marginBottom: 20,
        }}>
          {/* Card header */}
          <div className="ec-card-header" style={{
            background: P, padding: "20px 28px",
            display: "flex", alignItems: "center", gap: 18,
            flexWrap: "wrap",
          }}>
            <div className="ec-card-header-icon" style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>🏫</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 3px" }}>
                Thika Technical Training Institute
              </p>
              <h2 style={{ color: WHITE, fontSize: 18, fontWeight: 800, margin: "0 0 3px" }}>
                EXAMINATION CARD
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: 0 }}>
                {card?.semester_name || "—"} · Academic Year: {card?.academic_year || "—"}
              </p>
            </div>
            <div className="ec-card-header-badge" style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{
                background: isCleared ? "#dcfce7" : "#fef9c3",
                color: isCleared ? "#15803d" : "#a16207",
                fontSize: 12, fontWeight: 800,
                padding: "5px 14px", borderRadius: 99,
                letterSpacing: 0.5,
              }}>
                {isCleared ? "CLEARED" : "NOT CLEARED"}
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, margin: "6px 0 0" }}>
                Generated: {card?.generated_at
                  ? new Date(card.generated_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </p>
            </div>
          </div>

          {/* Student info grid */}
          <div className="ec-info-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 0, borderBottom: `2px solid ${GREY3}`,
          }}>
            {[
              { label: "Student Name",      value: card?.student_name      || "—" },
              { label: "Admission Number",  value: card?.admission_number  || "—" },
              { label: "Course",            value: card?.course            || "—" },
              { label: "Department",        value: card?.department        || "—" },
            ].map((row, i, arr) => (
              <div className="ec-info-cell" key={i} style={{
                padding: "16px 22px",
                borderRight: i < arr.length - 1 ? `1px solid ${GREY3}` : "none",
                borderBottom: "none",
              }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
                  {row.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0, wordBreak: "break-word" }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>

          {/* Registered units table */}
          <div className="ec-units-pad" style={{ padding: "20px 22px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 14px" }}>
              Registered Units — {units.length} unit{units.length !== 1 ? "s" : ""}
            </p>

            {units.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: GREY4 }}>
                <p style={{ fontSize: 13 }}>No units registered on this exam card.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table className="ec-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 420 }}>
                  <thead>
                    <tr style={{ background: GREY1, borderBottom: `2px solid ${GREY3}` }}>
                      {["#", "Unit Code", "Unit Name", "Lecturer"].map(h => (
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
                      <tr key={u.id || i}
                        style={{ borderBottom: i < units.length - 1 ? `1px solid ${GREY3}` : "none" }}
                        onMouseEnter={e => e.currentTarget.style.background = GREY1}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "12px 14px", color: GREY4, fontSize: 12.5, fontWeight: 600 }}>
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <span style={{
                            background: `${P}12`, color: P,
                            fontSize: 12, fontWeight: 800,
                            padding: "3px 9px", borderRadius: 4,
                          }}>{u.code || u.unit_code || "—"}</span>
                        </td>
                        <td style={{ padding: "12px 14px", color: DARK, fontWeight: 500 }}>
                          {u.name || u.unit_name || "—"}
                        </td>
                        <td style={{ padding: "12px 14px", color: GREY4, whiteSpace: "nowrap" }}>
                          {u.lecturer_name || u.lecturer || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="ec-footer" style={{
            borderTop: `2px dashed ${GREY3}`,
            padding: "14px 22px",
            background: GREY1,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 10,
          }}>
            <p style={{ fontSize: 11.5, color: GREY4, margin: 0 }}>
              This card must be presented at each examination. Loss of this card should be reported immediately.
            </p>
            <div style={{
              background: WHITE, border: `1px solid ${GREY3}`,
              borderRadius: 5, padding: "8px 14px", textAlign: "center",
              flexShrink: 0,
            }}>
              <p style={{ fontSize: 10, color: GREY4, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>Card ID</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: 0, letterSpacing: 1 }}>
                {String(card?.id || "—").padStart(6, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── NOT CLEARED NOTE ── */}
      {!isCleared && (
        <div className="ec-not-cleared" style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "20px 24px",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: "0 0 12px" }}>
            Requirements to Clear Exam Card
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "💳", text: "Clear all outstanding fee balance in the Finance office" },
              { icon: "📚", text: "Ensure unit registration is approved for the current semester" },
              { icon: "📋", text: "Return any borrowed library books or materials" },
              { icon: "🏠", text: "Settle any hostel dues if applicable" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 13.5, color: DARK, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}