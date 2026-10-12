import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSite from "../hooks/useSite";
import useLenis from "../hooks/useLenis";
import Navbar from "../components/Nav";
import "../styles/Skills.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Technology SVG Icons ── */
const SKILL_ICONS = {
  html: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <path d="M4 3l2.5 28L16 32l9.5-1L28 3z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 6v23l7-2 2-21H9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10h12l-.5 5H13l.5 5h7.5l-.5 5-4.5 1.5L11.5 25l-.3-3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  css: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <path d="M4 3l2.5 28L16 32l9.5-1L28 3z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22 10H10l.5 5h10l-.7 8L16 25l-3.8-2-.3-3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <rect x="3" y="3" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M17 10v12c0 2.5-1.5 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M21 16c1-2 3-2.5 4.5-1.5s1 3-1 4.5c-1.5 1-3 2-3 3.5s1 2 2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <circle cx="16" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 16 16)" />
    </svg>
  ),
  gsap: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <rect x="3" y="6" width="26" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 20V12l4 8 4-8v8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="23" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M23 13v3h3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  bootstrap: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <rect x="3" y="3" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 9h5.5c2.2 0 3.5 1.5 3.5 3.3 0 1.5-.8 2.5-2 3 1.5.5 2.5 1.8 2.5 3.5 0 2.2-1.7 3.7-4 3.7H12z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14.5 14.5h3c.8 0 1.5-.5 1.5-1.3s-.7-1.2-1.5-1.2h-3zM14.5 20h3.5c1 0 1.7-.6 1.7-1.5s-.7-1.5-1.7-1.5h-3.5z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="24" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 10.5V21.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 8h8c2 0 3 1 3 3v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 32 32" className="skill-svg">
      <path d="M16 3C8.8 3 3 8.8 3 16c0 5.7 3.7 10.6 8.8 12.3.65.1.9-.3.9-.6v-2.2c-3.6.8-4.4-1.7-4.4-1.7-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.1 2 3 1.4 3.7 1.1.1-.8.45-1.4.8-1.7-2.9-.3-5.9-1.4-5.9-6.4 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.6.1-3.4 0 0 1.1-.4 3.6 1.3a12.3 12.3 0 0 1 6.5 0c2.5-1.6 3.5-1.3 3.5-1.3.7 1.8.3 3.1.1 3.4.8.9 1.3 2.1 1.3 3.5 0 5-3 5.9-5.9 6.2.5.4.9 1.2.9 2.4v3.5c0 .3.2.7.9.6C25.3 26.6 29 21.7 29 16c0-7.2-5.8-13-13-13z" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};

// Fallback icon
const FallbackIcon = ({ name }) => (
  <svg viewBox="0 0 32 32" className="skill-svg">
    <rect x="4" y="4" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <text x="16" y="21" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="Space Grotesk, sans-serif" fontWeight="600">
      {(name || "?").charAt(0).toUpperCase()}
    </text>
  </svg>
);

export default function Skills() {
  const { skills } = useSite();
  const pageRef = useRef(null);

  useLenis();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Header reveal ── */
      const headTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      headTl
        .fromTo(".skills-kicker", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 })
        .fromTo(
          ".skills-heading .skills-word",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(".skills-intro-text", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4")
        .fromTo(".skills-intro-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, "-=0.3");

      /* ── Skills grid cards stagger ── */
      gsap.fromTo(
        ".skills-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* ── Learning section ── */
      gsap.fromTo(
        ".skills-learn > *",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-learn",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* ── CTA section ── */
      gsap.fromTo(
        ".skills-cta > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-cta",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <main className="skills-page" ref={pageRef}>

        {/* Ambient blobs */}
        <div className="skills-blob skills-blob--1" aria-hidden="true" />
        <div className="skills-blob skills-blob--2" aria-hidden="true" />

        {/* ── INTRO ── */}
        <section className="skills-intro">
          <p className="skills-kicker">MY TOOLKIT / SKILLS</p>

          <h1 className="skills-heading">
            <span className="skills-word-wrap"><span className="skills-word">Tools I use</span></span>{" "}
            <span className="skills-word-wrap"><span className="skills-word">to bring</span></span>
            <br />
            <span className="skills-word-wrap"><span className="skills-word skills-word--accent">ideas to life.</span></span>
          </h1>

          <p className="skills-intro-text">
            These are the technologies and tools I currently work with.
            I focus on writing clean, maintainable code and building
            interfaces that feel polished and responsive.
          </p>

          <div className="skills-intro-line" aria-hidden="true" />
        </section>

        {/* ── SKILLS GRID ── */}
        {Object.entries(categories).map(([category, list]) => (
          <section className="skills-category" key={category}>
            <p className="skills-cat-label">{category.toUpperCase()}</p>
            <div className="skills-grid">
              {list.map((skill) => (
                <article className="skills-card" key={skill.id}>
                  <div className="skills-card-icon">
                    {SKILL_ICONS[skill.icon] || <FallbackIcon name={skill.name} />}
                  </div>
                  <div className="skills-card-body">
                    <h3 className="skills-card-name">{skill.name}</h3>
                    <p className="skills-card-desc">{skill.description}</p>
                  </div>
                  <div className="skills-card-shine" aria-hidden="true" />
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* ── LEARNING ── */}
        <section className="skills-learn">
          <div className="skills-learn-num">
            <span>—</span>
          </div>
          <h2 className="skills-learn-heading">Always learning.</h2>
          <p className="skills-learn-copy">
            I don't claim expertise — I'm a developer who's constantly improving.
            Every project teaches me something new, and I believe consistent
            practice matters more than labels. My current focus is deepening
            my understanding of React, exploring backend technologies, and
            writing better code every day.
          </p>
        </section>

        {/* ── CTA ── */}
        <section className="skills-cta">
          <p className="skills-cta-text">Interested in working together?</p>
          <a href="/#contact" className="skills-cta-btn">
            Let's Talk
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </section>

      </main>
    </>
  );
}
