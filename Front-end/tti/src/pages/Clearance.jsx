import { useState, useEffect } from "react";
import { clearanceAPI } from "../api/api";

const P     = "#0274BE";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const DEPT_META = {
  finance:  { label: "Finance",        icon: "💳" },
  library:  { label: "Library",        icon: "📚" },
  hostel:   { label: "Hostel",         icon: "🏠" },
  academic: { label: "Academic Office", icon: "🎓" },
};

export default function Clearance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await clearanceAPI.getClearance();
        setRecords(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load clearance records. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cleared    = records.filter(r => r.cleared).length;
  const notCleared = records.filter(r => !r.cleared).length;
  const allCleared = records.length > 0 && notCleared === 0;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading clearance records…</p>
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
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Clearance ✅</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Cleared",     value: cleared,    bg: "rgba(255,255,255,0.15)" },
            { label: "Not Cleared", value: notCleared, bg: "rgba(255,255,255,0.10)" },
            { label: "Total",       value: records.length, bg: "rgba(255,255,255,0.10)" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: "8px 18px", textAlign: "center" }}>
              <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OVERALL STATUS BANNER */}
      {records.length > 0 && (
        <div style={{
          background: allCleared ? "#f0fdf4" : "#fef9c3",
          border: `1px solid ${allCleared ? "#bbf7d0" : "#fde68a"}`,
          borderRadius: 8, padding: "16px 22px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 28 }}>{allCleared ? "🎉" : "⚠️"}</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: allCleared ? "#15803d" : "#a16207", margin: "0 0 3px" }}>
              {allCleared ? "You are fully cleared!" : `${notCleared} department${notCleared !== 1 ? "s" : ""} pending clearance`}
            </p>
            <p style={{ fontSize: 12.5, color: allCleared ? "#16a34a" : "#ca8a04", margin: 0 }}>
              {allCleared
                ? "All departments have cleared you. You are good to proceed."
                : "Please visit the relevant departments to complete your clearance."}
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Clearance Status by Department</h3>
        </div>

        {records.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No clearance records found</p>
            <p style={{ fontSize: 13, color: GREY4 }}>Clearance records will appear here once generated by the administration.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Department", "Semester", "Status", "Cleared On", "Remarks"].map(h => (
                    <th key={h} style={{
                      padding: "12px 18px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: GREY4,
                      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const meta = DEPT_META[r.department] || { label: r.department || "—", icon: "🏢" };
                  return (
                    <tr key={r.id || i}
                      style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{meta.icon}</span>
                          <span style={{ fontWeight: 600, color: DARK }}>{meta.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: DARK }}>
                        {r.semester_name || r.semester || "—"}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          background: r.cleared ? "#dcfce7" : "#fee2e2",
                          color: r.cleared ? "#15803d" : "#dc2626",
                          fontSize: 12, fontWeight: 700,
                          padding: "4px 12px", borderRadius: 99,
                        }}>
                          {r.cleared ? "✓ Cleared" : "✗ Not Cleared"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {r.cleared_at
                          ? new Date(r.cleared_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                          : <span style={{ color: GREY4 }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 18px", color: GREY4, maxWidth: 240 }}>
                        {r.remarks || <span style={{ fontStyle: "italic" }}>No remarks</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DEPT CARDS */}
      {records.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {records.map((r, i) => {
            const meta = DEPT_META[r.department] || { label: r.department || "—", icon: "🏢" };
            return (
              <div key={r.id || i} style={{
                background: WHITE,
                border: `2px solid ${r.cleared ? "#bbf7d0" : GREY3}`,
                borderTop: `3px solid ${r.cleared ? "#22c55e" : "#ef4444"}`,
                borderRadius: 8, padding: "18px 20px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{meta.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: DARK, margin: "0 0 8px" }}>{meta.label}</p>
                <span style={{
                  background: r.cleared ? "#dcfce7" : "#fee2e2",
                  color: r.cleared ? "#15803d" : "#dc2626",
                  fontSize: 12, fontWeight: 700,
                  padding: "3px 12px", borderRadius: 99,
                }}>
                  {r.cleared ? "Cleared" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}