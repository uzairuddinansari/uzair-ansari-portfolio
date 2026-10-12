import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import useSite from "../hooks/useSite";
import useVisitorStats from "../hooks/useVisitorStats";
import "../styles/AdminPanel.css";

const links = [
  { to: "/adminpanel", label: "Overview", icon: "dashboard", end: true },
  { to: "/adminpanel/visitors", label: "Live Visitors", icon: "eye" },
  { to: "/adminpanel/projects", label: "Projects", icon: "briefcase" },
  { to: "/adminpanel/skills", label: "Skills", icon: "skills" },
  { to: "/adminpanel/reviews", label: "Reviews", icon: "star" },
  { to: "/adminpanel/messages", label: "Messages", icon: "mail" },
  { to: "/adminpanel/appearance", label: "Appearance", icon: "sliders" },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { reviews, messages } = useSite();
  const { visitors } = useVisitorStats();

  // Sidebar ke badges: kitne review approve hone baaki hain, kitne message unread hain
  const badges = {
    "/adminpanel/reviews": reviews.filter((r) => r.status === "pending").length,
    "/adminpanel/messages": messages.filter((m) => !m.read).length,
  };

  const pageTitle =
    links.find((l) => l.to === location.pathname)?.label || "Admin";

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="admin-layout">
      {menuOpen && <div className="adm-overlay" onClick={closeMenu} />}

      <aside className={`adm-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="adm-brand">
          <span className="adm-brand-mark">U.</span>
          <div>
            <strong>UZAIR</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="adm-nav">
          <p className="adm-nav-label">MANAGE</p>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "adm-link active" : "adm-link")}
            >
              <Icon name={link.icon} />
              {link.label}
              {badges[link.to] > 0 && (
                <span className="adm-badge">{badges[link.to]}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="adm-side-foot">
          <a className="adm-link" href="/" target="_blank" rel="noreferrer">
            <Icon name="external" />
            View website
          </a>
          <button className="adm-link" onClick={handleLogout}>
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            className="adm-menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>

          <h2>{pageTitle}</h2>

          <div className="adm-top-actions">
            <span className="adm-pill">
              <span className="adm-live-dot" />
              {visitors.length} online
            </span>
          </div>
        </header>

        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
