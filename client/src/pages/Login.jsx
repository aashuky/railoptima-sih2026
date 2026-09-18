import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function Login({ onLogin }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!employeeId.trim()) {
      setNotice({ type: "error", message: "Please enter your Employee ID / Username." });
      return;
    }
    if (!password) {
      setNotice({ type: "error", message: "Please enter your password." });
      return;
    }

    if (onLogin) {
      onLogin({
        employeeId: employeeId.trim().toUpperCase(),
        name: employeeId.trim().toUpperCase() === "IR-CTRL-7402" ? "Shri R. K. Sharma" : "Railway Controller",
        role: "Maintenance Controller",
        division: "Division 1 (Northern Zone)",
        department: "Operating / Planning Branch",
        authenticatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e8eef6", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#0B3D91", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <img
          src={logo}
          alt="RailOptima Logo"
          style={{ height: "48px", objectFit: "contain", borderRadius: "4px" }}
        />
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.25)", paddingLeft: "16px" }}>
          <p style={{ color: "#a8c4e8", fontSize: "11px", margin: 0, letterSpacing: "0.03em" }}>Ministry of Railways · Government of India</p>
          <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, margin: "2px 0 0", letterSpacing: "0.02em" }}>
            AI-Powered Automatic Block Planning System
          </p>
        </div>
      </header>

      {/* Body */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #c8d8ea", borderTop: "4px solid #0B3D91", borderRadius: "4px", padding: "30px 28px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 24px rgba(11, 61, 145, 0.08)" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: 700, color: "#0B3D91", margin: 0 }}>Sign In</h2>
            <span style={{ fontSize: "10px", fontWeight: 700, backgroundColor: "#EBF3FE", color: "#0B3D91", padding: "2px 8px", borderRadius: "10px", border: "1px solid #c8d8ea" }}>
              SIH 2026
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 20px" }}>
            Authorized Railway Controllers & Planning Staff
          </p>

          {/* Alert Notice */}
          {notice && (
            <div style={{
              backgroundColor: notice.type === "error" ? "#FEF2F2" : "#F0FDF4",
              color: notice.type === "error" ? "#DC2626" : "#16A34A",
              border: `1px solid ${notice.type === "error" ? "#FCA5A5" : "#86EFAC"}`,
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "16px"
            }}>
              {notice.message}
            </div>
          )}

          <div
            role="form"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          >
            {/* Employee ID */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Employee ID / Username
              </label>
              <input
                type="text"
                name="rail_emp_id"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                style={{ width: "100%", boxSizing: "border-box", border: "1px solid #b0c4d8", borderRadius: "3px", padding: "9px 12px", fontSize: "13px", color: "#1E293B", outline: "none", transition: "border-color 0.2s" }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="rail_security_pin"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  style={{ width: "100%", boxSizing: "border-box", border: "1px solid #b0c4d8", borderRadius: "3px", padding: "9px 36px 9px 12px", fontSize: "13px", color: "#1E293B", outline: "none" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 0 }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "#0B3D91" }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setNotice({ type: "info", message: "Password reset requests are routed to the CRIS Divisional Administrator." })}
                style={{ background: "none", border: "none", padding: 0, fontSize: "12px", color: "#0B3D91", textDecoration: "underline", cursor: "pointer" }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "11px",
                backgroundColor: "#0B3D91",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.06em",
                transition: "background-color 0.2s",
                boxShadow: "0 2px 4px rgba(11,61,145,0.2)"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0B3D91")}
            >
              SIGN IN
            </button>
          </div>

          {/* Bottom links */}
          <div style={{ borderTop: "1px solid #e0eaf4", marginTop: "18px", paddingTop: "14px", display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={() => setNotice({ type: "info", message: "New officer registration must be provisioned through CRIS BDMS portal." })}
              style={{ background: "none", border: "none", padding: 0, fontSize: "12px", color: "#0B3D91", textDecoration: "underline", cursor: "pointer" }}
            >
              New Registration
            </button>
            <button
              type="button"
              onClick={() => setNotice({ type: "info", message: "CRIS single sign-on is provisioned automatically for Indian Railways IP networks." })}
              style={{ background: "none", border: "none", padding: 0, fontSize: "12px", color: "#0B3D91", textDecoration: "underline", cursor: "pointer" }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#071F4D", padding: "12px 24px", textAlign: "center", borderTop: "1px solid #0B3D91" }}>
        <p style={{ color: "#a8c4e8", fontSize: "11px", margin: 0 }}>
          © 2026 Ministry of Railways, Government of India. All Rights Reserved. · Centre for Railway Information Systems (CRIS)
        </p>
      </footer>
    </div>
  );
}
