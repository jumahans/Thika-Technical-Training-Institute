import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, GraduationCap, BookOpen, ClipboardList,
  CreditCard, BarChart2, Wallet, FileText, Receipt, TrendingUp,
  CheckCircle, Building2, AlertTriangle, Paperclip, FileStack, Bookmark,
  Scale, Bell, LogOut, ChevronRight, User, KeyRound, X
} from "lucide-react";
import { authAPI, clearTokens } from "../api/api";
import logo from "../assets/Logo.png";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const NAV = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Events",    icon: CalendarDays,    path: "/events" },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      {
        label: "Academic Progress", icon: GraduationCap,
        children: [
          { label: "My Units",          icon: BookOpen,      path: "/units" },
          { label: "Unit Registration", icon: ClipboardList, path: "/unit-registration" },
          { label: "Exam Card",         icon: CreditCard,    path: "/exam-card" },
          { label: "Results",           icon: BarChart2,     path: "/results" },
        ],
      },
    ],
  },
  {
    section: "FINANCE",
    items: [
      {
        label: "Fees", icon: Wallet,
        children: [
          { label: "Fee Structure", icon: FileText,   path: "/fees/structure" },
          { label: "My Payments",   icon: Receipt,    path: "/fees/payments" },
          { label: "Fee Summary",   icon: TrendingUp, path: "/fees/summary" },
        ],
      },
    ],
  },
  {
    section: "SERVICES",
    items: [
      { label: "Clearance",     icon: CheckCircle,   path: "/clearance" },
      { label: "Hostel",        icon: Building2,     path: "/hostel" },
      { label: "Reporting",     icon: AlertTriangle, path: "/reporting" },
      { label: "Attachments",   icon: Paperclip,     path: "/attachments" },
      { label: "Student Forms", icon: FileStack,     path: "/forms" },
      { label: "Lost ID Card",  icon: Bookmark,      path: "/lost-card" },
      { label: "Disciplinary",  icon: Scale,         path: "/disciplinary" },
    ],
  },
];

const NOTIFS = [
  { msg: "Your fee balance is KES 12,500",   time: "2 hrs ago",  unread: true  },
  { msg: "Unit registration is now open",     time: "1 day ago",  unread: true  },
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

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const toggle    = (label) => setOpenMenus(p => ({ ...p, [label]: !p[label] }));
  const isActive  = (path)  => location.pathname === path;
  const hasActive = (ch)    => ch?.some(c => location.pathname === c.path);
  const unread    = NOTIFS.filter(n => n.unread).length;

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    clearTokens();
    navigate("/login");
  };

  const currentPageLabel = NAV.flatMap(g => g.items)
    .flatMap(i => i.children ? [i, ...i.children] : [i])
    .find(i => i.path === location.pathname)?.label || "Dashboard";

  // Detect mobile via CSS media query (reliable, no flicker)
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const NavContent = ({ isDrawer = false }) => {
    const slim = collapsed && !isDrawer;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Logo row */}
        <div style={{
          height: 64, flexShrink: 0,
          display: "flex", alignItems: "center",
          justifyContent: slim ? "center" : "space-between",
          padding: slim ? "0 16px" : "0 12px 0 20px",
          borderBottom: `1px solid ${GREY3}`,
          background: WHITE,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <img src={logo} alt="TTI LOGO" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
            {!slim && (
              <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: DARK, letterSpacing: 0.4, lineHeight: 1.2 }}>THIKA TECHNICAL</div>
                <div style={{ fontSize: 9, color: GREY4, letterSpacing: 2.5 }}>TRAINING INSTITUTE</div>
              </div>
            )}
          </div>
          {!slim && (
            <button
              onClick={() => isDrawer ? setMobileOpen(false) : setCollapsed(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
            >
              <X size={16} color={GREY4} />
            </button>
          )}
        </div>

        {/* Scrollable nav links */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0", background: WHITE }} className="s-scroll">
          {NAV.map((group) => (
            <div key={group.section}>
              {!slim && (
                <div style={{ padding: "14px 20px 4px", fontSize: 9.5, fontWeight: 700, color: GREY4, letterSpacing: 2, textTransform: "uppercase" }}>
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                if (item.children) {
                  const open   = openMenus[item.label];
                  const active = hasActive(item.children);
                  const Icon   = item.icon;
                  return (
                    <div key={item.label}>
                      <div
                        onClick={() => !slim && toggle(item.label)}
                        style={{
                          display: "flex", alignItems: "center",
                          gap: 10, padding: slim ? "11px 0" : "10px 20px",
                          justifyContent: slim ? "center" : "flex-start",
                          cursor: "pointer", userSelect: "none",
                          borderLeft: active && !open ? `3px solid ${P}` : "3px solid transparent",
                          background: active && !open ? `${P}10` : "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = GREY2}
                        onMouseLeave={e => e.currentTarget.style.background = active && !open ? `${P}10` : "transparent"}
                      >
                        <Icon size={17} color={active ? P : GREY4} style={{ flexShrink: 0 }} />
                        {!slim && (
                          <>
                            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: active ? P : DARK, whiteSpace: "nowrap" }}>
                              {item.label}
                            </span>
                            <ChevronRight size={14} color={GREY4} style={{ transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }} />
                          </>
                        )}
                      </div>
                      {!slim && open && (
                        <div style={{ borderLeft: `3px solid ${P}`, marginLeft: 20, background: GREY1 }}>
                          {item.children.map(child => {
                            const ChildIcon   = child.icon;
                            const childActive = isActive(child.path);
                            return (
                              <Link key={child.path} to={child.path} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "9px 16px", textDecoration: "none",
                                background: childActive ? P : "transparent",
                                transition: "background 0.15s",
                              }}
                                onMouseEnter={e => { if (!childActive) e.currentTarget.style.background = GREY2; }}
                                onMouseLeave={e => { if (!childActive) e.currentTarget.style.background = "transparent"; }}
                              >
                                <ChildIcon size={15} color={childActive ? WHITE : GREY4} />
                                <span style={{ fontSize: 13, fontWeight: childActive ? 700 : 400, color: childActive ? WHITE : GREY4, whiteSpace: "nowrap" }}>
                                  {child.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                const active = isActive(item.path);
                const Icon   = item.icon;
                return (
                  <Link key={item.path} to={item.path} style={{
                    display: "flex", alignItems: "center",
                    gap: 10, padding: slim ? "11px 0" : "10px 20px",
                    justifyContent: slim ? "center" : "flex-start",
                    textDecoration: "none",
                    borderLeft: active ? `3px solid ${P}` : "3px solid transparent",
                    background: active ? `${P}10` : "transparent",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = GREY2; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon size={17} color={active ? P : GREY4} style={{ flexShrink: 0 }} />
                    {!slim && (
                      <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? P : DARK, whiteSpace: "nowrap" }}>
                        {item.label}
                      </span>
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
              gap: 10, padding: slim ? "14px 0" : "14px 20px",
              justifyContent: slim ? "center" : "flex-start",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = GREY2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={17} color={GREY4} />
            {!slim && <span style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>Logout</span>}
          </div>
        </div>
      </div>
    );
  };

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

        /* Desktop sidebar — hidden on mobile */
        .desktop-sidebar {
          flex-shrink: 0;
          overflow: hidden;
          background: ${WHITE};
          border-right: 1px solid ${GREY3};
          transition: width 0.25s ease, min-width 0.25s ease;
          z-index: 100;
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }

        /* Mobile drawer */
        .mob-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 399;
          backdrop-filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.26s ease;
        }
        .mob-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .mob-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 270px;
          background: ${WHITE};
          border-right: 1px solid ${GREY3};
          box-shadow: 4px 0 28px rgba(0,0,0,0.15);
          z-index: 400;
          transform: translateX(-100%);
          transition: transform 0.26s cubic-bezier(.4,0,.2,1);
        }
        .mob-drawer.open { transform: translateX(0); }

        /* Notification dropdown on small phones */
        @media (max-width: 480px) {
          .notif-dropdown {
            width: calc(100vw - 16px) !important;
            right: -46px !important;
          }
          .profile-text { display: none !important; }
        }

        /* Hamburger button — always visible, no clipping */
        .hamburger-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .hamburger-btn:hover { background: ${GREY2}; }
        .hamburger-btn:active { background: ${GREY3}; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>

        {/* Desktop sidebar */}
        <div
          className="desktop-sidebar"
          style={{ width: collapsed ? 64 : 256, minWidth: collapsed ? 64 : 256 }}
        >
          <NavContent isDrawer={false} />
        </div>

        {/* Mobile overlay — always in DOM, shown via opacity */}
        <div
          className={`mob-overlay${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile drawer — always in DOM, slides via transform */}
        <div className={`mob-drawer${mobileOpen ? " open" : ""}`}>
          <NavContent isDrawer={true} />
        </div>

        {/* Right column: header + content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* ===== HEADER ===== */}
          <header style={{
            height: 64,
            flexShrink: 0,
            background: WHITE,
            borderBottom: `1px solid ${GREY3}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            zIndex: 99,
          }}>

            {/* Left: hamburger + page title — flex-shrink:0 prevents squishing */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,      // ← KEY FIX: was missing, caused button to get squished off-screen
              minWidth: 0,
              overflow: "hidden",
            }}>
              <button
                className="hamburger-btn"
                onClick={() => {
                  if (isMobile()) {
                    setMobileOpen(prev => !prev);
                  } else {
                    setCollapsed(prev => !prev);
                  }
                }}
                aria-label="Toggle navigation menu"
              >
                <span style={{ fontSize: 22, color: "#1e293b", lineHeight: 1, fontFamily: "sans-serif" }}>☰</span>
              </button>

              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: DARK,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {currentPageLabel}
                </div>
                <div style={{ fontSize: 11, color: GREY4, whiteSpace: "nowrap" }}>
                  Thika TTI Student Portal
                </div>
              </div>
            </div>

            {/* Right: notifications + profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

              {/* Bell */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                  style={{
                    width: 38, height: 38, borderRadius: 8,
                    background: notifOpen ? `${P}10` : "none",
                    border: `1px solid ${notifOpen ? P : "transparent"}`,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", transition: "all 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <Bell size={18} color={GREY4} />
                  {unread > 0 && (
                    <div style={{
                      position: "absolute", top: 7, right: 7,
                      width: 8, height: 8, background: P,
                      borderRadius: "50%", border: `2px solid ${WHITE}`,
                    }} />
                  )}
                </button>

                {notifOpen && (
                  <div className="notif-dropdown" style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: 320, background: WHITE, borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    border: `1px solid ${GREY3}`, zIndex: 999, overflow: "hidden",
                  }}>
                    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GREY3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>Notifications</span>
                      {unread > 0 && (
                        <span style={{ background: P, color: WHITE, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{unread} new</span>
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
                        <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: n.unread ? P : GREY3 }} />
                        <div>
                          <p style={{ fontSize: 13, color: DARK, fontWeight: n.unread ? 600 : 400, lineHeight: 1.4, margin: 0 }}>{n.msg}</p>
                          <p style={{ fontSize: 11, color: GREY4, margin: "3px 0 0" }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "10px 18px", textAlign: "center", borderTop: `1px solid ${GREY3}` }}>
                      <span style={{ fontSize: 12.5, color: P, fontWeight: 700, cursor: "pointer" }}>View all notifications</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: profileOpen ? `${P}10` : "none",
                    border: `1px solid ${profileOpen ? P : "transparent"}`,
                    borderRadius: 8, padding: "5px 8px 5px 5px",
                    cursor: "pointer", transition: "all 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: P,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, color: WHITE, fontSize: 13, flexShrink: 0,
                  }}>S</div>
                  <div className="profile-text" style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: DARK, lineHeight: 1.2, whiteSpace: "nowrap" }}>Student</div>
                    <div style={{ fontSize: 10.5, color: GREY4, whiteSpace: "nowrap" }}>TTI/2023/001</div>
                  </div>
                  <ChevronRight size={14} color={GREY4} style={{ transform: profileOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {profileOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: 200, background: WHITE, borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    border: `1px solid ${GREY3}`, zIndex: 999, overflow: "hidden",
                  }}>
                    {[
                      { label: "My Profile",      icon: User,     path: "/profile" },
                      { label: "Change Password", icon: KeyRound, path: "/change-password" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.path} to={item.path} onClick={() => setProfileOpen(false)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "11px 16px", textDecoration: "none",
                          borderBottom: `1px solid ${GREY3}`,
                          transition: "background 0.15s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = GREY2}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Icon size={15} color={GREY4} />
                          <span style={{ fontSize: 13.5, color: DARK, fontWeight: 500 }}>{item.label}</span>
                        </Link>
                      );
                    })}
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
                      <LogOut size={15} color={GREY4} />
                      <span style={{ fontSize: 13.5, color: DARK, fontWeight: 500 }}>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, overflowY: "auto", padding: "24px 20px", background: GREY1 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}