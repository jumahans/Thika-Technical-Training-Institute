import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, saveTokens } from "../../api/api";
import logo from "../../assets/logo.png";

const P     = "#0274BE";
const PDARK = "#015fa0";
const DARK  = "#0D1B2A";

export default function Login() {
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ admission_number: "", password: "", remember: false });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login({
        admission_number: form.admission_number,
        password: form.password,
      });
      saveTokens(res.data.access, res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          width: 100vw;
          background: #f0f4f8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
        }

        .login-box {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.10);
          width: 100%;
          max-width: 460px;
          padding: 48px 44px 36px;
        }

        .f-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #dde3ec;
          border-radius: 5px;
          font-size: 14px;
          font-family: 'Barlow', sans-serif;
          color: #1a202c;
          background: #fff;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .f-input:focus {
          border-color: ${P};
          box-shadow: 0 0 0 3px rgba(2,116,190,.12);
        }
        .f-input::placeholder { color: #b0bec5; }

        .btn-login {
          width: 100%;
          padding: 14px;
          background: ${P};
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Barlow', sans-serif;
          cursor: pointer;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: background .2s;
          margin-top: 8px;
        }
        .btn-login:hover:not(:disabled) { background: ${PDARK}; }
        .btn-login:disabled { opacity: .65; cursor: not-allowed; }

        .lnk { color: ${P}; font-weight: 700; text-decoration: none; }
        .lnk:hover { text-decoration: underline; }

        .lbl {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
      `}</style>

      <div className="login-page">
        <div className="login-box">

          {/* ── Logo + Institution Name ── */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 68, height: 68,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, color: "#fff", fontSize: 18,
              margin: "0 auto 14px",
              boxShadow: "0 6px 24px rgba(2,116,190,0.28)",
            }}>
              <img src={logo} alt="TTI Logo" style={{
                width: "68px",
              }} />
            </div>

            <p style={{
              fontSize: 14, fontWeight: 700, color: DARK,
              letterSpacing: 1.5, textTransform: "uppercase",
              fontFamily: "'Barlow', sans-serif",
            }}>
              Thika Technical Training Institute
            </p>
            <p style={{ fontSize: 11.5, color: "#94a3b8", letterSpacing: 2, marginTop: 4 }}>
              STUDENT PORTAL
            </p>
          </div>

          {/* ── Heading ── */}
          <h2 style={{ fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
            Sign In
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", marginBottom: 28 }}>
            Enter your credentials to access your portal
          </p>

          {/* ── Error ── */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", padding: "11px 14px", borderRadius: 5,
              fontSize: 13, marginBottom: 20,
              display: "flex", gap: 8, alignItems: "center",
            }}>⚠ {error}</div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div>
              <label className="lbl">Admission Number</label>
              <input
                className="f-input"
                type="text"
                placeholder="e.g. TTI/2023/001"
                value={form.admission_number}
                onChange={e => setForm({ ...form, admission_number: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="lbl">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="f-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: 50 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#94a3b8",
                    fontSize: 17, padding: 0, lineHeight: 1,
                  }}
                >{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm({ ...form, remember: e.target.checked })}
                  style={{ accentColor: P, width: 15, height: 15 }}
                />
                <span style={{ fontSize: 13.5, color: "#475569" }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="lnk" style={{ fontSize: 13.5 }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          {/* ── Register link ── */}
          <p style={{ textAlign: "center", fontSize: 13.5, color: "#64748b", marginTop: 24 }}>
            Don't have an account?{" "}
            <Link to="/register" className="lnk">Register here</Link>
          </p>

        </div>
      </div>
    </>
  );
}