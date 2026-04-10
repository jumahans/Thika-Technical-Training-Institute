import { useState, useEffect } from "react";
import { hostelAPI, referenceAPI } from "../api/api";

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
};

const responsiveStyles = `
  @media (max-width: 640px) {
    .hb-header { padding: 16px 16px !important; }
    .hb-header h1 { font-size: 17px !important; }
    .hb-header-right { width: 100%; justify-content: space-between !important; }
    .hb-header-stats { display: none !important; }
    .hb-new-btn { flex: 1; justify-content: center !important; text-align: center; }
    .hb-form { padding: 18px 16px !important; }
    .hb-form-grid { grid-template-columns: 1fr !important; }
    .hb-form-actions { flex-direction: column !important; }
    .hb-form-actions button { width: 100%; justify-content: center !important; }
    .hb-section-title { padding: 12px 14px !important; }
    .hb-table th, .hb-table td { padding: 10px 10px !important; font-size: 12px !important; }
  }
`;

export default function HostelBooking() {
  const [bookings,   setBookings]   = useState([]);
  const [hostels,    setHostels]    = useState([]);
  const [rooms,      setRooms]      = useState([]);
  const [semesters,  setSemesters]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);

  const [selectedRoom,     setSelectedRoom]     = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedHostel,   setSelectedHostel]   = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = responsiveStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [bookRes, hostelRes, roomRes, semRes] = await Promise.all([
          hostelAPI.getBookings(),
          hostelAPI.getHostels(),
          hostelAPI.getRooms(),
          referenceAPI.getSemesters(),
        ]);
        setBookings(bookRes.data?.results  || bookRes.data  || []);
        setHostels(hostelRes.data?.results || hostelRes.data || []);
        setRooms(roomRes.data?.results     || roomRes.data   || []);
        setSemesters(semRes.data?.results  || semRes.data    || []);
      } catch {
        setError("Failed to load hostel data. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRooms = selectedHostel
    ? rooms.filter(r => String(r.hostel) === selectedHostel || String(r.hostel_name) === selectedHostel)
    : rooms;

  const handleSubmit = async () => {
    setError(null);
    if (!selectedRoom)     { setError("Please select a room.");     return; }
    if (!selectedSemester) { setError("Please select a semester."); return; }
    setSubmitting(true);
    try {
      const res = await hostelAPI.createBooking({
        room:     parseInt(selectedRoom),
        semester: parseInt(selectedSemester),
      });
      setBookings(prev => [res.data, ...prev]);
      setSelectedRoom(""); setSelectedSemester(""); setSelectedHostel("");
      setShowForm(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        setError(Object.values(data)[0]);
      } else {
        setError("Failed to submit booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading hostel data…</p>
      </div>
    </div>
  );

  if (error && bookings.length === 0 && !showForm) return (
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
      <div className="hb-header" style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Services</p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>Hostel Booking 🏠</h1>
        </div>
        <div className="hb-header-right" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="hb-header-stats" style={{ display: "flex", gap: 10 }}>
            {[
              { label: "My Bookings",     value: bookings.length },
              { label: "Available Rooms", value: rooms.length    },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <button
            className="hb-new-btn"
            onClick={() => { setShowForm(!showForm); setError(null); }}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
              color: WHITE, fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
            }}
          >{showForm ? "✕ Cancel" : "+ New Booking"}</button>
        </div>
      </div>

      {/* BANNERS */}
      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>✅</span>
          <span style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>Booking submitted successfully! It is pending approval.</span>
        </div>
      )}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>⚠️</span>
          <span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* BOOKING FORM */}
      {showForm && (
        <div className="hb-form" style={{
          background: WHITE, border: `1px solid ${P}`,
          borderRadius: 8, padding: "24px 26px", marginBottom: 24,
          boxShadow: `0 0 0 3px ${P}15`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "0 0 20px", paddingBottom: 14, borderBottom: `1px solid ${GREY3}` }}>
            New Hostel Booking
          </h3>

          <div className="hb-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Hostel filter */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Filter by Hostel
              </label>
              <select
                value={selectedHostel}
                onChange={e => { setSelectedHostel(e.target.value); setSelectedRoom(""); }}
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: DARK, outline: "none", background: WHITE, fontFamily: "inherit", cursor: "pointer" }}
              >
                <option value="">All hostels</option>
                {hostels.map(h => (
                  <option key={h.id} value={String(h.id)}>{h.name} ({h.gender === "male" ? "Male" : "Female"})</option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Room *
              </label>
              <select
                value={selectedRoom}
                onChange={e => setSelectedRoom(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: selectedRoom ? DARK : GREY4, outline: "none", background: WHITE, fontFamily: "inherit", cursor: "pointer" }}
              >
                <option value="">Select a room…</option>
                {filteredRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.number} — {r.hostel_name || "Hostel"} (Capacity: {r.capacity})
                  </option>
                ))}
              </select>
              {filteredRooms.length === 0 && (
                <p style={{ fontSize: 11.5, color: "#dc2626", margin: "4px 0 0" }}>No available rooms.</p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Semester *
              </label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: `1px solid ${GREY3}`, borderRadius: 6, fontSize: 13.5, color: selectedSemester ? DARK : GREY4, outline: "none", background: WHITE, fontFamily: "inherit", cursor: "pointer" }}
              >
                <option value="">Select semester…</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}{s.is_current ? " (Current)" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hb-form-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => { setShowForm(false); setError(null); }} style={{ padding: "10px 22px", background: GREY2, border: `1px solid ${GREY3}`, borderRadius: 6, color: DARK, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} style={{ padding: "10px 28px", background: submitting ? GREY4 : P, border: "none", borderRadius: 6, color: WHITE, fontWeight: 700, fontSize: 13.5, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = PDARK; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = submitting ? GREY4 : P; }}
            >{submitting ? "Submitting…" : "Submit Booking"}</button>
          </div>
        </div>
      )}

      {/* HOSTELS INFO TABLE */}
      {hostels.length > 0 && (
        <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
          <div className="hb-section-title" style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>Available Hostels</h3>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="hb-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 420 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Hostel Name", "Gender", "Capacity", "Available Rooms"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hostels.map((h, i) => {
                  const hostelRooms = rooms.filter(r => String(r.hostel) === String(h.id) || r.hostel_name === h.name);
                  return (
                    <tr key={h.id || i} style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ padding: "13px 18px", fontWeight: 600, color: DARK }}>{h.name || "—"}</td>
                      <td style={{ padding: "13px 18px" }}>
                        <span style={{ background: h.gender === "male" ? "#dbeafe" : "#fce7f3", color: h.gender === "male" ? "#1d4ed8" : "#be185d", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
                          {h.gender === "male" ? "Male" : h.gender === "female" ? "Female" : h.gender || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "13px 18px", color: DARK }}>{h.capacity || "—"}</td>
                      <td style={{ padding: "13px 18px" }}>
                        <span style={{ background: `${P}12`, color: P, fontSize: 12.5, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
                          {hostelRooms.length} room{hostelRooms.length !== 1 ? "s" : ""}
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

      {/* MY BOOKINGS TABLE */}
      <div style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, overflow: "hidden" }}>
        <div className="hb-section-title" style={{ padding: "16px 22px", borderBottom: `1px solid ${GREY3}`, background: GREY1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>My Booking History</h3>
          <span style={{ fontSize: 12.5, color: GREY4 }}>{bookings.length} record{bookings.length !== 1 ? "s" : ""}</span>
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No bookings yet</p>
            <p style={{ fontSize: 13, color: GREY4, marginBottom: 20 }}>Click "New Booking" to request a hostel room.</p>
            <button onClick={() => setShowForm(true)} style={{ background: P, color: WHITE, fontWeight: 700, fontSize: 13.5, padding: "10px 24px", borderRadius: 6, cursor: "pointer", border: "none", fontFamily: "inherit" }}>+ New Booking</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="hb-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 480 }}>
              <thead>
                <tr style={{ background: GREY2, borderBottom: `2px solid ${GREY3}` }}>
                  {["#", "Hostel", "Room", "Semester", "Booked On", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  const meta = STATUS_META[b.status] || STATUS_META.pending;
                  return (
                    <tr key={b.id || i} style={{ borderBottom: `1px solid ${GREY3}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 18px", color: GREY4, fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ padding: "13px 18px", fontWeight: 600, color: DARK }}>{b.hostel_name || "—"}</td>
                      <td style={{ padding: "13px 18px" }}>
                        <span style={{ background: `${P}12`, color: P, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 4 }}>Room {b.room_number || b.room || "—"}</span>
                      </td>
                      <td style={{ padding: "13px 18px", color: DARK }}>{b.semester_name || b.semester || "—"}</td>
                      <td style={{ padding: "13px 18px", color: DARK, whiteSpace: "nowrap" }}>
                        {b.booked_at ? new Date(b.booked_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
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