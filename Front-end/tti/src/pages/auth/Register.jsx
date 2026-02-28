import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, saveTokens } from "../../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const DARK  = "#0D1B2A";

const STEPS  = ["Personal Info", "Academic Info", "Password"];
const GENDERS = [{ v: "M", l: "Male" }, { v: "F", l: "Female" }];
const YEARS   = [1, 2, 3, 4];

export default function Register() {
  const navigate              = useNavigate();
  const [step, setStep]       = useState(1);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [form, setForm] = useState({
    admission_number: "", full_name: "", email: "",
    phone_number: "", date_of_birth: "", gender: "",
    national_id: "", address: "",
    next_of_kin_name: "", next_of_kin_phone: "",
    profile_photo: null,
    course: "", department: "",
    year_of_study: "", admission_year: "",
    password: "", password2: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (form.password !== form.password2) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== "") data.append(k, v); });
      await authAPI.register(data);
      const login = await authAPI.login({ admission_number: form.admission_number, password: form.password });
      saveTokens(login.data.access, login.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      const d   = err.response?.data;
      const msg = d ? Object.values(d).flat()[0] : "Registration failed. Please try again.";
      setError(msg); setStep(1);
    } finally { setLoading(false); }
  };

  const passMismatch = form.password && form.password2 && form.password !== form.password2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; margin: 0; padding: 0; }

        .reg-page {
          min-height: 100vh;
          width: 100vw;
          background: #f0f4f8;
          font-family: 'Barlow', sans-serif;
          padding: 60px;
          box-sizing: border-box;
        }

        .reg-box {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.10);
          width: 100%;
          max-width: 680px;
          padding: 56px 64px 48px;
          margin: 120px 60px 60px 60px;
        }

        .f-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #dde3ec;
          border-radius: 5px;
          font-size: 13.5px;
          font-family: 'Barlow', sans-serif;
          color: #1a202c;
          background: #fff;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .f-input:focus {
          border-color: ${P};
          box-shadow: 0 0 0 3px rgba(2,116,190,.1);
        }
        .f-input::placeholder { color: #b0bec5; }

        .lbl {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .btn-primary {
          background: ${P}; color: #fff; border: none;
          border-radius: 5px; padding: 12px 24px;
          font-size: 13.5px; font-weight: 700;
          font-family: 'Barlow', sans-serif;
          cursor: pointer; letter-spacing: 0.8px;
          text-transform: uppercase; transition: background .2s;
        }
        .btn-primary:hover:not(:disabled) { background: ${PDARK}; }
        .btn-primary:disabled { opacity: .65; cursor: not-allowed; }

        .btn-outline {
          background: #fff; color: ${P};
          border: 1.5px solid ${P}; border-radius: 5px;
          padding: 12px 24px; font-size: 13.5px; font-weight: 700;
          font-family: 'Barlow', sans-serif; cursor: pointer;
          letter-spacing: 0.8px; text-transform: uppercase;
          transition: all .2s;
        }
        .btn-outline:hover { background: #f0f7ff; }

        .lnk { color: ${P}; font-weight: 700; text-decoration: none; }
        .lnk:hover { text-decoration: underline; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 520px) { .two-col { grid-template-columns: 1fr; } }
      `}</style>

      <div className="reg-page">
        <div className="reg-box">

          {/* ── Logo + Name ── */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, background: P, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, color: "#fff", fontSize: 17,
              margin: "0 auto 14px",
              boxShadow: "0 6px 24px rgba(2,116,190,0.28)",
            }}>TTI</div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: DARK, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Thika Technical Training Institute
            </p>
            <p style={{ fontSize: 11.5, color: "#94a3b8", letterSpacing: 2, marginTop: 4 }}>STUDENT PORTAL</p>
          </div>

          {/* ── Step indicator ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 32 }}>
            {STEPS.map((label, i) => {
              const n      = i + 1;
              const done   = step > n;
              const active = step === n;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: done || active ? P : "#e2e8f0",
                    color: done || active ? "#fff" : "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                  }}>{done ? "✓" : n}</div>
                  <span style={{ fontSize: 12, color: active ? P : "#94a3b8", fontWeight: active ? 700 : 400 }}>{label}</span>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 28, height: 2, background: step > n ? P : "#e2e8f0", borderRadius: 99, marginLeft: 2 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Progress bar ── */}
          <div style={{ height: 3, background: "#e2e8f0", borderRadius: 99, marginBottom: 32, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: P, borderRadius: 99,
              width: `${(step / STEPS.length) * 100}%`,
              transition: "width 0.4s ease",
            }} />
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
              padding: "11px 14px", borderRadius: 5, fontSize: 13,
              marginBottom: 22, display: "flex", gap: 8, alignItems: "flex-start",
            }}>⚠ {error}</div>
          )}

          {/* ══ STEP 1: Personal Info ══ */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="two-col">
                <div>
                  <label className="lbl">Full Name</label>
                  <input className="f-input" type="text" placeholder="John Mwangi" value={form.full_name} onChange={e => set("full_name", e.target.value)} required />
                </div>
                <div>
                  <label className="lbl">Admission Number</label>
                  <input className="f-input" type="text" placeholder="TTI/2023/001" value={form.admission_number} onChange={e => set("admission_number", e.target.value)} required />
                </div>
              </div>

              <div className="two-col">
                <div>
                  <label className="lbl">Email</label>
                  <input className="f-input" type="email" placeholder="john@email.com" value={form.email} onChange={e => set("email", e.target.value)} required />
                </div>
                <div>
                  <label className="lbl">Phone Number</label>
                  <input className="f-input" type="tel" placeholder="0712 345 678" value={form.phone_number} onChange={e => set("phone_number", e.target.value)} required />
                </div>
              </div>

              <div className="two-col">
                <div>
                  <label className="lbl">Date of Birth</label>
                  <input className="f-input" type="date" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} required />
                </div>
                <div>
                  <label className="lbl">Gender</label>
                  <select className="f-input" value={form.gender} onChange={e => set("gender", e.target.value)} required>
                    <option value="">Select</option>
                    {GENDERS.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
                  </select>
                </div>
              </div>

              <div className="two-col">
                <div>
                  <label className="lbl">National ID / Passport</label>
                  <input className="f-input" type="text" placeholder="12345678" value={form.national_id} onChange={e => set("national_id", e.target.value)} required />
                </div>
                <div>
                  <label className="lbl">Address</label>
                  <input className="f-input" type="text" placeholder="P.O Box 123, Thika" value={form.address} onChange={e => set("address", e.target.value)} />
                </div>
              </div>

              <div className="two-col">
                <div>
                  <label className="lbl">Next of Kin Name</label>
                  <input className="f-input" type="text" placeholder="Jane Doe" value={form.next_of_kin_name} onChange={e => set("next_of_kin_name", e.target.value)} required />
                </div>
                <div>
                  <label className="lbl">Next of Kin Phone</label>
                  <input className="f-input" type="tel" placeholder="0712 345 678" value={form.next_of_kin_phone} onChange={e => set("next_of_kin_phone", e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="lbl">Profile Photo <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input className="f-input" type="file" accept="image/*" onChange={e => set("profile_photo", e.target.files[0])} style={{ padding: "9px 14px", cursor: "pointer" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                <button className="btn-primary" type="button" onClick={() => setStep(2)}>Next →</button>
              </div>
            </div>
          )}

          {/* ══ STEP 2: Academic Info ══ */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label className="lbl">Course / Program</label>
                <input className="f-input" type="text" placeholder="e.g. Electrical Engineering" value={form.course} onChange={e => set("course", e.target.value)} required />
              </div>
              <div>
                <label className="lbl">Department</label>
                <input className="f-input" type="text" placeholder="e.g. Electrical & Electronics" value={form.department} onChange={e => set("department", e.target.value)} required />
              </div>
              <div className="two-col">
                <div>
                  <label className="lbl">Year of Study</label>
                  <select className="f-input" value={form.year_of_study} onChange={e => set("year_of_study", e.target.value)} required>
                    <option value="">Select</option>
                    {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">Admission Year</label>
                  <input className="f-input" type="number" placeholder="2023" min="2000" max="2099" value={form.admission_year} onChange={e => set("admission_year", e.target.value)} required />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 6 }}>
                <button className="btn-outline" type="button" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" type="button" onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {/* ══ STEP 3: Password ══ */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label className="lbl">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="f-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    required
                    style={{ paddingRight: 50 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 17, padding: 0 }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div>
                <label className="lbl">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="f-input"
                    type={showPass2 ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.password2}
                    onChange={e => set("password2", e.target.value)}
                    required
                    style={{ paddingRight: 50, borderColor: passMismatch ? "#ef4444" : undefined }}
                  />
                  <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 17, padding: 0 }}>
                    {showPass2 ? "🙈" : "👁"}
                  </button>
                </div>
                {passMismatch && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}>⚠ Passwords do not match</p>}
                {form.password && form.password2 && !passMismatch && <p style={{ color: "#22c55e", fontSize: 12, marginTop: 5 }}>✓ Passwords match</p>}
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 6 }}>
                <button className="btn-outline" type="button" onClick={() => setStep(2)}>← Back</button>
                <button
                  className="btn-primary"
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !form.password || !!passMismatch}
                >
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </div>
            </div>
          )}

          {/* ── Sign in link ── */}
          <p style={{ textAlign: "center", fontSize: 13.5, color: "#64748b", marginTop: 28 }}>
            Already have an account?{" "}
            <Link to="/login" className="lnk">Sign in here</Link>
          </p>

        </div>
      </div>
    </>
  );
}