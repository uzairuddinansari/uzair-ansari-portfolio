import { useState } from "react";
import "./Navbar.css";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a className="nav-logo" href="#home" onClick={closeMenu}>
       
      </a>

      <button
        className="nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "CLOSE −" : "MENU +"}
      </button>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}

        <a
          className="nav-resume"
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Resume ↗
        </a>
      </nav>
    </header>
  );
}
