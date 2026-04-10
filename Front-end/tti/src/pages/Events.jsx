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

const ACCENT_COLORS = [
  { bg: "#eff6ff" },
  { bg: "#f0fdf4" },
  { bg: "#fefce8" },
  { bg: "#fdf4ff" },
  { bg: "#fff7ed" },
  { bg: "#f0fdfa" },
];
function accentFor(i) { return ACCENT_COLORS[i % ACCENT_COLORS.length]; }

const RESPONSIVE_CSS = `
  .ev-page { width: 100%; }

  .ev-header {
    background: #0274BE;
    border-radius: 8px;
    padding: 22px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .ev-header-stats { display: flex; gap: 10px; flex-wrap: wrap; }
  .ev-stat-box {
    background: rgba(255,255,255,0.15);
    border-radius: 8px;
    padding: 8px 18px;
    text-align: center;
    min-width: 60px;
  }

  .ev-toolbar {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 18px;
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .ev-tabs {
    display: flex;
    background: #f8fafc;
    border-radius: 6px;
    padding: 3px;
    gap: 2px;
    flex-shrink: 0;
  }
  .ev-search-wrap { flex: 1; min-width: 160px; position: relative; }
  .ev-search-input {
    width: 100%;
    padding: 8px 12px 8px 32px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 13px;
    color: #1e293b;
    outline: none;
    background: #f8fafc;
    font-family: inherit;
    box-sizing: border-box;
  }
  .ev-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    pointer-events: none;
  }

  .ev-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
  .ev-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .ev-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  }
  .ev-card-img {
    height: 140px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  .ev-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 1000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px 16px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .ev-modal {
    background: #ffffff;
    border-radius: 10px;
    width: 100%;
    max-width: 540px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    margin: auto;
  }
  .ev-modal-img {
    height: 200px;
    overflow: hidden;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px 10px 0 0;
  }
  .ev-modal-body { padding: 22px 26px 26px; }
  .ev-modal-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 18px 0;
  }

  @media (max-width: 680px) {
    .ev-header { padding: 16px 18px; gap: 12px; }
    .ev-header h1 { font-size: 17px !important; }
    .ev-stat-box { padding: 6px 12px; min-width: 50px; }
    .ev-stat-val { font-size: 15px !important; }
    .ev-stat-lbl { font-size: 10px !important; }

    .ev-toolbar { flex-direction: column; align-items: stretch; padding: 12px 14px; gap: 10px; }
    .ev-tabs { width: 100%; }
    .ev-tabs button { flex: 1; }
    .ev-search-wrap { width: 100%; min-width: 0; }

    .ev-grid { grid-template-columns: 1fr; }

    .ev-modal-img { height: 150px; }
    .ev-modal-body { padding: 16px 18px 20px; }
    .ev-modal-meta { grid-template-columns: 1fr; }
  }

  @media (max-width: 380px) {
    .ev-tabs button { font-size: 12px !important; padding: 5px 8px !important; }
    .ev-header-stats { gap: 6px; }
  }
`;

let _cssInjected = false;

export default function Events() {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!_cssInjected) {
      const el = document.createElement("style");
      el.textContent = RESPONSIVE_CSS;
      document.head.appendChild(el);
      _cssInjected = true;
    }
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const filtered = events.filter(e => {
    const matchFilter =
      filter === "all"      ? true :
      filter === "upcoming" ? !isPast(e.date) :
      isPast(e.date);
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      (e.title    || "").toLowerCase().includes(q) ||
      (e.location || "").toLowerCase().includes(q) ||
      (e.organizer|| "").toLowerCase().includes(q);
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
    <div className="ev-page">

      {/* ── HEADER ── */}
      <div className="ev-header">
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>
            Institute Calendar
          </p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>
            Events & Announcements 📅
          </h1>
        </div>
        <div className="ev-header-stats">
          {[
            { label: "Total",    count: events.length },
            { label: "Upcoming", count: upcomingCount },
            { label: "Past",     count: pastCount     },
          ].map(s => (
            <div key={s.label} className="ev-stat-box">
              <p className="ev-stat-val" style={{ color: WHITE, fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1 }}>
                {s.count}
              </p>
              <p className="ev-stat-lbl" style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "4px 0 0", letterSpacing: 1, textTransform: "uppercase" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="ev-toolbar">
        <div className="ev-tabs">
          {["all", "upcoming", "past"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? WHITE : "transparent",
              border: filter === f ? `1px solid ${GREY3}` : "1px solid transparent",
              borderRadius: 5, padding: "6px 16px",
              fontSize: 13, fontWeight: filter === f ? 700 : 500,
              color: filter === f ? P : GREY4,
              cursor: "pointer", textTransform: "capitalize",
              boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s", fontFamily: "inherit",
            }}>{f}</button>
          ))}
        </div>
        <div className="ev-search-wrap">
          <span className="ev-search-icon">🔍</span>
          <input
            className="ev-search-input"
            placeholder="Search events, location, organizer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
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
        <div className="ev-grid">
          {filtered.map((event, i) => {
            const accent = accentFor(i);
            const past   = isPast(event.date);
            return (
              <div
                key={event.id || i}
                className="ev-card"
                onClick={() => setSelected(event)}
                style={{ opacity: past ? 0.78 : 1 }}
              >
                {/* Image */}
                <div className="ev-card-img" style={{ background: accent.bg }}>
                  {event.image
                    ? <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 48 }}>🎓</span>
                  }
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: past ? "rgba(0,0,0,0.45)" : P,
                    color: WHITE, fontSize: 10.5, fontWeight: 700,
                    padding: "3px 9px", borderRadius: 99, letterSpacing: 0.8,
                  }}>{past ? "PAST" : "UPCOMING"}</div>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: DARK, margin: "0 0 10px", lineHeight: 1.4 }}>
                    {event.title}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    {[
                      { icon: "📅", text: formatDate(event.date) + (event.date ? ` · ${formatTime(event.date)}` : "") },
                      { icon: "📍", text: event.location  || "—" },
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
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{event.description}</p>
                  )}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${GREY3}`, display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 12.5, color: P, fontWeight: 700 }}>View Details →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL ── */}
      {selected && (
        <div className="ev-overlay" onClick={() => setSelected(null)}>
          <div className="ev-modal" onClick={e => e.stopPropagation()}>

            <div className="ev-modal-img">
              {selected.image
                ? <img src={selected.image} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 64 }}>🎓</span>
              }
            </div>

            <div className="ev-modal-body">
              {/* Title + close */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: 0, lineHeight: 1.3 }}>
                  {selected.title}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: GREY2, border: "none", borderRadius: 6,
                    width: 32, height: 32, cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}
                >✕</button>
              </div>

              {/* Meta grid */}
              <div className="ev-modal-meta">
                {[
                  { label: "Date & Time", value: formatDate(selected.date) + (selected.date ? "\n" + formatTime(selected.date) : ""), icon: "📅" },
                  { label: "Location",    value: selected.location  || "—", icon: "📍" },
                  { label: "Organizer",   value: selected.organizer || "—", icon: "👤" },
                  { label: "Status",      value: isPast(selected.date) ? "Past" : "Upcoming", icon: "🔔" },
                ].map((row, i) => (
                  <div key={i} style={{ background: GREY1, borderRadius: 6, padding: "12px 14px" }}>
                    <p style={{ fontSize: 10.5, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
                      {row.icon} {row.label}
                    </p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: DARK, margin: 0, whiteSpace: "pre-line" }}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {selected.description && (
                <div style={{ marginBottom: 20 }}>
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
                  display: "block", width: "100%", padding: "11px",
                  background: P, borderRadius: 6, color: WHITE,
                  fontWeight: 700, fontSize: 14, border: "none",
                  cursor: "pointer", fontFamily: "inherit",
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