
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const DEMO_USER = {
  email: "uzair@example.com",
  password: "Uzair123",
};

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  if (sessionStorage.getItem("adminAuthenticated") === "true") {
    return <Navigate to="/adminpanel" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    if (
      email.trim().toLowerCase() === DEMO_USER.email &&
      password === DEMO_USER.password
    ) {
      sessionStorage.setItem("adminAuthenticated", "true");

      const destination = location.state?.from?.pathname;
      navigate(
        destination?.startsWith("/adminpanel")
          ? destination
          : "/adminpanel",
        { replace: true }
      );
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark">U.</span>
          <span>UZAIR / PORTFOLIO</span>
        </div>

        <div className="admin-login-heading">
          <p className="admin-eyebrow">RESTRICTED ACCESS</p>
          <h1>Welcome<br />back<span>.</span></h1>
          <p>Sign in to manage your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">EMAIL ADDRESS</label>
            <input
              id="admin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">PASSWORD</label>
            <div className="admin-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-submit">
            Sign In <span>↗</span>
          </button>
        </form>

        <div className="admin-login-footer">
          <span>ADMIN PORTAL</span>
          <span>© 2026 UZAIR</span>
        </div>
      </section>

      <aside className="admin-login-visual">
        <div className="admin-visual-overlay" />
        <div className="admin-visual-top">
          <span>DESIGN. DEVELOP. CREATE.</span>
          <span>01 — 01</span>
        </div>
        <div className="admin-visual-content">
          <p>BEHIND THE WORK</p>
          <h2>Build something<br />that matters<span>.</span></h2>
          <div className="admin-visual-line" />
          <p className="admin-visual-caption">
            Your creative space. Your projects. Your journey.
          </p>
        </div>
        <span className="admin-visual-index">U / 2026</span>
      </aside>
    </main>
  );
}
