import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { authAPI, clearTokens } from "../api/api";

const P      = "#0274BE";   // primary blue
const PDARK  = "#015fa0";   // hover blue
const WHITE  = "#ffffff";
const GREY1  = "#f8fafc";   // page bg
const GREY2  = "#f1f5f9";   // hover bg
const GREY3  = "#e2e8f0";   // borders
const GREY4  = "#94a3b8";   // muted text
const DARK   = "#1e293b";   // primary text

const NAV = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard", emoji: "⊞", path: "/dashboard" },
      { label: "Events",    emoji: "📅", path: "/events" },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      {
        label: "Academic Progress", emoji: "🎓",
        children: [
          { label: "My Units",          emoji: "📚", path: "/units" },
          { label: "Unit Registration", emoji: "📝", path: "/unit-registration" },
          { label: "Exam Card",         emoji: "🪪", path: "/exam-card" },
          { label: "Results",           emoji: "📊", path: "/results" },
          { label: "Timetable",         emoji: "🗓️", path: "/timetable" },
        ],
      },
    ],
  },
  {
    section: "FINANCE",
    items: [
      {
        label: "Fees", emoji: "💳",
        children: [
          { label: "Fee Structure", emoji: "📋", path: "/fees/structure" },
          { label: "My Payments",   emoji: "💰", path: "/fees/payments" },
          { label: "Fee Summary",   emoji: "📈", path: "/fees/summary" },
        ],
      },
    ],
  },
  {
    section: "SERVICES",
    items: [
      { label: "Clearance",     emoji: "✅", path: "/clearance" },
      { label: "Hostel",        emoji: "🏠", path: "/hostel" },
      { label: "Reporting",     emoji: "📋", path: "/reporting" },
      { label: "Attachments",   emoji: "📎", path: "/attachments" },
      { label: "Student Forms", emoji: "📄", path: "/forms" },
      { label: "Lost ID Card",  emoji: "🔖", path: "/lost-card" },
      { label: "Disciplinary",  emoji: "⚖️", path: "/disciplinary" },
    ],
  },
];

const NOTIFS = [
  { msg: "Your fee balance is KES 12,500",   time: "2 hrs ago",  unread: true },
  { msg: "Unit registration is now open",     time: "1 day ago",  unread: true },
  { msg: "Exam card for Sem 2 is available", time: "2 days ago", unread: false },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [openMenus,   setOpenMenus]   = useState({ "Academic Progress": true, "Fees": false });
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const toggle    = (label) => setOpenMenus(p => ({ ...p, [label]: !p[label] }));
  const isActive  = (path)  => location.pathname === path;
  const hasActive = (ch)    => ch?.some(c => location.pathname === c.path);
  const unread    = NOTIFS.filter(n => n.unread).length;

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    clearTokens();
    navigate("/login");
  };

  /* ── shared sidebar body ── */
  const SideContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Logo */}
      <div style={{
        height: 64, flexShrink: 0,
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        padding: collapsed ? "0 16px" : "0 12px 0 20px",
        borderBottom: `1px solid ${GREY3}`,
        background: WHITE,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
          <div style={{
            width: 36, height: 36, background: P, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, color: WHITE, fontSize: 12, flexShrink: 0,
          }}>TTI</div>
          {!collapsed && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: DARK, letterSpacing: 0.4, lineHeight: 1.2 }}>THIKA TECHNICAL</div>
              <div style={{ fontSize: 9, color: GREY4, letterSpacing: 2.5 }}>TRAINING INSTITUTE</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: GREY4, fontSize: 18, padding: 4, lineHeight: 1, flexShrink: 0,
          }}>‹</button>
        )}
      </div>

      {/* Nav scroll */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0", background: WHITE }}
        className="s-scroll"
      >
        {NAV.map((group) => (
          <div key={group.section}>

            {/* Section label */}
            {!collapsed && (
              <div style={{
                padding: "14px 20px 4px",
                fontSize: 9.5, fontWeight: 700,
                color: GREY4, letterSpacing: 2, textTransform: "uppercase",
              }}>{group.section}</div>
            )}

            {group.items.map((item) => {

              /* ── dropdown ── */
              if (item.children) {
                const open   = openMenus[item.label];
                const active = hasActive(item.children);
                return (
                  <div key={item.label}>
                    <div
                      onClick={() => !collapsed && toggle(item.label)}
                      style={{
                        display: "flex", alignItems: "center",
                        gap: 10, padding: collapsed ? "11px 0" : "10px 20px",
                        justifyContent: collapsed ? "center" : "flex-start",
                        cursor: "pointer", userSelect: "none",
                        borderLeft: active && !open ? `3px solid ${P}` : "3px solid transparent",
                        background: active && !open ? `${P}10` : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY2}
                      onMouseLeave={e => e.currentTarget.style.background = active && !open ? `${P}10` : "transparent"}
                    >
                      <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
                      {!collapsed && (
                        <>
                          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: active ? P : DARK, whiteSpace: "nowrap" }}>
                            {item.label}
                          </span>
                          <span style={{
                            fontSize: 10, color: GREY4,
                            display: "inline-block",
                            transition: "transform 0.2s",
                            transform: open ? "rotate(90deg)" : "none",
                          }}>▶</span>
                        </>
                      )}
                    </div>

                    {/* Children */}
                    {!collapsed && open && (
                      <div style={{ borderLeft: `3px solid ${P}`, marginLeft: 20, background: GREY1 }}>
                        {item.children.map(child => (
                          <Link key={child.path} to={child.path} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 16px",
                            textDecoration: "none",
                            background: isActive(child.path) ? P : "transparent",
                            transition: "background 0.15s",
                          }}
                            onMouseEnter={e => { if (!isActive(child.path)) e.currentTarget.style.background = GREY2; }}
                            onMouseLeave={e => { if (!isActive(child.path)) e.currentTarget.style.background = "transparent"; }}
                          >
                            <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{child.emoji}</span>
                            <span style={{
                              fontSize: 13, fontWeight: isActive(child.path) ? 700 : 400,
                              color: isActive(child.path) ? WHITE : GREY4,
                              whiteSpace: "nowrap",
                            }}>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              /* ── regular item ── */
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} style={{
                  display: "flex", alignItems: "center",
                  gap: 10, padding: collapsed ? "11px 0" : "10px 20px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  textDecoration: "none",
                  borderLeft: active ? `3px solid ${P}` : "3px solid transparent",
                  background: active ? `${P}10` : "transparent",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = GREY2; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? `${P}10` : "transparent"; }}
                >
                  <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
                  {!collapsed && (
                    <span style={{
                      fontSize: 13.5, fontWeight: active ? 700 : 500,
                      color: active ? P : DARK,
                      whiteSpace: "nowrap",
                    }}>{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ borderTop: `1px solid ${GREY3}`, background: WHITE, flexShrink: 0 }}>
        <div
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center",
            gap: 10, padding: collapsed ? "14px 0" : "14px 20px",
            justifyContent: collapsed ? "center" : "flex-start",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = GREY2}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>🚪</span>
          {!collapsed && (
            <span style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>Logout</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body { font-family: 'Barlow', sans-serif; background: ${GREY1}; }

        .s-scroll::-webkit-scrollbar { width: 3px; }
        .s-scroll::-webkit-scrollbar-track { background: transparent; }
        .s-scroll::-webkit-scrollbar-thumb { background: ${GREY3}; border-radius: 99px; }

        .mob-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 256px; background: ${WHITE};
          z-index: 300; border-right: 1px solid ${GREY3};
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }
        .mob-drawer.open { transform: translateX(0); }
        .mob-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.3); z-index: 299;
        }
        .mob-btn { display: none !important; }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mob-btn { display: flex !important; }
        }
      `}</style>

      <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>

        {/* ── DESKTOP SIDEBAR ── */}
        <div
          className="desktop-sidebar"
          style={{
            width: collapsed ? 64 : 256,
            minWidth: collapsed ? 64 : 256,
            borderRight: `1px solid ${GREY3}`,
            transition: "width 0.25s ease, min-width 0.25s ease",
            flexShrink: 0, overflow: "hidden",
            background: WHITE, zIndex: 100,
          }}
        >
          <SideContent />
        </div>

        {/* ── MOBILE DRAWER ── */}
        {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
        <div className={`mob-drawer ${mobileOpen ? "open" : ""}`}>
          <SideContent />
        </div>

        {/* ── RIGHT: header + page ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* ── HEADER ── */}
          <header style={{
            height: 64, flexShrink: 0,
            background: WHITE,
            borderBottom: `1px solid ${GREY3}`,
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            zIndex: 99,
          }}>

            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Desktop expand when collapsed */}
              {collapsed && (
                <button
                  className="desktop-sidebar"
                  onClick={() => setCollapsed(false)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    width: 36, height: 36, borderRadius: 6, fontSize: 18,
                    color: GREY4, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = GREY2}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >☰</button>
              )}

              {/* Mobile hamburger */}
              <button
                className="mob-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  width: 36, height: 36, borderRadius: 6, fontSize: 20,
                  color: GREY4, alignItems: "center", justifyContent: "center",
                }}
              >☰</button>

              {/* Page title */}
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>
                  {NAV.flatMap(g => g.items)
                    .flatMap(i => i.children ? [i, ...i.children] : [i])
                    .find(i => i.path === location.pathname)?.label || "Dashboard"}
                </div>
                <div style={{ fontSize: 11, color: GREY4 }}>Thika TTI Student Portal</div>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

              {/* Bell */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  style={{
                    width: 38, height: 38, borderRadius: 8,
                    background: notifOpen ? `${P}10` : "none",
                    border: `1px solid ${notifOpen ? P : "transparent"}`,
                    cursor: "pointer", fontSize: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = GREY2}
                  onMouseLeave={e => e.currentTarget.style.background = notifOpen ? `${P}10` : "none"}
                >
                  🔔
                  {unread > 0 && (
                    <div style={{
                      position: "absolute", top: 7, right: 7,
                      width: 8, height: 8, background: P,
                      borderRadius: "50%", border: `2px solid ${WHITE}`,
                    }} />
                  )}
                </button>

                {notifOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: 320, background: WHITE, borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    border: `1px solid ${GREY3}`, zIndex: 999, overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "14px 18px", borderBottom: `1px solid ${GREY3}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>Notifications</span>
                      {unread > 0 && (
                        <span style={{
                          background: P, color: WHITE,
                          fontSize: 10, fontWeight: 700,
                          padding: "2px 8px", borderRadius: 99,
                        }}>{unread} new</span>
                      )}
                    </div>
                    {NOTIFS.map((n, i) => (
                      <div key={i} style={{
                        padding: "12px 18px",
                        background: n.unread ? `${P}08` : WHITE,
                        borderBottom: i < NOTIFS.length - 1 ? `1px solid ${GREY3}` : "none",
                        display: "flex", gap: 12, alignItems: "flex-start",
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = GREY2}
                        onMouseLeave={e => e.currentTarget.style.background = n.unread ? `${P}08` : WHITE}
                      >
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                          background: n.unread ? P : GREY3,
                        }} />
                        <div>
                          <p style={{ fontSize: 13, color: DARK, fontWeight: n.unread ? 600 : 400, lineHeight: 1.4 }}>{n.msg}</p>
                          <p style={{ fontSize: 11, color: GREY4, marginTop: 3 }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "10px 18px", textAlign: "center", borderTop: `1px solid ${GREY3}` }}>
                      <span style={{ fontSize: 12.5, color: P, fontWeight: 700, cursor: "pointer" }}>
                        View all notifications
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: profileOpen ? `${P}10` : "none",
                    border: `1px solid ${profileOpen ? P : "transparent"}`,
                    borderRadius: 8, padding: "5px 10px 5px 5px",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = GREY2}
                  onMouseLeave={e => e.currentTarget.style.background = profileOpen ? `${P}10` : "none"}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: P,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, color: WHITE, fontSize: 13,
                  }}>S</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: DARK, lineHeight: 1.2 }}>Student</div>
                    <div style={{ fontSize: 10.5, color: GREY4 }}>TTI/2023/001</div>
                  </div>
                  <span style={{ fontSize: 10, color: GREY4, marginLeft: 2 }}>▾</span>
                </button>

                {profileOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: 200, background: WHITE, borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    border: `1px solid ${GREY3}`, zIndex: 999, overflow: "hidden",
                  }}>
                    {[
                      { label: "My Profile",      emoji: "👤", path: "/profile" },
                      { label: "Change Password", emoji: "🔑", path: "/change-password" },
                    ].map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setProfileOpen(false)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 16px", textDecoration: "none",
                        borderBottom: `1px solid ${GREY3}`,
                        transition: "background 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = GREY2}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 15 }}>{item.emoji}</span>
                        <span style={{ fontSize: 13.5, color: DARK, fontWeight: 500 }}>{item.label}</span>
                      </Link>
                    ))}
                    <div
                      onClick={handleLogout}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 16px", cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = GREY2}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: 15 }}>🚪</span>
                      <span style={{ fontSize: 13.5, color: DARK, fontWeight: 500 }}>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <main style={{ flex: 1, overflowY: "auto", padding: "28px", background: GREY1 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}