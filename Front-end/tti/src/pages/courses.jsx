import { useState, useEffect } from "react";
import { Search, Clock, Award, BookOpen, ChevronDown, ChevronUp, GraduationCap, Zap } from "lucide-react";

const allCourses = [
  {
    id: 1, department: "Automotive Engineering", icon: "🚗",
    courses: [
      { name: "Diploma in Automotive Engineering", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC/KNEC", intake: "May/September" },
      { name: "Craft Certificate in Automotive Technology", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Artisan in Motor Vehicle Mechanics", level: "Artisan", duration: "1 Year", entry: "D- (Minus)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 2, department: "Mechanical Engineering", icon: "⚙️",
    courses: [
      { name: "Diploma in Mechanical Engineering (Plant-TEP)", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Diploma in Mechanical Engineering (Production)", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Craft Certificate in Mechanical Engineering", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Craft Certificate in Metal Processing Technology", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Craft Certificate in Welding & Fabrication", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Artisan in Mechanical Engineering", level: "Artisan", duration: "1 Year", entry: "D- (Minus)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 3, department: "Electrical & Electronics", icon: "⚡",
    courses: [
      { name: "Diploma in Electrical Installation (Level 6)", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Diploma in Electrical & Electronics Engineering", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC/KNEC", intake: "May/September" },
      { name: "Diploma in Solar Technology", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Craft Certificate in Electrical Installation", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Craft Certificate in Electronics", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Artisan in Electrical Installation", level: "Artisan", duration: "1 Year", entry: "D- (Minus)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 4, department: "Building & Civil Engineering", icon: "🏗️",
    courses: [
      { name: "Diploma in Civil Engineering", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC/KNEC", intake: "May/September" },
      { name: "Diploma in Architecture", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Diploma in Quantity Surveying", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Diploma in Construction Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Craft Certificate in Plumbing", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Craft Certificate in Masonry", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Craft Certificate in Carpentry & Joinery", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Artisan in Masonry", level: "Artisan", duration: "1 Year", entry: "D- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Artisan in Plumbing", level: "Artisan", duration: "1 Year", entry: "D- (Minus)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 5, department: "Agricultural Engineering", icon: "🌾",
    courses: [
      { name: "Diploma in Agricultural Engineering", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Diploma in Entrepreneurial Agriculture", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "CDACC", intake: "May/September" },
      { name: "Certificate in Agricultural Engineering", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Agri-Business Development", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Artisan in Agricultural Engineering", level: "Artisan", duration: "1 Year", entry: "D- (Minus)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 6, department: "ICT & Computing", icon: "💻",
    courses: [
      { name: "Diploma in Information Technology", level: "Diploma", duration: "18 Months", entry: "C- (Minus)", examBody: "ICM-UK", intake: "May/September" },
      { name: "Diploma in ICT (Modular)", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "DICT Foundation (Module 1 & 2)", level: "Certificate", duration: "6 Months/Module", entry: "D+ (Plus)", examBody: "KASNEB", intake: "May/September" },
      { name: "CICT Professional (Section 1-6)", level: "Professional", duration: "6 Months/Section", entry: "C- (Minus)", examBody: "KASNEB", intake: "May/September" },
      { name: "Certificate in Information Technology", level: "Certificate", duration: "6 Months", entry: "D+ (Plus)", examBody: "ICM-UK", intake: "May/September" },
      { name: "Library & Information Science", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Records & Archives Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 7, department: "Health Sciences", icon: "🏥",
    courses: [
      { name: "Diploma in Pharmaceutical Technology", level: "Diploma", duration: "3 Years", entry: "C (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Applied Biology", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Analytical Chemistry", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Food Science Technology", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Nutrition & Dietetics", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Craft Certificate in Science Lab Technology", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Nutrition & Dietetics", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 8, department: "Business Studies", icon: "📊",
    courses: [
      { name: "Diploma in Business Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC/ICM", intake: "May/September" },
      { name: "Diploma in Human Resource Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Sales & Marketing", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Supply Chain Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Front Office Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "ICM-UK", intake: "May/September" },
      { name: "Certificate in Business Management", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Sales & Marketing", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "CPA (KASNEB)", level: "Professional", duration: "6 Months/Section", entry: "C+ (Plus)", examBody: "KASNEB", intake: "May/September" },
      { name: "Accounting Technicians Diploma (ATD)", level: "Professional", duration: "6 Months/Level", entry: "C- (Minus)", examBody: "KASNEB", intake: "May/September" },
      { name: "Certificate in Banking & Finance", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 9, department: "Hospitality & Catering", icon: "🍽️",
    courses: [
      { name: "Diploma in Catering & Accommodation Management", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Food & Beverage Production", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Baking Technology", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Food & Beverage Production", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 10, department: "Liberal Studies", icon: "📚",
    courses: [
      { name: "Diploma in Journalism & Media Studies", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Diploma in Social Work & Community Dev.", level: "Diploma", duration: "3 Years", entry: "C- (Minus)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Social Work", level: "Certificate", duration: "2 Years", entry: "D (Plain)", examBody: "KNEC", intake: "May/September" },
      { name: "Certificate in Kenyan Sign Language", level: "Certificate", duration: "1 Year", entry: "Open", examBody: "KNEC", intake: "May/September" },
    ]
  },
  {
    id: 11, department: "Short Courses", icon: "⏱️",
    courses: [
      { name: "Motor Vehicle Mechanics", level: "Short Course", duration: "3-6 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
      { name: "Spray Painting & Panel Beating", level: "Short Course", duration: "3-6 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
      { name: "Electrical Wiring & Installation", level: "Short Course", duration: "3-6 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
      { name: "Masonry & Tiling", level: "Short Course", duration: "3-6 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
      { name: "Carpentry & Cabinet Making", level: "Short Course", duration: "3-6 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
      { name: "Basic Computer Training", level: "Short Course", duration: "1-3 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
      { name: "Advanced Computer Applications", level: "Short Course", duration: "3 Months", entry: "Open", examBody: "Internal", intake: "Monthly" },
    ]
  },
];

const LEVEL_META = {
  "Diploma":       { color: "#0274BE", bg: "#dbeafe" },
  "Certificate":   { color: "#16a34a", bg: "#dcfce7" },
  "Artisan":       { color: "#b45309", bg: "#fef3c7" },
  "Professional":  { color: "#7c3aed", bg: "#ede9fe" },
  "Short Course":  { color: "#0274BE", bg: "#dbeafe" },
};

const LEVELS = ["All", "Diploma", "Certificate", "Artisan", "Professional", "Short Course"];
const EXAM_BODIES = ["All", "KNEC", "CDACC", "KASNEB", "ICM-UK"];
const TOTAL = allCourses.reduce((s, d) => s + d.courses.length, 0);

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [examBody, setExamBody] = useState("All");
  const [openDept, setOpenDept] = useState(null);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1440);

  useEffect(() => {
    const fn = () => setVw(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const sm = vw < 640;
  const md = vw < 1024;

  const filtered = allCourses.map(d => ({
    ...d,
    rows: d.courses.filter(c => {
      const q = search.toLowerCase();
      return (
        (c.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q)) &&
        (level === "All" || c.level === level) &&
        (examBody === "All" || c.examBody.includes(examBody))
      );
    })
  })).filter(d => d.rows.length > 0);

  const totalShowing = filtered.reduce((s, d) => s + d.rows.length, 0);
  const hasFilters = search || level !== "All" || examBody !== "All";
  const clearAll = () => { setSearch(""); setLevel("All"); setExamBody("All"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
          box-sizing: border-box !important;
        }

        *, *::before, *::after { box-sizing: border-box; }

        .W {
          width: 100vw !important;
          max-width: 100vw !important;
          margin-left: calc(-50vw + 50%) !important;
          position: relative !important;
        }

        .hero {
          background: #0D1B2A;
          padding: 72px 5vw 64px;
          position: relative;
          overflow: hidden;
        }
        .hero::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #C0392B, #0274BE 50%, #C0392B);
        }
        .hero-glow {
          position: absolute; top: -150px; right: -150px;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(2,116,190,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-content { position: relative; z-index: 2; }
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #C0392B; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 2px; margin-bottom: 24px;
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; color: #fff;
          font-size: clamp(48px, 7vw, 96px);
          line-height: 0.93; letter-spacing: -3px;
          margin: 0 0 20px;
        }
        .hero-title em { color: #0274BE; font-style: normal; display: block; }
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.45); font-size: clamp(14px, 1.5vw, 17px);
          max-width: 500px; line-height: 1.7; margin: 0 0 44px;
        }
        .stats { display: flex; gap: clamp(28px, 5vw, 64px); flex-wrap: wrap; }
        .stat-n {
          font-family: 'Syne', sans-serif; font-weight: 800; color: #0274BE;
          font-size: clamp(30px, 4vw, 46px); line-height: 1; display: block;
        }
        .stat-l {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; display: block;
        }

        .filters {
          background: #fff;
          border-bottom: 1px solid #dde3ec;
          position: sticky; top: 0; z-index: 200;
          box-shadow: 0 2px 20px rgba(13,27,42,0.09);
          padding: 18px 5vw;
        }
        .f-grid {
          display: grid;
          gap: 10px;
        }
        .f-search { position: relative; }
        .f-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .f-input {
          width: 100%; padding: 12px 14px 12px 42px;
          border: 1.5px solid #e5e9f0; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0D1B2A;
          background: #f8fafc;
        }
        .f-input:focus { outline: none; border-color: #0274BE; box-shadow: 0 0 0 3px rgba(2,116,190,0.1); }
        .f-sel {
          padding: 12px 14px; border: 1.5px solid #e5e9f0; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0D1B2A;
          background: #f8fafc; cursor: pointer;
        }
        .f-sel:focus { outline: none; border-color: #0274BE; }
        .chips { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
        .chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; background: #0274BE; color: #fff;
        }
        .chip-r { background: #C0392B; }
        .chip button { background: none; border: none; color: #fff; cursor: pointer; font-size: 15px; line-height: 1; padding: 0; }
        .chip-clear {
          background: none; border: 1.5px solid #dde3ec; border-radius: 20px;
          padding: 4px 14px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: #9ca3af; cursor: pointer;
        }
        .chip-clear:hover { border-color: #C0392B; color: #C0392B; }

        .main { padding: 36px 5vw 72px; background: #EEF2F7; }

        .res-line {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #9ca3af; margin-bottom: 20px;
        }
        .res-line strong { color: #0D1B2A; }

        .dept {
          background: #fff; border-radius: 10px;
          border: 1px solid #dde3ec; overflow: hidden;
          margin-bottom: 10px;
          transition: box-shadow 0.2s;
        }
        .dept:hover { box-shadow: 0 4px 24px rgba(2,116,190,0.09); }

        .dept-hdr {
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer; border-left: 4px solid #0274BE;
          padding: 18px 24px; background: #fff;
          transition: background 0.15s; gap: 12px;
        }
        .dept-hdr:hover { background: #f5f9ff; }
        .dept-hdr.open { background: #eef5fd; border-left-color: #C0392B; }
        .dept-left { display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1; }
        .dept-ico {
          width: 48px; height: 48px; background: #eef5fd; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .dept-name {
          font-family: 'Syne', sans-serif; font-weight: 700; color: #0D1B2A;
          font-size: clamp(15px, 1.5vw, 18px);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .dept-sub { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .dept-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .dept-badge {
          background: #C0392B; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          padding: 4px 12px; border-radius: 20px; white-space: nowrap;
        }

        .courses-wrap { background: #f5f8fc; border-top: 1px solid #dde3ec; padding: 14px 20px 20px; }

        table.ct { width: 100%; border-collapse: collapse; }
        table.ct thead tr { background: #0D1B2A; }
        table.ct thead th {
          padding: 10px 16px; text-align: left;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 1.2px; white-space: nowrap;
        }
        table.ct thead th:last-child { text-align: right; }
        table.ct tbody tr { border-bottom: 1px solid #e8edf4; transition: background 0.12s; }
        table.ct tbody tr:last-child { border-bottom: none; }
        table.ct tbody tr:hover { background: #eef5fd; }
        table.ct tbody td {
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4b5563;
          vertical-align: middle;
        }
        table.ct tbody td:last-child { text-align: right; }
        .cn { font-size: 14px; font-weight: 600; color: #0D1B2A; margin-bottom: 5px; }
        .pill {
          display: inline-block; padding: 2px 10px; border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
        }
        .td-r { display: flex; align-items: center; gap: 6px; white-space: nowrap; }

        .mc { background: #fff; border-radius: 8px; border: 1px solid #e5e9f0; padding: 14px 16px; margin-top: 10px; }
        .mc-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #0D1B2A; line-height: 1.4; margin-bottom: 8px; }
        .mc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0 14px; }
        .mc-meta { display: flex; align-items: center; gap: 5px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #6b7280; }

        .apply {
          display: inline-block; background: #C0392B; color: #fff;
          padding: 8px 18px; border-radius: 6px; text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
          transition: background 0.15s, transform 0.1s; white-space: nowrap;
        }
        .apply:hover { background: #a93226; transform: translateY(-1px); }
        .apply-full { display: block; text-align: center; width: 100%; }

        .empty { text-align: center; padding: 80px 20px; }
        .empty-ico { font-size: 50px; margin-bottom: 16px; }
        .empty-t { font-family: 'Syne', sans-serif; font-size: 22px; color: #0D1B2A; margin-bottom: 8px; }
        .empty-s { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #9ca3af; }

        .cta {
          background: #0D1B2A;
          padding: 76px 5vw;
          position: relative; overflow: hidden; text-align: center;
        }
        .cta-glow {
          position: absolute; top: -100px; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(2,116,190,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-inner { position: relative; z-index: 2; }
        .cta-t {
          font-family: 'Syne', sans-serif; font-weight: 800; color: #fff;
          font-size: clamp(30px, 4vw, 50px); margin-bottom: 12px;
        }
        .cta-t span { color: #0274BE; }
        .cta-s { font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.45); font-size: 16px; margin-bottom: 32px; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-p {
          background: #C0392B; color: #fff; padding: 15px 36px;
          border-radius: 6px; text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;
          transition: background 0.15s;
        }
        .cta-p:hover { background: #a93226; }
        .cta-o {
          background: transparent; color: rgba(255,255,255,0.75);
          padding: 15px 36px; border-radius: 6px; text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;
          border: 1.5px solid rgba(255,255,255,0.2); transition: all 0.15s;
        }
        .cta-o:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

        @media (max-width: 640px) {
          .hero { padding: 44px 5vw 40px; }
          .dept-hdr { padding: 14px 16px; }
          .courses-wrap { padding: 12px 12px 16px; }
          .cta { padding: 52px 5vw; }
          .main { padding: 24px 5vw 60px; }
        }
      `}</style>

      {/* HERO */}
      <div className="W hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="badge"><Zap size={10} /> May 2026 Intake Open</div>
          <h1 className="hero-title">
            Explore
            <em>Our Courses</em>
          </h1>
          <p className="hero-sub">{TOTAL}+ industry-relevant programs across 11 departments. Find your perfect course.</p>
          <div className="stats">
            {[{ n: `${TOTAL}+`, l: "Programs" }, { n: "11", l: "Departments" }, { n: "4", l: "Exam Bodies" }, { n: "2026", l: "Current Intake" }].map(s => (
              <div key={s.l}>
                <span className="stat-n">{s.n}</span>
                <span className="stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="W filters">
        <div className="f-grid" style={{ gridTemplateColumns: sm ? "1fr" : md ? "1fr 1fr" : "1fr 180px 180px" }}>
          <div className="f-search" style={{ gridColumn: sm || !md ? "1" : "1 / -1" }}>
            <Search size={16} />
            <input className="f-input" type="text" placeholder="Search courses or departments…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="f-sel" value={level} onChange={e => setLevel(e.target.value)}>
            {LEVELS.map(l => <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>)}
          </select>
          <select className="f-sel" value={examBody} onChange={e => setExamBody(e.target.value)}>
            {EXAM_BODIES.map(b => <option key={b} value={b}>{b === "All" ? "All Exam Bodies" : b}</option>)}
          </select>
        </div>
        {hasFilters && (
          <div className="chips">
            {level !== "All" && <span className="chip">{level}<button onClick={() => setLevel("All")}>×</button></span>}
            {examBody !== "All" && <span className="chip">{examBody}<button onClick={() => setExamBody("All")}>×</button></span>}
            {search && <span className="chip chip-r">"{search}"<button onClick={() => setSearch("")}>×</button></span>}
            <button className="chip-clear" onClick={clearAll}>Clear all</button>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div className="W main">
        <p className="res-line">Showing <strong>{totalShowing}</strong> courses in <strong>{filtered.length}</strong> departments</p>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-ico">🔍</div>
            <h3 className="empty-t">No courses found</h3>
            <p className="empty-s">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(dept => {
              const isOpen = openDept === dept.id;
              return (
                <div key={dept.id} className="dept">
                  <div className={`dept-hdr${isOpen ? " open" : ""}`} onClick={() => setOpenDept(isOpen ? null : dept.id)}>
                    <div className="dept-left">
                      <div className="dept-ico">{dept.icon}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="dept-name">{dept.department}</div>
                        <div className="dept-sub">{dept.rows.length} program{dept.rows.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div className="dept-right">
                      {!sm && <span className="dept-badge">{dept.rows.length} Programs</span>}
                      {isOpen ? <ChevronUp size={20} color="#0274BE" /> : <ChevronDown size={20} color="#9ca3af" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="courses-wrap">
                      {!sm ? (
                        <table className="ct">
                          <thead>
                            <tr>
                              <th>Course Name</th>
                              <th>Duration</th>
                              <th>Entry Grade</th>
                              <th>Exam Body</th>
                              <th>Intake</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {dept.rows.map((c, i) => {
                              const lm = LEVEL_META[c.level] || LEVEL_META["Diploma"];
                              return (
                                <tr key={i}>
                                  <td>
                                    <div className="cn">{c.name}</div>
                                    <span className="pill" style={{ background: lm.bg, color: lm.color }}>{c.level}</span>
                                  </td>
                                  <td><span className="td-r"><Clock size={13} color="#0274BE" />{c.duration}</span></td>
                                  <td><span className="td-r"><GraduationCap size={13} color="#0274BE" />{c.entry}</span></td>
                                  <td><span className="td-r"><Award size={13} color="#0274BE" /><strong style={{ color: "#0D1B2A" }}>{c.examBody}</strong></span></td>
                                  <td><span className="td-r"><BookOpen size={13} color="#0274BE" />{c.intake}</span></td>
                                  <td><a href="#" className="apply">Apply →</a></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                          {dept.rows.map((c, i) => {
                            const lm = LEVEL_META[c.level] || LEVEL_META["Diploma"];
                            return (
                              <div key={i} className="mc">
                                <div className="mc-name">{c.name}</div>
                                <span className="pill" style={{ background: lm.bg, color: lm.color }}>{c.level}</span>
                                <div className="mc-grid">
                                  <div className="mc-meta"><Clock size={12} color="#0274BE" />{c.duration}</div>
                                  <div className="mc-meta"><Award size={12} color="#0274BE" />{c.examBody}</div>
                                  <div className="mc-meta"><GraduationCap size={12} color="#0274BE" />{c.entry}</div>
                                  <div className="mc-meta"><BookOpen size={12} color="#0274BE" />{c.intake}</div>
                                </div>
                                <a href="#" className="apply apply-full">Apply Now →</a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="W cta">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2 className="cta-t">Ready to <span>Apply?</span></h2>
          <p className="cta-s">May 2026 intake is open. Secure your spot today.</p>
          <div className="cta-btns">
            <a href="#" className="cta-p">Apply Now →</a>
            <a href="#" className="cta-o">Download Prospectus</a>
          </div>
        </div>
      </div>
    </>
  );
}