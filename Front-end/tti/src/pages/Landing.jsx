import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import scouts from "../assets/scouts.jpg";
import sports from "../assets/sports.jpeg";
import image1 from "../assets/img1.jpeg";
import image2 from "../assets/images2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";
import career from "../assets/career.jpeg";
import { Link } from "react-router-dom";

const PRIMARY = "#0274BE";
const RED = "#C0392B";
const DARK = "#0D1B2A";
const LIGHT_BG = "#F8FAFC";
const WHITE = "#FFFFFF";

// ─── DATA ────────────────────────────────────────────────────────────────────

const topLinks = [
  { label: "About Us", href: "#" },
  { label: "Downloads", href: "#" },
  { label: "Vacancies", href: "#" },
  { label: "Tenders", href: "#" },
  { label: "Virtual Learning", href: "#" },
  { label: "E-Learning Portal", href: "#" },
  { label: "Student Portal", href: "/login" },
  { label: "Staff Portal", href: "#" },
  { label: "Library", href: "#" },
];

const mainLinks = [
  { label: "Home", href: "#" },
  { label: "Admissions", href: "#" },
  { label: "Academic Departments", href: "#" },
  {
    label: "Student Affairs", href: "#",
    sub: ["Student Welfare", "Clubs & Societies", "Sports", "Chaplaincy"],
  },
  { label: "Research", href: "#" },
  { label: "Career Services", href: "#" },
  { label: "Contact", href: "#" },
];

const heroSlides = [
  {
    img: image1,
    title: "Engineering Tomorrow's",
    highlight: "Kenya",
    sub: "Premier TVET Institution in the Mt. Kenya Region",
  },
  {
    img: image3,
    title: "Skills. Knowledge.",
    highlight: "Purpose.",
    sub: "Transforming Lives Through Technical Education",
  },
  {
    img: image4,
    title: "Build Your Future",
    highlight: "With Us",
    sub: "Over 50 Programs Across 10 Departments",
  },
];

const news = [
  {
    tag: "INTAKE",
    date: "Nov 2025",
    title: "The Dual Training Model (DTVET): A Strategic Framework for Technical Excellence",
    excerpt: "The Dual Training Model bridges academia and industry, giving students real-world experience alongside classroom learning.",
    img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80",
    featured: true,
  },
  {
    tag: "ACADEMICS",
    date: "Aug 2025",
    title: "September 2025 Intake Courses Now Available",
    excerpt: "Click here to download the full list of courses available for the September 2025 intake.",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
  },
  {
    tag: "CURRICULUM",
    date: "Aug 2025",
    title: "Information on Modularized Curriculum",
    excerpt: "The new modularized curriculum ensures students gain competency-based skills relevant to the job market.",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80",
  },
  {
    tag: "INTAKE",
    date: "Apr 2025",
    title: "May 2025 Intake Full Time and Short Courses",
    excerpt: "Download the full list of available full-time and short courses for the May 2025 intake period.",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  },
];

const notices = [
  "May 2026 Intake — Applications Open Now",
  "The Dual Training Model (DTVET) — Read More",
  "September 2025 Intake Courses Available",
  "Information on Modularized Curriculum",
  "HELB Applications — Deadline Approaching",
];

const departments = [
  { name: "Mechanical Engineering", icon: "⚙️" },
  { name: "Health Sciences", icon: "🏥" },
  { name: "Business Studies", icon: "📊" },
  { name: "Agriculture & Environment", icon: "🌿" },
  { name: "Liberal Studies", icon: "📚" },
  { name: "Electrical & Electronics", icon: "⚡" },
  { name: "Information & Communication Technology", icon: "💻" },
  { name: "Building & Civil Engineering", icon: "🏗️" },
  { name: "Applied Sciences", icon: "🔬" },
  { name: "Open Distance & Flexible Learning", icon: "🌐" },
];

const tweets = [
  {
    text: "Join our April short course in Mechanical and Automotive Engineering and gain skills to get you ready for the market.",
    date: "2 days ago",
  },
  {
    text: "Wewe ni KCSE 2025 graduate na bado hujui next move? Usistress! FREE career guidance this Wed, Jan 28. #CareerGuidance",
    date: "1 week ago",
  },
  {
    text: "Tunawatakia #MwakaMpyaWaAmani, nguvu mpya, dreams mpya na ushindi mob. Find all courses for January 2026 Intake here.",
    date: "2 weeks ago",
  },
  {
    text: "Automotive Tech Levels 4, 5 & 6 kicking off this January. If cars are your thing, this is your moment. Secure your slot!",
    date: "3 weeks ago",
  },
];

const partners = ["NITA", "KNEC", "KASNEB", "GIZ", "HELB", "KUCCPS", "TVETA", "TVET CDACC"];

const values = [
  { icon: "🏆", title: "Professionalism", desc: "We uphold the highest standards in everything we do." },
  { icon: "🤝", title: "Integrity", desc: "Honest, transparent and accountable in all dealings." },
  { icon: "👥", title: "Teamwork", desc: "Collaboration drives our collective success." },
  { icon: "⚖️", title: "Equity & Fairness", desc: "Equal opportunity for every student and staff member." },
  { icon: "💡", title: "Innovation", desc: "Continuously improving through creative thinking." },
  { icon: "🎯", title: "Customer Focus", desc: "Students and stakeholders are at our core." },
];

const studentLife = [
  {
    title: "Sports",
    img: sports,
    desc: "Compete, grow and build teamwork through our vibrant sports programs.",
  },
  {
    title: "Career Services",
    img: career,
    desc: "Career guidance, job placement and industry connections for every graduate.",
  },
  {
    title: "Clubs & Societies",
    img: scouts,
    desc: "Explore your passions and make lifelong friends through our many clubs.",
  },
];

const stats = [
  { label: "Graduates", value: "10,000+" },
  { label: "Programs", value: "50+" },
  { label: "Exam Bodies", value: "6" },
  { label: "Graduations", value: "20+" },
];

const footerDepts = [
  "Agricultural Engineering", "Business & Management Studies",
  "Mechanical Engineering", "Electrical & Electronics",
  "Applied Sciences", "ICT Department",
  "Building & Civil Engineering", "Health Sciences",
  "Open Distance & Flexible Learning", "Liberal Studies",
];

const footerSupport = [
  "Finance", "Procurement", "Catering",
  "Internal Audit", "Industrial & Liaisons Office",
  "Public Relations", "Monitoring & Evaluation",
];

const studentResources = [
  { label: "HELB Portal", href: "https://portal.helb.co.ke" },
  { label: "KNEC", href: "https://www.knec.ac.ke" },
  { label: "KUCCPS", href: "https://students.kuccps.net" },
  { label: "Student Portal", href: "/login" },
  { label: "E-Learning Portal", href: "#" },
  { label: "TVET Authority", href: "https://www.tveta.go.ke" },
  { label: "Ministry of Education", href: "https://www.education.go.ke" },
  { label: "TVET CDACC", href: "https://www.tvetcdacc.go.ke" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 960,
    isDesktop: width >= 960,
    width,
  };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TopBar() {
  const { isMobile } = useBreakpoint();
  if (isMobile) return null; // hidden on mobile to avoid clutter
  return (
    <div style={{
      background: DARK,
      padding: "7px 0",
      borderBottom: `3px solid ${PRIMARY}`,
      width: "100%",
      overflow: "hidden",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap", alignItems: "center" }}>
          {topLinks.map((l, i) => (
            <a key={l.label} href={l.href} style={{
              color: l.label === "Student Portal" ? WHITE : "rgba(255,255,255,0.55)",
              fontSize: 11,
              padding: "4px 11px",
              textDecoration: "none",
              fontFamily: "'Barlow', sans-serif",
              letterSpacing: "0.4px",
              background: l.label === "Student Portal" ? PRIMARY : "transparent",
              borderRadius: l.label === "Student Portal" ? 3 : 0,
              fontWeight: l.label === "Student Portal" ? 700 : 400,
              transition: "color 0.2s",
              borderRight: i < topLinks.length - 1 && l.label !== "Student Portal" ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
              onMouseEnter={e => { if (l.label !== "Student Portal") e.target.style.color = WHITE; }}
              onMouseLeave={e => { if (l.label !== "Student Portal") e.target.style.color = "rgba(255,255,255,0.55)"; }}
            >{l.label}</a>
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "'Barlow', sans-serif", whiteSpace: "nowrap" }}>
          📞 020-2044965 &nbsp;|&nbsp; 0743 514 539 &nbsp;|&nbsp; info@thikatechnical.ac.ke
        </div>
      </div>
    </div>
  );
}

function MainNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isMobile, isTablet } = useBreakpoint();
  const isMobileOrTablet = isMobile || isTablet;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change / resize
  useEffect(() => {
    if (!isMobileOrTablet) setMenuOpen(false);
  }, [isMobileOrTablet]);

  return (
    <nav style={{
      background: scrolled ? "rgba(2,116,190,0.98)" : WHITE,
      backdropFilter: scrolled ? "blur(12px)" : "none",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.15)" : "0 1px 0 rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        boxSizing: "border-box",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <img src={logo} alt="TTI logo" style={{ width: 40 }} />
          </div>
          <div>
            <div style={{
              color: scrolled ? WHITE : DARK,
              fontWeight: 800, fontSize: isMobile ? 12 : 14,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 1.5, lineHeight: 1.1,
              transition: "color 0.3s",
            }}>
              THIKA TECHNICAL
            </div>
            <div style={{
              color: scrolled ? "rgba(255,255,255,0.7)" : PRIMARY,
              fontSize: 9,
              fontFamily: "'Barlow', sans-serif",
              letterSpacing: 2,
              transition: "color 0.3s",
            }}>
              TRAINING INSTITUTE
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        {!isMobileOrTablet && (
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            {mainLinks.map((l) => (
              <div key={l.label} style={{ position: "relative" }}
                onMouseEnter={() => l.sub && setActiveDropdown(l.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a href={l.href} style={{
                  color: scrolled ? WHITE : DARK,
                  fontSize: 12.5,
                  padding: "8px 11px",
                  textDecoration: "none",
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  display: "block",
                  borderRadius: 4,
                  transition: "all 0.2s",
                  background: "transparent",
                  whiteSpace: "nowrap",
                  opacity: 0.85,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = scrolled ? "rgba(255,255,255,0.15)" : "rgba(2,116,190,0.07)";
                    e.currentTarget.style.color = scrolled ? WHITE : PRIMARY;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = scrolled ? WHITE : DARK;
                  }}
                >
                  {l.label}{l.sub ? " ▾" : ""}
                </a>
                {l.sub && activeDropdown === l.label && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0,
                    background: WHITE,
                    borderRadius: 6,
                    minWidth: 190,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    border: `1px solid rgba(0,0,0,0.07)`,
                    overflow: "hidden",
                    borderTop: `3px solid ${PRIMARY}`,
                  }}>
                    {l.sub.map(s => (
                      <a key={s} href="#" style={{
                        display: "block", padding: "11px 18px",
                        color: "#444", fontSize: 12.5,
                        fontFamily: "'Barlow', sans-serif",
                        textDecoration: "none", transition: "all 0.15s",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = LIGHT_BG; e.currentTarget.style.color = PRIMARY; e.currentTarget.style.paddingLeft = "22px"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#444"; e.currentTarget.style.paddingLeft = "18px"; }}
                      >{s}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Apply Now CTA */}
          {!isMobile && (
            <a href="#" style={{
              background: RED,
              color: WHITE,
              padding: "9px 18px",
              borderRadius: 4,
              fontWeight: 800,
              fontSize: 12,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 1.5,
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow: "0 2px 10px rgba(192,57,43,0.3)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#a93226"; }}
              onMouseLeave={e => { e.currentTarget.style.background = RED; }}
            >Apply Now</a>
          )}

          {/* Hamburger */}
          {isMobileOrTablet && (
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: "transparent",
              border: `2px solid ${scrolled ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.15)"}`,
              borderRadius: 6,
              padding: "7px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: scrolled ? WHITE : DARK,
                  borderRadius: 2,
                  transition: "all 0.3s",
                  transformOrigin: "center",
                  transform: menuOpen
                    ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                    : i === 1 ? "scaleX(0)"
                    : "rotate(-45deg) translate(4px, -4px)"
                    : "none",
                }} />
              ))}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOrTablet && menuOpen && (
        <div style={{
          background: WHITE,
          borderTop: `3px solid ${PRIMARY}`,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}>
          {mainLinks.map((l) => (
            <div key={l.label}>
              <a href={l.href} style={{
                display: "block",
                padding: "14px 20px",
                color: DARK,
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = LIGHT_BG; e.currentTarget.style.color = PRIMARY; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = DARK; }}
              >
                {l.label}
              </a>
              {l.sub && l.sub.map(s => (
                <a key={s} href="#" style={{
                  display: "block",
                  padding: "10px 20px 10px 36px",
                  color: "#666",
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 13,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  background: "rgba(2,116,190,0.03)",
                }}>› {s}</a>
              ))}
            </div>
          ))}
          {isMobile && (
            <div style={{ padding: 16 }}>
              <a href="#" style={{
                display: "block",
                background: RED,
                color: WHITE,
                padding: "12px",
                borderRadius: 4,
                fontWeight: 800,
                fontSize: 13,
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 1.5,
                textDecoration: "none",
                textTransform: "uppercase",
                textAlign: "center",
              }}>Apply Now</a>
            </div>
          )}
          <div style={{
            padding: "12px 20px",
            background: LIGHT_BG,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            color: "#666",
            fontSize: 12,
            fontFamily: "'Barlow', sans-serif",
          }}>
            📞 020-2044965 | 0743 514 539
          </div>
        </div>
      )}
    </nav>
  );
}

function TickerBanner() {
  return (
    <div style={{
      background: PRIMARY,
      padding: "9px 0",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        animation: "ticker 18s linear infinite",
        whiteSpace: "nowrap",
        gap: 0,
      }}>
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span style={{
              background: RED,
              color: WHITE,
              padding: "2px 14px",
              fontSize: 10.5,
              fontWeight: 800,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 2.5,
              marginRight: 28,
            }}>INTAKE ALERT</span>
            <span style={{ color: WHITE, fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
              🎓 May 2026 Intake Ongoing
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, margin: "0 28px" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "'Barlow', sans-serif" }}>
              Click here to apply for your admission letter
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, margin: "0 28px" }}>|</span>
            <span style={{ color: WHITE, fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
              📞 Hotline: 020-2044965 | 0743 514 539
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, margin: "0 28px" }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", course: "" });
  const [showForm, setShowForm] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(false);
      setTimeout(() => {
        setCurrent(c => (c + 1) % heroSlides.length);
        setAnimating(true);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <div style={{ position: "relative", height: isMobile ? "100svh" : "88vh", minHeight: isMobile ? 500 : 520, overflow: "hidden", width: "100%" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${slide.img})`,
        backgroundSize: "cover", backgroundPosition: "center",
        transition: "opacity 0.5s ease",
        opacity: animating ? 1 : 0,
      }} />
      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: isMobile
          ? "linear-gradient(to bottom, rgba(13,27,42,0.88) 0%, rgba(13,27,42,0.82) 100%)"
          : "linear-gradient(110deg, rgba(13,27,42,0.93) 0%, rgba(13,27,42,0.75) 55%, rgba(2,116,190,0.25) 100%)",
      }} />
      {/* Blue accent line left */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 5, background: `linear-gradient(to bottom, ${PRIMARY}, ${RED})`,
        zIndex: 3,
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1280, margin: "0 auto",
        padding: isMobile ? "0 20px" : "0 48px",
        height: "100%", display: "flex", alignItems: "center",
        boxSizing: "border-box",
      }}>
        {isDesktop ? (
          /* Desktop: two-column */
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 60,
            width: "100%",
            alignItems: "center",
          }}>
            <HeroText slide={slide} animating={animating} isMobile={false} />
            <HeroForm formData={formData} setFormData={setFormData} />
          </div>
        ) : (
          /* Mobile/Tablet: stacked, form behind CTA button */
          <div style={{ width: "100%", maxWidth: isTablet ? 600 : "100%" }}>
            <HeroText slide={slide} animating={animating} isMobile={isMobile} />
            {isMobile && (
              <button
                onClick={() => setShowForm(o => !o)}
                style={{
                  marginTop: 12,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: WHITE,
                  padding: "10px 20px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {showForm ? "Hide Form ▲" : "Get Career Guide ▼"}
              </button>
            )}
            {(!isMobile || showForm) && (
              <div style={{ marginTop: 16 }}>
                <HeroForm formData={formData} setFormData={setFormData} compact={isMobile} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide indicators */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 3,
      }}>
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 28 : 8, height: 8,
            borderRadius: 4, border: "none", cursor: "pointer",
            background: i === current ? WHITE : "rgba(255,255,255,0.35)",
            transition: "all 0.3s ease", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

function HeroText({ slide, animating, isMobile }) {
  return (
    <div style={{
      maxWidth: 680,
      opacity: animating ? 1 : 0,
      transform: animating ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease",
    }}>
      {/* Kenya flag stripe */}
      <div style={{ display: "flex", gap: 5, marginBottom: 18 }}>
        {["#000", RED, "#27ae60"].map((c, i) => (
          <div key={i} style={{ width: 36, height: 4, background: c, borderRadius: 2 }} />
        ))}
      </div>

      <div style={{
        color: "rgba(255,255,255,0.65)", fontSize: 10, letterSpacing: 4,
        fontFamily: "'Barlow', sans-serif", fontWeight: 600,
        textTransform: "uppercase", marginBottom: 12,
      }}>
        Thika Technical Training Institute
      </div>

      <h1 style={{
        color: WHITE, margin: 0, lineHeight: 1.05,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800, fontSize: isMobile ? "clamp(32px, 10vw, 50px)" : "clamp(38px, 5.5vw, 70px)",
        textTransform: "uppercase",
      }}>
        {slide.title}<br />
        <span style={{ color: PRIMARY }}>{slide.highlight}</span>
      </h1>

      <p style={{
        color: "rgba(255,255,255,0.75)", fontSize: isMobile ? 14 : 16,
        fontFamily: "'Barlow', sans-serif", margin: "16px 0 28px",
        fontWeight: 400, maxWidth: 500, lineHeight: 1.6,
      }}>{slide.sub}</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/courses" style={{
          background: RED,
          color: WHITE,
          padding: isMobile ? "11px 22px" : "13px 30px",
          borderRadius: 4, fontWeight: 700, fontSize: isMobile ? 12 : 13,
          fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2,
          textDecoration: "none", textTransform: "uppercase",
          border: "2px solid rgba(255,255,255,0.4)", transition: "all 0.2s",
        }}>COURSES</Link>
        <a href="#" style={{
          background: "transparent", color: WHITE,
          padding: isMobile ? "11px 22px" : "13px 30px",
          borderRadius: 4, fontWeight: 700, fontSize: isMobile ? 12 : 13,
          fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2,
          textDecoration: "none", textTransform: "uppercase",
          border: "2px solid rgba(255,255,255,0.4)", transition: "all 0.2s",
        }}>Request Info</a>
      </div>
    </div>
  );
}

function HeroForm({ formData, setFormData, compact = false }) {
  return (
    <div style={{
      background: WHITE,
      padding: compact ? 20 : 32,
      borderRadius: 8,
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    }}>
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: compact ? 18 : 22,
        color: DARK, margin: "0 0 4px",
        textTransform: "uppercase", fontWeight: 800,
      }}>Get Your Career Guide</h3>
      <p style={{
        color: "#666", fontSize: 12, margin: "0 0 16px", lineHeight: 1.5,
      }}>Download 2026 course catalog &amp; fee structure instantly.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text" placeholder="Your Full Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          style={{
            padding: "12px 14px", border: "1px solid #ddd", borderRadius: 4,
            fontSize: 13, fontFamily: "'Barlow', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
          }}
        />
        <input
          type="tel" placeholder="Phone Number"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          style={{
            padding: "12px 14px", border: "1px solid #ddd", borderRadius: 4,
            fontSize: 13, fontFamily: "'Barlow', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
          }}
        />
        <select
          value={formData.course}
          onChange={e => setFormData({ ...formData, course: e.target.value })}
          style={{
            padding: "12px 14px", border: "1px solid #ddd", borderRadius: 4,
            fontSize: 13, fontFamily: "'Barlow', sans-serif",
            color: formData.course ? DARK : "#888", outline: "none",
            background: WHITE, width: "100%", boxSizing: "border-box",
          }}
        >
          <option value="">Select Course Interest</option>
          {departments.map(d => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
        <button style={{
          background: RED, color: WHITE, padding: "14px",
          border: "none", borderRadius: 4, fontWeight: 800, fontSize: 13,
          textTransform: "uppercase", letterSpacing: 1.5, cursor: "pointer",
          fontFamily: "'Barlow Condensed', sans-serif",
          boxShadow: "0 4px 16px rgba(192,57,43,0.4)", marginTop: 2,
          width: "100%",
        }}>
          Download Now →
        </button>
      </div>
      <p style={{ color: "#999", fontSize: 11, textAlign: "center", marginTop: 10, marginBottom: 0 }}>
        Trusted by 10,000+ students. Your info is secure.
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <div style={{ width: 4, height: 32, background: `linear-gradient(to bottom, ${PRIMARY}, ${RED})`, borderRadius: 2, flexShrink: 0 }} />
        <div>
          <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, fontFamily: "'Barlow', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: DARK, letterSpacing: 1, lineHeight: 1 }}>{title}</div>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginTop: 4 }} />
    </div>
  );
}

function NewsSection() {
  const featured = news[0];
  const secondary = news.slice(1);
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <section style={{ background: LIGHT_BG, padding: "60px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>
        <SectionHeader eyebrow="Latest" title="NEWS & UPDATES" />

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 320px",
          gap: 28,
          boxSizing: "border-box",
        }}>
          {/* Left — News */}
          <div>
            {/* Featured story */}
            <div style={{
              background: WHITE, borderRadius: 8, overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 20,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              borderTop: `4px solid ${PRIMARY}`,
            }}>
              <div style={{ padding: isMobile ? 20 : 28, order: isMobile ? 2 : 1 }}>
                <div style={{
                  background: PRIMARY, color: WHITE, display: "inline-block",
                  padding: "3px 10px", fontSize: 10, fontWeight: 800,
                  fontFamily: "'Barlow', sans-serif", letterSpacing: 2, marginBottom: 12,
                  borderRadius: 2,
                }}>{featured.tag}</div>
                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: isMobile ? 18 : 22, fontWeight: 800, color: DARK,
                  lineHeight: 1.25, margin: "0 0 12px", letterSpacing: 0.5,
                }}>{featured.title}</h2>
                <div style={{ width: 36, height: 3, background: RED, marginBottom: 12, borderRadius: 2 }} />
                <p style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#555",
                  lineHeight: 1.7, margin: "0 0 14px",
                }}>{featured.excerpt}</p>
                <a href="#" style={{
                  color: RED, fontSize: 12, fontWeight: 700,
                  fontFamily: "'Barlow', sans-serif", textDecoration: "none",
                  letterSpacing: 1, textTransform: "uppercase",
                  borderBottom: `2px solid ${RED}`, paddingBottom: 2,
                }}>Continue Reading →</a>
              </div>
              <img src={featured.img} alt={featured.title} style={{
                width: "100%", height: isMobile ? 200 : "100%",
                objectFit: "cover", minHeight: isMobile ? 0 : 220,
                order: isMobile ? 1 : 2,
              }} />
            </div>

            {/* Secondary cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 14,
            }}>
              {secondary.map((item, i) => (
                <div key={i} style={{
                  background: WHITE, borderRadius: 8, overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  borderTop: `3px solid rgba(2,116,190,0.3)`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                >
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: 110, objectFit: "cover" }} />
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{
                      background: DARK, color: WHITE, display: "inline-block",
                      padding: "2px 8px", fontSize: 9, fontWeight: 800,
                      fontFamily: "'Barlow', sans-serif", letterSpacing: 2, marginBottom: 8, borderRadius: 2,
                    }}>{item.tag}</div>
                    <h4 style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 14.5, fontWeight: 700, color: DARK,
                      lineHeight: 1.3, margin: "0 0 8px",
                    }}>{item.title}</h4>
                    <p style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#666",
                      lineHeight: 1.6, margin: "0 0 10px",
                    }}>{item.excerpt.substring(0, 80)}...</p>
                    <a href="#" style={{
                      color: PRIMARY, fontSize: 11, fontWeight: 700,
                      fontFamily: "'Barlow', sans-serif", textDecoration: "none",
                    }}>Read More →</a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", paddingTop: 20 }}>
              <a href="#" style={{
                color: PRIMARY, fontSize: 12, fontWeight: 700,
                fontFamily: "'Barlow Condensed', sans-serif", textDecoration: "none",
                letterSpacing: 2, textTransform: "uppercase",
                border: `2px solid ${PRIMARY}`, padding: "9px 26px",
                borderRadius: 4, transition: "all 0.2s", display: "inline-block",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = WHITE; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = PRIMARY; }}
              >View All News</a>
            </div>
          </div>

          {/* Right — Noticeboard (always shown, stacks below on mobile) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Notice Board */}
            <div style={{
              background: WHITE, borderRadius: 8,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{
                background: DARK, padding: "13px 18px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>📌</span>
                <h3 style={{
                  color: WHITE, margin: 0, fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 15, letterSpacing: 2.5, textTransform: "uppercase",
                }}>Notice Board</h3>
              </div>
              <div style={{ padding: "4px 0" }}>
                {notices.map((n, i) => (
                  <div key={i} style={{
                    padding: "11px 18px",
                    borderBottom: i < notices.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    display: "flex", gap: 12, alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: PRIMARY, flexShrink: 0, marginTop: 5,
                    }} />
                    <a href="#" style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#333",
                      textDecoration: "none", lineHeight: 1.45,
                    }}>{n}</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div style={{
              background: WHITE, borderRadius: 8,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{
                background: PRIMARY, padding: "13px 18px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>📅</span>
                <h3 style={{
                  color: WHITE, margin: 0, fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 15, letterSpacing: 2.5, textTransform: "uppercase",
                }}>Notices & Events</h3>
              </div>
              <div style={{
                background: `rgba(2,116,190,0.06)`, padding: "10px 14px",
                color: PRIMARY, fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13, letterSpacing: 2, fontWeight: 700, textAlign: "center",
              }}>
                {new Date().toLocaleDateString("en-KE", { month: "long", year: "numeric" }).toUpperCase()}
              </div>
              <div style={{ padding: "8px 12px 14px" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <span key={d} style={{
                    display: "inline-block", width: "14.28%", textAlign: "center",
                    fontSize: 10, fontWeight: 700, color: "#aaa",
                    fontFamily: "'Barlow', sans-serif",
                  }}>{d}</span>
                ))}
                <div style={{ height: 6 }} />
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() + 1;
                  const isToday = day === new Date().getDate();
                  const valid = day > 0 && day <= 31;
                  return (
                    <span key={i} style={{
                      display: "inline-block", width: "14.28%", textAlign: "center",
                      padding: "4px 0", fontSize: 11,
                      fontFamily: "'Barlow', sans-serif",
                      color: !valid ? "transparent" : isToday ? WHITE : "#444",
                      background: isToday ? RED : "transparent",
                      borderRadius: isToday ? "50%" : 0,
                      fontWeight: isToday ? 700 : 400,
                    }}>{valid ? day : ""}</span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section style={{ background: WHITE, padding: "60px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>
        <SectionHeader eyebrow="Join Us" title="BECOME A PART OF THIKA TTI" />

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 320px",
          gap: 28,
          boxSizing: "border-box",
        }}>
          {/* Departments grid */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: DARK, padding: "11px 18px", marginBottom: 2, borderRadius: "6px 6px 0 0",
            }}>
              <span style={{ fontSize: 16 }}>🎓</span>
              <h3 style={{
                color: WHITE, margin: 0, fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, letterSpacing: 2.5, textTransform: "uppercase",
              }}>Academic Departments</h3>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "0 0 6px 6px",
              overflow: "hidden",
            }}>
              {departments.map((d, i) => (
                <a key={i} href="#" style={{
                  display: "flex", alignItems: "center", gap: 13,
                  padding: "13px 18px", textDecoration: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  borderRight: !isMobile && i % 2 === 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s",
                  background: WHITE,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `rgba(2,116,190,0.05)`; e.currentTarget.querySelector(".dept-name").style.color = PRIMARY; }}
                  onMouseLeave={e => { e.currentTarget.style.background = WHITE; e.currentTarget.querySelector(".dept-name").style.color = "#333"; }}
                >
                  <span style={{
                    fontSize: 20, width: 36, height: 36,
                    background: `rgba(2,116,190,0.08)`,
                    borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>{d.icon}</span>
                  <span className="dept-name" style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 12.5,
                    color: "#333", lineHeight: 1.3, fontWeight: 600,
                    transition: "color 0.15s",
                  }}>{d.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tweets */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#1da1f2", padding: "11px 18px", marginBottom: 2, borderRadius: "6px 6px 0 0",
            }}>
              <span style={{ fontSize: 16 }}>🐦</span>
              <h3 style={{
                color: WHITE, margin: 0, fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, letterSpacing: 2.5, textTransform: "uppercase",
              }}>Latest Tweets</h3>
            </div>
            <div style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "0 0 6px 6px",
              overflow: "hidden", background: WHITE,
            }}>
              {tweets.map((t, i) => (
                <div key={i} style={{
                  padding: "15px 18px",
                  borderBottom: i < tweets.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}>
                  <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: PRIMARY, color: WHITE,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>T</div>
                    <div>
                      <div style={{
                        fontFamily: "'Barlow', sans-serif", fontWeight: 700,
                        fontSize: 11.5, color: DARK, marginBottom: 4,
                      }}>Thika Technical
                        <span style={{ color: "#aaa", fontWeight: 400, marginLeft: 6 }}>· {t.date}</span>
                      </div>
                      <p style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 12.5,
                        color: "#555", lineHeight: 1.55, margin: 0,
                      }}>{t.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "12px 18px", background: `rgba(2,116,190,0.04)` }}>
                <a href="https://twitter.com/Thika_Technical" target="_blank" rel="noreferrer" style={{
                  color: "#1da1f2", fontSize: 12, fontWeight: 700,
                  fontFamily: "'Barlow', sans-serif", textDecoration: "none",
                }}>Follow @Thika_Technical →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section style={{ background: DARK, padding: "70px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, fontFamily: "'Barlow', sans-serif", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
            Who We Are
          </div>
          <h2 style={{
            color: WHITE, fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(26px, 5vw, 44px)", margin: "0 0 16px", fontWeight: 800,
            letterSpacing: 1.5, textTransform: "uppercase",
          }}>Our Foundation</h2>
          <div style={{ width: 48, height: 3, background: RED, margin: "0 auto", borderRadius: 2 }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 18,
        }}>
          {[
            {
              icon: "🎯", title: "Our Mission",
              text: "To provide Training, Research and Outreach Programmes that impart skills and utilize applied knowledge to spur economic growth and solve problems in society.",
            },
            {
              icon: "🔭", title: "Our Vision",
              text: "To be the centre of excellence in Technical, Industrial, Vocational and Entrepreneurship Training in Kenya and the region.",
              highlight: true,
            },
            {
              icon: "⭐", title: "Our Core Values",
              list: values.map(v => v.title),
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: item.highlight ? PRIMARY : "rgba(255,255,255,0.04)",
              padding: "32px 28px", borderRadius: 8,
              borderTop: `4px solid ${item.highlight ? WHITE : PRIMARY}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              // On tablet, last card spans full width
              gridColumn: isTablet && i === 2 ? "1 / -1" : "auto",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{
                color: WHITE, fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 19, fontWeight: 800, letterSpacing: 2,
                textTransform: "uppercase", margin: "0 0 14px",
              }}>{item.title}</h3>
              <div style={{ width: 28, height: 2, background: item.highlight ? WHITE : RED, marginBottom: 14, borderRadius: 2 }} />
              {item.text && (
                <p style={{
                  color: item.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)",
                  fontFamily: "'Barlow', sans-serif", fontSize: 14, lineHeight: 1.75, margin: 0,
                }}>{item.text}</p>
              )}
              {item.list && (
                <ul style={{
                  margin: 0, padding: 0, listStyle: "none",
                  display: isTablet && i === 2 ? "grid" : "block",
                  gridTemplateColumns: isTablet && i === 2 ? "1fr 1fr 1fr" : "auto",
                  gap: isTablet && i === 2 ? "0 24px" : 0,
                }}>
                  {item.list.map((v, j) => (
                    <li key={j} style={{
                      color: "rgba(255,255,255,0.65)", fontFamily: "'Barlow', sans-serif",
                      fontSize: 13.5, padding: "5px 0", display: "flex", gap: 10,
                      borderBottom: j < item.list.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}>
                      <span style={{ color: PRIMARY, fontWeight: 700 }}>▸</span> {v}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentLifeSection() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section style={{ background: LIGHT_BG, padding: "70px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>
        <SectionHeader eyebrow="Experience" title="STUDENT LIFE @ THIKA TTI" />

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 18,
        }}>
          {studentLife.map((item, i) => (
            <div key={i} style={{
              position: "relative", overflow: "hidden", cursor: "pointer",
              height: isMobile ? 240 : 280, borderRadius: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              // On tablet, last card spans full width
              gridColumn: isTablet && i === 2 ? "1 / -1" : "auto",
            }}
              onMouseEnter={e => {
                e.currentTarget.querySelector(".overlay").style.background = `rgba(2,116,190,0.88)`;
                e.currentTarget.querySelector("img").style.transform = "scale(1.07)";
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector(".overlay").style.background = "rgba(13,27,42,0.55)";
                e.currentTarget.querySelector("img").style.transform = "scale(1)";
              }}
            >
              <img src={item.img} alt={item.title} style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.5s ease",
              }} />
              <div className="overlay" style={{
                position: "absolute", inset: 0,
                background: "rgba(13,27,42,0.55)",
                transition: "background 0.3s ease",
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end", padding: 22,
              }}>
                <div style={{ width: 28, height: 3, background: RED, marginBottom: 10, borderRadius: 2 }} />
                <h3 style={{
                  color: WHITE, margin: "0 0 8px",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 22, fontWeight: 800, letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}>{item.title}</h3>
                <p style={{
                  color: "rgba(255,255,255,0.85)", margin: 0,
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, lineHeight: 1.55,
                }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 0, marginTop: 36,
          background: DARK, borderRadius: 8, overflow: "hidden",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: isMobile ? "24px 16px" : "32px 24px", textAlign: "center",
              borderRight: (isMobile ? i % 2 === 0 : i < 3) ? "1px solid rgba(255,255,255,0.08)" : "none",
              borderBottom: isMobile && i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <div style={{
                color: RED, fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: isMobile ? 34 : 42, fontWeight: 900, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                color: "rgba(255,255,255,0.55)", fontFamily: "'Barlow', sans-serif",
                fontSize: isMobile ? 10 : 12, letterSpacing: 2, textTransform: "uppercase", marginTop: 8,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCharterSection() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section style={{ background: WHITE, padding: "70px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          gap: 48, alignItems: "center",
        }}>
          <div>
            <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, fontFamily: "'Barlow', sans-serif", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
              Our Commitment
            </div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(24px, 4vw, 40px)", margin: "0 0 18px",
              fontWeight: 800, color: DARK, lineHeight: 1.15,
              letterSpacing: 0.5, textTransform: "uppercase",
            }}>Thika Technical<br />Service Charter</h2>
            <div style={{ width: 44, height: 3, background: RED, marginBottom: 20, borderRadius: 2 }} />
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "#666",
              lineHeight: 1.8, margin: "0 0 28px",
            }}>
              A student of Thika Technical is exposed to quality service. As you walk about in the corridors of the Institute, be sure you will encounter skilled and competent staff to attend to your needs.
            </p>
            <a href="#" style={{
              display: "inline-block", background: RED, color: WHITE,
              padding: "12px 28px", textDecoration: "none",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: 13.5, letterSpacing: 2, textTransform: "uppercase",
              borderRadius: 4, boxShadow: "0 3px 12px rgba(192,57,43,0.3)",
            }}>Read More</a>
          </div>

          {/* YouTube embed */}
          <div style={{
            position: "relative", paddingBottom: "56.25%", height: 0,
            overflow: "hidden", borderRadius: 8,
            boxShadow: "0 12px 50px rgba(0,0,0,0.15)",
          }}>
            <iframe
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              src="https://www.youtube.com/embed/3DlPQvYLjwI"
              title="Thika TTI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section style={{ background: LIGHT_BG, padding: "48px 0", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", marginBottom: 28, textAlign: "center", boxSizing: "border-box" }}>
        <div style={{ color: "#aaa", fontSize: 11, letterSpacing: 4, fontFamily: "'Barlow', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
          Our Partners & Affiliates
        </div>
      </div>
      <div style={{
        display: "flex", gap: 16, animation: "marquee 18s linear infinite",
        whiteSpace: "nowrap",
      }}>
        {[...partners, ...partners, ...partners].map((p, i) => (
          <div key={i} style={{
            background: WHITE, border: `1px solid rgba(0,0,0,0.08)`,
            padding: "12px 28px", borderRadius: 6,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: 15, color: DARK,
            letterSpacing: 2.5, flexShrink: 0,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            borderTop: `3px solid ${PRIMARY}`,
          }}>{p}</div>
        ))}
      </div>
    </section>
  );
}

function IssuesSection() {
  const [form, setForm] = useState({ email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <section style={{ background: DARK, padding: "70px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px", textAlign: "center", boxSizing: "border-box" }}>
        <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, fontFamily: "'Barlow', sans-serif", fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>
          Support
        </div>
        <h2 style={{
          color: WHITE, fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(22px, 5vw, 38px)", margin: "0 0 10px", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: 1,
        }}>Having Any Issues?</h2>
        <div style={{ width: 40, height: 3, background: RED, margin: "0 auto 16px", borderRadius: 2 }} />
        <p style={{
          color: "rgba(255,255,255,0.55)", fontFamily: "'Barlow', sans-serif",
          fontSize: 15, marginBottom: 32, lineHeight: 1.6,
        }}>Please complete the form below for any complaints or inquiries.</p>

        {sent ? (
          <div style={{
            background: "rgba(2,116,190,0.15)", border: `1px solid ${PRIMARY}`,
            padding: 32, borderRadius: 6, color: WHITE,
            fontFamily: "'Barlow', sans-serif", fontSize: 16,
          }}>
            ✅ Message sent successfully. We will get back to you soon.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="email" placeholder="Your Email Address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: WHITE,
                fontFamily: "'Barlow', sans-serif", fontSize: 14, borderRadius: 4,
                outline: "none", width: "100%", boxSizing: "border-box",
              }}
            />
            <textarea
              placeholder="Your Message or Complaint"
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: WHITE,
                fontFamily: "'Barlow', sans-serif", fontSize: 14, borderRadius: 4,
                outline: "none", resize: "vertical", width: "100%", boxSizing: "border-box",
              }}
            />
            <button onClick={() => setSent(true)} style={{
              background: RED, color: WHITE, border: "none",
              padding: "14px 32px", fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: 14.5, letterSpacing: 2,
              textTransform: "uppercase", cursor: "pointer",
              borderRadius: 4, boxShadow: "0 3px 12px rgba(192,57,43,0.35)",
              width: "100%",
            }}>Submit Message</button>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <footer style={{ background: "#060f18", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 20px 0", boxSizing: "border-box" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1.5fr 1.5fr 1.5fr",
          gap: 36,
          paddingBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, background: PRIMARY, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, color: WHITE, fontSize: 13,
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
              }}>TTI</div>
              <div>
                <div style={{ color: WHITE, fontWeight: 800, fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1.5 }}>
                  THIKA TECHNICAL
                </div>
                <div style={{ color: PRIMARY, fontSize: 9.5, fontFamily: "'Barlow', sans-serif", letterSpacing: 2.5 }}>
                  TRAINING INSTITUTE
                </div>
              </div>
            </div>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontFamily: "'Barlow', sans-serif",
              fontSize: 13, lineHeight: 1.8, marginBottom: 18,
            }}>
              P.O BOX 91 – 01000, Thika<br />
              📧 info@thikatechnical.ac.ke<br />
              📞 020-2044965<br />
              📱 0743 514 539 / 0740 150 798
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { icon: "f", href: "https://www.facebook.com/thikatechnical" },
                { icon: "𝕏", href: "https://twitter.com/Thika_Technical" },
                { icon: "▶", href: "https://www.youtube.com/@thikatechnicaltraininginst4254" },
                { icon: "📷", href: "https://www.instagram.com/thika_tti/" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
                  width: 34, height: 34, background: "rgba(255,255,255,0.06)",
                  borderRadius: 6, display: "flex", alignItems: "center",
                  justifyContent: "center", color: "rgba(255,255,255,0.55)",
                  textDecoration: "none", fontSize: 13, transition: "all 0.2s",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = WHITE; e.currentTarget.style.borderColor = PRIMARY; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Academic Departments */}
          <div>
            <h4 style={{
              color: WHITE, fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase",
              margin: "0 0 16px", paddingBottom: 12,
              borderBottom: `2px solid ${PRIMARY}`,
            }}>Academic Departments</h4>
            {footerDepts.map((d, i) => (
              <a key={i} href="#" style={{
                display: "block", color: "rgba(255,255,255,0.45)",
                fontFamily: "'Barlow', sans-serif", fontSize: 12,
                textDecoration: "none", padding: "4px 0", transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = WHITE}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >› {d}</a>
            ))}
          </div>

          {/* Student Resources */}
          <div>
            <h4 style={{
              color: WHITE, fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase",
              margin: "0 0 16px", paddingBottom: 12,
              borderBottom: `2px solid ${RED}`,
            }}>Student Resources</h4>
            {studentResources.map((r, i) => (
              <a key={i} href={r.href} style={{
                display: "block", color: "rgba(255,255,255,0.45)",
                fontFamily: "'Barlow', sans-serif", fontSize: 12,
                textDecoration: "none", padding: "4px 0", transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = WHITE}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >› {r.label}</a>
            ))}
          </div>

          {/* Map */}
          <div>
            <h4 style={{
              color: WHITE, fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase",
              margin: "0 0 16px", paddingBottom: 12,
              borderBottom: `2px solid rgba(255,255,255,0.15)`,
            }}>Find Us</h4>
            <div style={{
              position: "relative", paddingBottom: "70%", height: 0,
              overflow: "hidden", borderRadius: 6,
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1577933511653!2d37.07773657496532!3d-1.0425870989473822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4f8ce25a05df%3A0x30943508fed621a7!2sTHIKA%20TECHNICAL%20TRAINING%20INSTITUTE!5e0!3m2!1sen!2ske!4v1772484526882!5m2!1sen!2ske"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Thika TTI Map"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 0", textAlign: "center",
        }}>
          <p style={{
            color: "rgba(255,255,255,0.25)", fontFamily: "'Barlow', sans-serif",
            fontSize: 12, margin: 0,
          }}>
            © {new Date().getFullYear()} Thika Technical Training Institute. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); }
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); }
  }

  input::placeholder, textarea::placeholder {
    color: rgba(255,255,255,0.3);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0d1b2a; }
  ::-webkit-scrollbar-thumb { background: #0274BE; border-radius: 3px; }

  img { max-width: 100%; }
`;

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
        <TopBar />
        <MainNav />
        <TickerBanner />
        <HeroCarousel />
        <NewsSection />
        <CoursesSection />
        <MissionSection />
        <StudentLifeSection />
        <ServiceCharterSection />
        <PartnersSection />
        <IssuesSection />
        <Footer />
      </div>
    </>
  );
}