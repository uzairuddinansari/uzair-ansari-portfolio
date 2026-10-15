
import { useState } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Journey", href: "/journey" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-logo, .nav-toggle, .nav-links > a", {
        y: -15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar" ref={navRef}>
      <a className="nav-logo" href="#home" onClick={closeMenu}>
        UZAIR<span>.</span>
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
          <Link key={link.href} to={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
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
