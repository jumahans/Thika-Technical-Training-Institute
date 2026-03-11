import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

function PasswordField({ label, name, value, onChange, showPw, onToggle, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: GREY4,
        letterSpacing: 1, textTransform: "uppercase",
      }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1px solid ${focused ? P : GREY3}`,
        borderRadius: 6, overflow: "hidden",
        background: WHITE,
        transition: "border 0.15s",
      }}>
        <input
          name={name}
          type={showPw ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: "10px 14px",
            border: "none", outline: "none",
            fontSize: 14, color: DARK,
            fontFamily: "inherit", background: "transparent",
          }}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            background: "none", border: "none",
            padding: "0 14px", cursor: "pointer",
            fontSize: 16, color: GREY4,
            display: "flex", alignItems: "center",
          }}
          tabIndex={-1}
        >{showPw ? "🙈" : "👁️"}</button>
      </div>
      {hint && (
        <p style={{ fontSize: 11.5, color: GREY4, margin: 0 }}>{hint}</p>
      )}
    </div>
  );
}

function StrengthBar({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8)              score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))    score++;

  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#dc2626", "#f97316", "#eab308", "#3b82f6", "#16a34a"];

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: i < score ? colors[score] : GREY3,
            transition: "background 0.2s",
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11.5, color: score > 0 ? colors[score] : GREY4, margin: 0, fontWeight: 600 }}>
        {score > 0 ? labels[score] : ""}
      </p>
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [show,    setShow]    = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!form.old_password || !form.new_password || !form.new_password2) {
      setError("All fields are required."); return;
    }
    if (form.new_password.length < 8) {
      setError("New password must be at least 8 characters."); return;
    }
    if (form.new_password !== form.new_password2) {
      setError("New passwords do not match."); return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        old_password:  form.old_password,
        new_password:  form.new_password,
        new_password2: form.new_password2,
      });
      setSuccess(true);
      setForm({ old_password: "", new_password: "", new_password2: "" });
      // Redirect to profile after 2.5s
      setTimeout(() => navigate("/profile"), 2500);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const first = Object.entries(data)[0];
        setError(`${first[1]}`);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>

      {/* ── HEADER STRIP ── */}
      <div style={{
        background: P, borderRadius: 8,
        padding: "22px 28px",
        marginBottom: 24,
      }}>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>
          Account Security
        </p>
        <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>
          Change Password 🔐
        </h1>
      </div>

      {/* ── SUCCESS STATE ── */}
      {success ? (
        <div style={{
          background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
          padding: "40px 32px", textAlign: "center",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>
            Password Changed!
          </h2>
          <p style={{ fontSize: 13.5, color: GREY4, margin: "0 0 24px", lineHeight: 1.6 }}>
            Your password has been updated successfully.<br />
            Redirecting you to your profile…
          </p>
          <Link to="/profile" style={{
            display: "inline-block",
            background: P, color: WHITE,
            fontWeight: 700, fontSize: 13.5,
            padding: "10px 28px", borderRadius: 6,
            textDecoration: "none",
          }}>Go to Profile</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>

          {/* ── FORM CARD ── */}
          <div style={{
            background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
            padding: "28px 28px", marginBottom: 16,
          }}>
            <h3 style={{
              fontSize: 14, fontWeight: 700, color: DARK,
              margin: "0 0 20px", paddingBottom: 14,
              borderBottom: `1px solid ${GREY3}`,
            }}>
              Update your password
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              <PasswordField
                label="Current Password"
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                showPw={show.old}
                onToggle={() => setShow(p => ({ ...p, old: !p.old }))}
                hint="Enter your current password to verify it's you."
              />

              <div style={{ height: 1, background: GREY3 }} />

              <div>
                <PasswordField
                  label="New Password"
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  showPw={show.new}
                  onToggle={() => setShow(p => ({ ...p, new: !p.new }))}
                  hint="Minimum 8 characters."
                />
                <StrengthBar password={form.new_password} />
              </div>

              <PasswordField
                label="Confirm New Password"
                name="new_password2"
                value={form.new_password2}
                onChange={handleChange}
                showPw={show.confirm}
                onToggle={() => setShow(p => ({ ...p, confirm: !p.confirm }))}
                hint={
                  form.new_password2 && form.new_password !== form.new_password2
                    ? "⚠️ Passwords do not match."
                    : form.new_password2 && form.new_password === form.new_password2
                    ? "✅ Passwords match."
                    : "Re-enter your new password."
                }
              />
            </div>
          </div>

          {/* ── PASSWORD TIPS ── */}
          <div style={{
            background: `${P}08`, border: `1px solid ${P}25`,
            borderRadius: 8, padding: "14px 18px", marginBottom: 16,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: P, margin: "0 0 8px", letterSpacing: 0.5 }}>
              🛡️ Password tips
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Use at least 8 characters",
                "Include uppercase and lowercase letters",
                "Add numbers and special characters (e.g. @, #, !)",
                "Avoid common words or your admission number",
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 12.5, color: GREY4, lineHeight: 1.5 }}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 6, padding: "12px 18px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* ── ACTIONS ── */}
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/profile" style={{
              flex: 1, display: "block", textAlign: "center",
              padding: "11px", background: GREY2,
              borderRadius: 6, color: DARK,
              fontWeight: 600, fontSize: 13.5,
              textDecoration: "none",
              border: `1px solid ${GREY3}`,
            }}
              onMouseEnter={e => e.currentTarget.style.background = GREY3}
              onMouseLeave={e => e.currentTarget.style.background = GREY2}
            >Cancel</Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2, padding: "11px",
                background: loading ? GREY4 : P,
                border: "none", borderRadius: 6,
                color: WHITE, fontWeight: 700,
                fontSize: 13.5, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = PDARK; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = P; }}
            >
              {loading ? "Changing…" : "🔐 Change Password"}
            </button>
          </div>

        </form>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}