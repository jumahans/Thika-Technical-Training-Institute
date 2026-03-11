import { useState, useEffect } from "react";
import { eventsAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

function isPast(dateStr) {
  return dateStr && new Date(dateStr) < new Date();
}

// Deterministic color per event title
const ACCENT_COLORS = [
  { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", dot: "#3b82f6" },
  { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", dot: "#22c55e" },
  { bg: "#fefce8", border: "#fde68a", text: "#a16207", dot: "#eab308" },
  { bg: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce", dot: "#a855f7" },
  { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c", dot: "#f97316" },
  { bg: "#f0fdfa", border: "#99f6e4", text: "#0f766e", dot: "#14b8a6" },
];
function accentFor(i) { return ACCENT_COLORS[i % ACCENT_COLORS.length]; }

export default function Events() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all"); // "all" | "upcoming" | "past"
  const [search,  setSearch]  = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await eventsAPI.getEvents();
        setEvents(res.data?.results || res.data || []);
      } catch {
        setError("Failed to load events. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = events.filter(e => {
    const matchFilter =
      filter === "all" ? true :
      filter === "upcoming" ? !isPast(e.date) :
      isPast(e.date);
    const matchSearch =
      !search ||
      (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.organizer || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const upcomingCount = events.filter(e => !isPast(e.date)).length;
  const pastCount     = events.filter(e =>  isPast(e.date)).length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading events…</p>
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

      {/* ── HEADER STRIP ── */}
      <div style={{
        background: P, borderRadius: 8, padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 4 }}>
            Institute Calendar
          </p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>
            Events & Announcements 📅
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Total",    count: events.length,  bg: "rgba(255,255,255,0.15)" },
            { label: "Upcoming", count: upcomingCount,  bg: "rgba(255,255,255,0.10)" },
            { label: "Past",     count: pastCount,      bg: "rgba(255,255,255,0.10)" },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 8, padding: "8px 18px", textAlign: "center",
            }}>
              <p style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.count}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "4px 0 0", letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS + SEARCH ── */}
      <div style={{
        background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", background: GREY1, borderRadius: 6, padding: 3, gap: 2 }}>
          {["all", "upcoming", "past"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? WHITE : "transparent",
                border: filter === f ? `1px solid ${GREY3}` : "1px solid transparent",
                borderRadius: 5, padding: "6px 16px",
                fontSize: 13, fontWeight: filter === f ? 700 : 500,
                color: filter === f ? P : GREY4,
                cursor: "pointer", textTransform: "capitalize",
                boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s",
              }}
            >{f}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            fontSize: 14, pointerEvents: "none",
          }}>🔍</span>
          <input
            placeholder="Search events, location, organizer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px 8px 34px",
              border: `1px solid ${GREY3}`, borderRadius: 6,
              fontSize: 13, color: DARK, outline: "none",
              background: GREY1,
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* ── EVENT GRID ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "60px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 15, color: DARK, fontWeight: 700, marginBottom: 6 }}>No events found</p>
          <p style={{ fontSize: 13, color: GREY4 }}>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}>
          {filtered.map((event, i) => {
            const accent = accentFor(i);
            const past   = isPast(event.date);
            return (
              <div
                key={event.id}
                onClick={() => setSelected(event)}
                style={{
                  background: WHITE,
                  border: `1px solid ${GREY3}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  opacity: past ? 0.75 : 1,
                  transition: "transform 0.15s, box-shadow 0.15s",
                  display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image / placeholder */}
                <div style={{
                  height: 140, overflow: "hidden",
                  background: accent.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: 52 }}>🎓</span>
                  )}
                  {/* Past badge */}
                  {past && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: "rgba(0,0,0,0.45)", color: WHITE,
                      fontSize: 10.5, fontWeight: 700, padding: "3px 9px",
                      borderRadius: 99, letterSpacing: 0.8,
                    }}>PAST</div>
                  )}
                  {!past && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: P, color: WHITE,
                      fontSize: 10.5, fontWeight: 700, padding: "3px 9px",
                      borderRadius: 99, letterSpacing: 0.8,
                    }}>UPCOMING</div>
                  )}
                </div>

                <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{
                    fontSize: 14.5, fontWeight: 700, color: DARK,
                    margin: "0 0 10px", lineHeight: 1.4,
                  }}>{event.title}</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    {[
                      { icon: "📅", text: formatDate(event.date) + (event.date ? ` · ${formatTime(event.date)}` : "") },
                      { icon: "📍", text: event.location || "—" },
                      { icon: "👤", text: event.organizer || "—" },
                    ].map((row, ri) => (
                      <div key={ri} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                        <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                        <span style={{ fontSize: 12.5, color: GREY4, lineHeight: 1.4 }}>{row.text}</span>
                      </div>
                    ))}
                  </div>

                  {event.description && (
                    <p style={{
                      fontSize: 12.5, color: GREY4, lineHeight: 1.5,
                      margin: 0, flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>{event.description}</p>
                  )}

                  <div style={{
                    marginTop: 14, paddingTop: 12,
                    borderTop: `1px solid ${GREY3}`,
                    display: "flex", justifyContent: "flex-end",
                  }}>
                    <span style={{ fontSize: 12.5, color: P, fontWeight: 700 }}>View Details →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: WHITE, borderRadius: 10,
              width: "100%", maxWidth: 560,
              maxHeight: "90vh", overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            }}
          >
            {/* Modal image */}
            <div style={{
              height: 200, overflow: "hidden",
              background: GREY2,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {selected.image ? (
                <img src={selected.image} alt={selected.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 72 }}>🎓</span>
              )}
            </div>

            <div style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: 0, lineHeight: 1.3 }}>
                  {selected.title}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: GREY2, border: "none", borderRadius: 6,
                    width: 30, height: 30, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 16,
                  }}
                >✕</button>
              </div>

              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0",
              }}>
                {[
                  { label: "Date & Time", value: formatDate(selected.date) + "\n" + formatTime(selected.date), icon: "📅" },
                  { label: "Location",    value: selected.location || "—",   icon: "📍" },
                  { label: "Organizer",   value: selected.organizer || "—",  icon: "👤" },
                  { label: "Status",      value: isPast(selected.date) ? "Past" : "Upcoming", icon: "🔔" },
                ].map((row, i) => (
                  <div key={i} style={{
                    background: GREY1, borderRadius: 6, padding: "12px 14px",
                  }}>
                    <p style={{ fontSize: 10.5, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
                      {row.icon} {row.label}
                    </p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: DARK, margin: 0, whiteSpace: "pre-line" }}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              {selected.description && (
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>
                    Description
                  </p>
                  <p style={{ fontSize: 13.5, color: DARK, lineHeight: 1.7, margin: 0 }}>
                    {selected.description}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                style={{
                  display: "block", width: "100%", marginTop: 24,
                  padding: "11px", background: P, borderRadius: 6,
                  color: WHITE, fontWeight: 700, fontSize: 14,
                  border: "none", cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = PDARK}
                onMouseLeave={e => e.currentTarget.style.background = P}
              >Close</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}