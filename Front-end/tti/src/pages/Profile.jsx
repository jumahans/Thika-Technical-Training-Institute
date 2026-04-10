import { useState, useEffect, useRef } from "react";
import { authAPI } from "../api/api";

const P     = "#0274BE";
const PDARK = "#015fa0";
const WHITE = "#ffffff";
const GREY1 = "#f8fafc";
const GREY2 = "#f1f5f9";
const GREY3 = "#e2e8f0";
const GREY4 = "#94a3b8";
const DARK  = "#1e293b";

const responsiveStyles = `
  @media (max-width: 640px) {
    .pf-header { padding: 16px 16px !important; }
    .pf-header h1 { font-size: 17px !important; }
    .pf-header-actions { width: 100%; display: flex; gap: 8px; }
    .pf-header-actions button { flex: 1; justify-content: center !important; }
    .pf-avatar-card { padding: 18px 16px !important; flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
    .pf-academic-chips { width: 100% !important; }
    .pf-section { padding: 18px 16px !important; }
    .pf-section-grid { grid-template-columns: 1fr !important; }
    .pf-field input, .pf-field div, .pf-field textarea { font-size: 13px !important; }
  }
  @media (max-width: 400px) {
    .pf-name-block h2 { font-size: 17px !important; }
  }
`;

function Field({ label, value, name, type = "text", editing, onChange, readOnly = false }) {
  return (
    <div className="pf-field" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: GREY4,
        letterSpacing: 1, textTransform: "uppercase",
      }}>{label}</label>
      {editing && !readOnly ? (
        <input
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          style={{
            padding: "9px 12px",
            border: `1px solid ${GREY3}`,
            borderRadius: 6,
            fontSize: 13.5,
            color: DARK,
            outline: "none",
            fontFamily: "inherit",
            background: WHITE,
            transition: "border 0.15s",
            width: "100%",
            boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.border = `1px solid ${P}`}
          onBlur={e => e.target.style.border = `1px solid ${GREY3}`}
        />
      ) : (
        <div style={{
          padding: "9px 12px",
          background: GREY1,
          border: `1px solid ${GREY3}`,
          borderRadius: 6,
          fontSize: 13.5,
          color: value ? DARK : GREY4,
          minHeight: 38,
          wordBreak: "break-word",
        }}>
          {value || "—"}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const [profile,  setProfile]  = useState(null);
  const [form,     setForm]     = useState({});
  const [editing,  setEditing]  = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile,    setPhotoFile]    = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = responsiveStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await authAPI.getProfile();
        setProfile(res.data);
        setForm(res.data);
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const data = new FormData();
      const editable = [
        "full_name", "email", "phone_number", "date_of_birth",
        "gender", "address", "next_of_kin_name", "next_of_kin_phone",
      ];
      editable.forEach(k => { if (form[k] !== undefined) data.append(k, form[k] || ""); });
      if (photoFile) data.append("profile_photo", photoFile);
      const res = await authAPI.updateProfile(data);
      setProfile(res.data);
      setForm(res.data);
      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg = err.response?.data;
      if (msg && typeof msg === "object") {
        const first = Object.entries(msg)[0];
        setError(`${first[0]}: ${first[1]}`);
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError(null);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <p style={{ color: GREY4, fontSize: 14 }}>Loading profile…</p>
      </div>
    </div>
  );

  if (error && !profile) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", color: "#dc2626" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14 }}>{error}</p>
      </div>
    </div>
  );

  const avatarSrc = photoPreview || profile?.profile_photo;
  const initials  = (profile?.full_name || "S").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ width: "100%", maxWidth: 860, margin: "0 auto" }}>

      {/* ── HEADER STRIP ── */}
      <div className="pf-header" style={{
        background: P, borderRadius: 8,
        padding: "22px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 4 }}>
            Account Settings
          </p>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: 0 }}>
            My Profile 👤
          </h1>
        </div>
        {!editing ? (
          <div className="pf-header-actions">
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
                color: WHITE, fontWeight: 700, fontSize: 13.5,
                padding: "9px 20px", borderRadius: 6, cursor: "pointer",
                fontFamily: "inherit", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >✏️ Edit Profile</button>
          </div>
        ) : (
          <div className="pf-header-actions" style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleCancel}
              style={{
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                color: WHITE, fontWeight: 600, fontSize: 13,
                padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
              }}
            >Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: WHITE, border: "none",
                color: P, fontWeight: 700, fontSize: 13,
                padding: "8px 22px", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "inherit", opacity: saving ? 0.7 : 1,
              }}
            >{saving ? "Saving…" : "💾 Save Changes"}</button>
          </div>
        )}
      </div>

      {/* ── FEEDBACK BANNERS ── */}
      {success && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6,
          padding: "12px 18px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>
            Profile updated successfully.
          </span>
        </div>
      )}
      {error && profile && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6,
          padding: "12px 18px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* ── AVATAR CARD ── */}
      <div className="pf-avatar-card" style={{
        background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8,
        padding: "24px 28px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
      }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: P, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `3px solid ${GREY3}`,
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: WHITE, fontWeight: 800, fontSize: 28 }}>{initials}</span>
            )}
          </div>
          {editing && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: "50%",
                  background: P, border: `2px solid ${WHITE}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 13,
                }}
                title="Change photo"
              >📷</button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </>
          )}
        </div>

        {/* Name block */}
        <div className="pf-name-block" style={{ flex: 1, minWidth: 180 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 4px", wordBreak: "break-word" }}>
            {profile?.full_name || "—"}
          </h2>
          <p style={{ fontSize: 13, color: GREY4, margin: "0 0 8px" }}>
            {profile?.admission_number || "—"} · {profile?.course || "—"}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              profile?.department,
              `Year ${profile?.year_of_study || "—"}`,
              profile?.gender === "M" ? "Male" : profile?.gender === "F" ? "Female" : null,
            ].filter(Boolean).map((tag, i) => (
              <span key={i} style={{
                background: `${P}12`, color: P,
                fontSize: 11.5, fontWeight: 700,
                padding: "3px 10px", borderRadius: 99,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Read-only chips */}
        <div className="pf-academic-chips" style={{
          background: GREY1, borderRadius: 6, padding: "12px 16px",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <p style={{ fontSize: 10.5, color: GREY4, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>Academic Info</p>
          <p style={{ fontSize: 13, color: DARK, fontWeight: 600, margin: 0 }}>
            Admission Year: {profile?.admission_year || "—"}
          </p>
          <p style={{ fontSize: 13, color: DARK, fontWeight: 600, margin: 0 }}>
            National ID: {profile?.national_id || "—"}
          </p>
        </div>
      </div>

      {/* ── PERSONAL DETAILS ── */}
      <div className="pf-section" style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: "0 0 18px", paddingBottom: 12, borderBottom: `1px solid ${GREY3}` }}>
          Personal Details
        </h3>
        <div className="pf-section-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Field label="Full Name"     name="full_name"     value={form.full_name}     editing={editing} onChange={handleChange} />
          <Field label="Email"         name="email"         value={form.email}         editing={editing} onChange={handleChange} type="email" />
          <Field label="Phone Number"  name="phone_number"  value={form.phone_number}  editing={editing} onChange={handleChange} type="tel" />
          <Field label="Date of Birth" name="date_of_birth" value={form.date_of_birth} editing={editing} onChange={handleChange} type="date" />
          <Field
            label="Gender" name="gender" value={
              form.gender === "M" ? "Male" : form.gender === "F" ? "Female" : form.gender
            }
            editing={false}
          />
          <Field label="National ID"  name="national_id"  value={form.national_id}  editing={false} readOnly />
        </div>

        {/* Address — full width */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: GREY4, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>
            Address
          </label>
          {editing ? (
            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              rows={2}
              style={{
                width: "100%", padding: "9px 12px",
                border: `1px solid ${GREY3}`, borderRadius: 6,
                fontSize: 13.5, color: DARK, outline: "none",
                fontFamily: "inherit", resize: "vertical",
                background: WHITE, boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.border = `1px solid ${P}`}
              onBlur={e => e.target.style.border = `1px solid ${GREY3}`}
            />
          ) : (
            <div style={{
              padding: "9px 12px", background: GREY1, border: `1px solid ${GREY3}`,
              borderRadius: 6, fontSize: 13.5, color: form.address ? DARK : GREY4, minHeight: 38,
              wordBreak: "break-word",
            }}>{form.address || "—"}</div>
          )}
        </div>
      </div>

      {/* ── NEXT OF KIN ── */}
      <div className="pf-section" style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: "0 0 18px", paddingBottom: 12, borderBottom: `1px solid ${GREY3}` }}>
          Next of Kin
        </h3>
        <div className="pf-section-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Field label="Name"         name="next_of_kin_name"  value={form.next_of_kin_name}  editing={editing} onChange={handleChange} />
          <Field label="Phone Number" name="next_of_kin_phone" value={form.next_of_kin_phone} editing={editing} onChange={handleChange} type="tel" />
        </div>
      </div>

      {/* ── ACADEMIC INFO (read-only) ── */}
      <div className="pf-section" style={{ background: WHITE, border: `1px solid ${GREY3}`, borderRadius: 8, padding: "22px 24px", marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: "0 0 18px", paddingBottom: 12, borderBottom: `1px solid ${GREY3}` }}>
          Academic Information <span style={{ fontSize: 11, color: GREY4, fontWeight: 500 }}>(read-only)</span>
        </h3>
        <div className="pf-section-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Field label="Admission Number" name="admission_number" value={form.admission_number} editing={false} />
          <Field label="Course"           name="course"           value={form.course}           editing={false} />
          <Field label="Department"       name="department"       value={form.department}       editing={false} />
          <Field label="Year of Study"    name="year_of_study"    value={`Year ${form.year_of_study || "—"}`} editing={false} />
          <Field label="Admission Year"   name="admission_year"   value={form.admission_year?.toString()} editing={false} />
          <Field label="Member Since"     name="created_at"       value={form.created_at ? new Date(form.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" }) : "—"} editing={false} />
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}