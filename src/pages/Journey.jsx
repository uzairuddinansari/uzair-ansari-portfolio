import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Nav";
import useLenis from "../hooks/useLenis";
import useSite from "../hooks/useSite";
import "../styles/Journey.css";

gsap.registerPlugin(ScrollTrigger);

/* ─── Static chapter data ─── */
const CHAPTERS = [
  {
    id: "ch-01",
    num: "01",
    kicker: "01 — The Beginning",
    title: "The First Line of Code",
    desc: "It started with curiosity — right-clicking a beautiful website and hitting Inspect. I began learning HTML and CSS, amazed that a few lines could transform into something visual. That spark became an obsession: understanding how every pixel is placed, every layout crafted.",
    tags: ["HTML", "CSS", "Flexbox", "Box Model", "Inspect"],
    visual: "code",
  },
  {
    id: "ch-02",
    num: "02",
    kicker: "02 — From Code to Logic",
    title: "Thinking in JavaScript",
    desc: "Static pages weren't enough. I dove into JavaScript — not just syntax, but logic. Functions, the DOM, asynchronous code, and eventually React. The shift from \"making things look good\" to \"making things work intelligently\" changed how I see every problem.",
    tags: ["JavaScript", "ES6+", "DOM", "React", "Promises", "APIs"],
    visual: "logic",
  },
  {
    id: "ch-03",
    num: "03",
    kicker: "03 — Building Real Projects",
    title: "Turning Ideas into Products",
    desc: "Theory became real. I built full projects from scratch — designing interfaces, managing state, integrating APIs, and shipping something people could actually use. Each project taught me more than any tutorial ever could.",
    tags: ["React", "Vite", "Firebase", "GSAP", "CSS", "Cloudinary"],
    visual: "projects",
  },
  {
    id: "ch-04",
    num: "04",
    kicker: "04 — Beyond the Screen",
    title: "Techwiz & the World Stage",
    desc: "Competing in Techwiz — an international tech competition — pushed me beyond solo coding. I collaborated under pressure, adapted to real constraints, and learned that great software isn't just written alone. Teamwork, iteration, and presenting your work to experts are skills that no IDE teaches.",
    tags: ["Techwiz", "Teamwork", "Competition", "Presentation", "Problem-Solving"],
    visual: "techwiz",
  },
  {
    id: "ch-05",
    num: "05",
    kicker: "05 — Still Becoming",
    title: "The Horizon Is Always Moving",
    desc: "The stack keeps evolving and so do I. Right now I'm exploring backend depth with Node.js and Express, learning database design, and studying what makes interfaces truly accessible. I'm building toward full-stack confidence — one commit at a time.",
    tags: ["Node.js", "Express", "MongoDB", "TypeScript", "Accessibility", "Next.js"],
    visual: "future",
  },
];

/* ─── Inline SVG icons ─── */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ─── Blueprint grid SVG ─── */
function BlueprintGrid() {
  return (
    <svg className="jrny-grid-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="grid-small" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-large" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#grid-small)" />
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" />
    </svg>
  );
}

/* ─── Code editor illustration (Chapter 01) ─── */
function CodeIllus() {
  return (
    <div className="jrny-code-illus">
      {[
        { ln: "1", content: <><span className="jrny-code-kw">{"<!DOCTYPE "}</span><span className="jrny-code-tag">html</span><span className="jrny-code-kw">{">"}</span></> },
        { ln: "2", content: <><span className="jrny-code-tag">{"<html"}</span> <span className="jrny-code-kw">lang</span><span className="jrny-code-text">=</span><span className="jrny-code-str">"en"</span><span className="jrny-code-tag">{">"}</span></> },
        { ln: "3", content: <><span className="jrny-code-tag">{"  <head>"}</span></> },
        { ln: "4", content: <><span className="jrny-code-tag">{"    <title>"}</span><span className="jrny-code-val">My First Page</span><span className="jrny-code-tag">{"</title>"}</span></> },
        { ln: "5", content: <><span className="jrny-code-tag">{"  </head>"}</span></> },
        { ln: "6", content: <><span className="jrny-code-tag">{"  <body>"}</span></> },
        { ln: "7", content: <><span className="jrny-code-tag">{"    <h1 "}</span><span className="jrny-code-kw">class</span><span className="jrny-code-text">=</span><span className="jrny-code-str">"hero"</span><span className="jrny-code-tag">{">"}</span></> },
        { ln: "8", content: <><span className="jrny-code-val">{"      Hello, World!"}</span><span className="jrny-code-cursor" /></> },
        { ln: "9", content: <><span className="jrny-code-tag">{"    </h1>"}</span></> },
        { ln: "10", content: <><span className="jrny-code-tag">{"  </body>"}</span></> },
        { ln: "11", content: <><span className="jrny-code-tag">{"</html>"}</span></> },
      ].map((line) => (
        <div key={line.ln} className="jrny-code-line">
          <span className="jrny-code-ln">{line.ln}</span>
          <span className="jrny-code-text">{line.content}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Logic/JS illustration (Chapter 02) ─── */
function LogicIllus() {
  return (
    <div className="jrny-code-illus">
      {[
        { ln: "1", content: <><span className="jrny-code-kw">const </span><span className="jrny-code-val">fetchData </span><span className="jrny-code-kw">= async </span><span className="jrny-code-text">() {"=> {"}</span></> },
        { ln: "2", content: <><span className="jrny-code-kw">  try {"{"}</span></> },
        { ln: "3", content: <><span className="jrny-code-kw">    const </span><span className="jrny-code-val">res </span><span className="jrny-code-kw">= await </span><span className="jrny-code-val">fetch</span><span className="jrny-code-text">(</span><span className="jrny-code-str">url</span><span className="jrny-code-text">)</span></> },
        { ln: "4", content: <><span className="jrny-code-kw">    const </span><span className="jrny-code-val">data </span><span className="jrny-code-kw">= await </span><span className="jrny-code-val">res</span><span className="jrny-code-text">.json()</span></> },
        { ln: "5", content: <><span className="jrny-code-val">    setState</span><span className="jrny-code-text">(</span><span className="jrny-code-val">data</span><span className="jrny-code-text">)</span></> },
        { ln: "6", content: <><span className="jrny-code-kw">  {"}"} catch </span><span className="jrny-code-text">(</span><span className="jrny-code-val">err</span><span className="jrny-code-text">) {"{"}</span></> },
        { ln: "7", content: <><span className="jrny-code-val">    console</span><span className="jrny-code-text">.</span><span className="jrny-code-kw">error</span><span className="jrny-code-text">(</span><span className="jrny-code-str">'Error:'</span><span className="jrny-code-text">, </span><span className="jrny-code-val">err</span><span className="jrny-code-text">)</span></> },
        { ln: "8", content: <><span className="jrny-code-kw">  {"}"}</span></> },
        { ln: "9", content: <><span className="jrny-code-text">{"}"}</span><span className="jrny-code-cursor" /></> },
      ].map((line) => (
        <div key={line.ln} className="jrny-code-line">
          <span className="jrny-code-ln">{line.ln}</span>
          <span className="jrny-code-text">{line.content}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Techwiz globe illustration (Chapter 04) ─── */
function TechwizIllus() {
  return (
    <div className="jrny-techwiz-illus">
      <div className="jrny-techwiz-globe">
        <div className="jrny-globe-ring" />
        <div className="jrny-globe-ring" />
        <div className="jrny-globe-ring" />
        <div className="jrny-globe-dot">TW</div>
      </div>
      <div className="jrny-techwiz-text">
        <p className="jrny-techwiz-label">Techwiz International</p>
        <p className="jrny-techwiz-sub">
          Competing on a global stage — presenting real solutions to real panels.
        </p>
      </div>
      <div className="jrny-techwiz-badges">
        <span className="jrny-techwiz-badge">Global Competition</span>
        <span className="jrny-techwiz-badge">Team Collaboration</span>
        <span className="jrny-techwiz-badge">Innovation</span>
      </div>
    </div>
  );
}

/* ─── Future learning map (Chapter 05) ─── */
function FutureLearning() {
  const skills = [
    { label: "Node.js", status: "Learning", icon: <><circle cx="12" cy="12" r="9"/><path d="M12 3v9l4 4"/></> },
    { label: "MongoDB", status: "Exploring", icon: <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></> },
    { label: "TypeScript", status: "Exploring", icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></> },
    { label: "Next.js", status: "Next up", icon: <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></> },
    { label: "Accessibility", status: "Ongoing", icon: <><circle cx="12" cy="4" r="2"/><path d="M12 6v6M8 10l4 2 4-2M10 18l2-4 2 4"/></> },
    { label: "Algorithms", status: "Ongoing", icon: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></> },
  ];

  return (
    <div className="jrny-learning-map">
      {skills.map((s) => (
        <div key={s.label} className="jrny-learn-item">
          <div className="jrny-learn-icon">
            <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {s.icon}
            </svg>
          </div>
          <span className="jrny-learn-label">{s.label}</span>
          <span className="jrny-learn-status">{s.status}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Projects showcase (Chapter 03) ─── */
function ProjectsShowcase({ projects }) {
  /* Use first few real projects; fall back to two static cards */
  const featured = projects.slice(0, 3);

  if (featured.length === 0) {
    return (
      <div className="jrny-dual-proj">
        {[
          { name: "FurCare", desc: "A pet-care platform built with React and Firebase — real-time bookings, authentication, and a responsive dashboard.", tags: ["React", "Firebase", "CSS"] },
          { name: "Fandomverse", desc: "A fandom community web app with dynamic content, user profiles, and a card-based UI for enthusiasts.", tags: ["React", "GSAP", "Vite"] },
          { name: "Portfolio", desc: "This portfolio — built with React, GSAP, ScrollTrigger, and Lenis smooth scroll for a premium interactive experience.", tags: ["React", "GSAP", "Lenis"] },
        ].map((p) => (
          <div key={p.name} className="jrny-proj-card">
            <div className="jrny-proj-card-accent-bar" />
            <div className="jrny-proj-card-letter">{p.name.charAt(0)}</div>
            <div className="jrny-proj-card-info">
              <p className="jrny-proj-card-title">{p.name}</p>
              <p className="jrny-proj-card-desc">{p.desc}</p>
              <div className="jrny-proj-card-tags">
                {p.tags.map((t) => <span key={t} className="jrny-proj-card-tag">{t}</span>)}
              </div>
            </div>
            <span className="jrny-proj-card-arrow">↗</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="jrny-dual-proj">
      {featured.map((p) => (
        <a
          key={p.id}
          href={p.link || p.github || "#"}
          target="_blank"
          rel="noreferrer"
          className="jrny-proj-card"
        >
          <div className="jrny-proj-card-accent-bar" />
          <div className="jrny-proj-card-letter">{p.title?.charAt(0) ?? "P"}</div>
          <div className="jrny-proj-card-info">
            <p className="jrny-proj-card-title">{p.title}</p>
            {p.description && <p className="jrny-proj-card-desc">{p.description}</p>}
            {p.tech?.length > 0 && (
              <div className="jrny-proj-card-tags">
                {p.tech.slice(0, 3).map((t) => <span key={t} className="jrny-proj-card-tag">{t}</span>)}
              </div>
            )}
          </div>
          <span className="jrny-proj-card-arrow">↗</span>
        </a>
      ))}
    </div>
  );
}

/* ─── Visual selector ─── */
function ChapterVisual({ type, image, title, projectUrl, achievement, projects }) {
  if (image) {
    return (
      <div className="jrny-image-card">
        <img src={image} alt={title || "Chapter preview"} className="jrny-project-img" />
        <div className="jrny-img-overlay" />
        {achievement && <span className="jrny-chapter-badge-chip">{achievement}</span>}
        {projectUrl && (
          <div className="jrny-project-meta">
            <p className="jrny-project-meta-title">{title}</p>
            <a href={projectUrl} target="_blank" rel="noreferrer" className="jrny-project-meta-link">
              Explore Project ↗
            </a>
          </div>
        )}
      </div>
    );
  }

  if (type === "code") return <CodeIllus />;
  if (type === "logic") return <LogicIllus />;
  if (type === "techwiz") return <TechwizIllus />;
  if (type === "future") return <FutureLearning />;
  if (type === "projects") return <ProjectsShowcase projects={projects} />;
  return <ProjectsShowcase projects={projects} />;
}

/* ══════════════════════════════════════════════
   MAIN JOURNEY PAGE
   ══════════════════════════════════════════════ */
export default function Journey() {
  const pageRef = useRef(null);
  const railFillRef = useRef(null);
  const chapRefs = useRef([]);
  const nodeRefs = useRef([]);
  const navigate = useNavigate();
  const { projects, journeyData } = useSite();

  const hero = journeyData?.hero || {};
  const chapters = journeyData?.chapters || [];
  const design = journeyData?.design || {};
  const closing = journeyData?.closing || {};

  const visibleChapters = chapters.filter((ch) => ch.published !== false);
  const animationsEnabled = design.enableAnimations !== false;

  useLenis();

  // Reset refs on each render
  chapRefs.current = [];
  nodeRefs.current = [];

  // Scoped CSS variable overrides for Journey section
  const journeyStyle = {
    "--bg": design.bg || "#211416",
    "--text": design.text || "#E8DFD0",
    "--accent": design.accent || "#B99A68",
    "--on-accent": "#211416",
    "--surface": `color-mix(in srgb, ${design.bg || "#211416"} 92%, ${design.text || "#E8DFD0"})`,
    "--surface-2": `color-mix(in srgb, ${design.bg || "#211416"} 84%, ${design.text || "#E8DFD0"})`,
    "--muted": `color-mix(in srgb, ${design.text || "#E8DFD0"} 64%, ${design.bg || "#211416"})`,
    "--border": `color-mix(in srgb, ${design.text || "#E8DFD0"} 12%, transparent)`,
    "--border-strong": `color-mix(in srgb, ${design.text || "#E8DFD0"} 28%, transparent)`,
  };

  /* ── GSAP hero entrance ── */
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !animationsEnabled) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".jrny-hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, clearProps: "transform,opacity" }
      )
      .fromTo(
        ".jrny-hero-title .jrny-word",
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.12, clearProps: "transform,opacity" },
        "-=0.2"
      )
      .fromTo(
        ".jrny-hero-intro, .jrny-scroll-indicator",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, clearProps: "transform,opacity" },
        "-=0.35"
      );
    }, pageRef);

    return () => ctx.revert();
  }, [animationsEnabled]);

  /* ── Rail fill + chapter active states via ScrollTrigger ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chaptersEl = document.querySelector(".jrny-chapters");
    const railFill = railFillRef.current;
    if (!chaptersEl || !railFill || design.showRail === false) return;

    const ctx = gsap.context(() => {
      if (!prefersReduced && animationsEnabled) {
        /* Animate rail fill height as user scrolls through all chapters */
        gsap.to(railFill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: chaptersEl,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.8,
          },
        });
      } else {
        railFill.style.transform = "scaleY(1)";
      }

      /* Active node + chapter highlight per chapter */
      chapRefs.current.forEach((chap, i) => {
        if (!chap) return;
        ScrollTrigger.create({
          trigger: chap,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => {
            chap.classList.add("is-active");
            nodeRefs.current[i]?.classList.add("is-active");
          },
          onLeave: () => {
            chap.classList.remove("is-active");
            nodeRefs.current[i]?.classList.remove("is-active");
          },
          onEnterBack: () => {
            chap.classList.add("is-active");
            nodeRefs.current[i]?.classList.add("is-active");
          },
          onLeaveBack: () => {
            chap.classList.remove("is-active");
            nodeRefs.current[i]?.classList.remove("is-active");
          },
        });
      });
    });

    return () => ctx.revert();
  }, [visibleChapters.length, animationsEnabled, design.showRail]);

  /* ── IntersectionObserver for reveal classes ── */
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".jrny-reveal, .jrny-reveal-left, .jrny-reveal-right"
    );

    if (!animationsEnabled) {
      targets.forEach((el) => el.classList.add("jrny-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("jrny-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    /* Safety fallback */
    const timer = setTimeout(() => {
      targets.forEach((el) => el.classList.add("jrny-visible"));
    }, 700);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [visibleChapters, animationsEnabled]);

  const spacingClass = `journey-spacing-${design.spacing || "comfortable"}`;
  const layoutClass = `journey-layout-${design.layoutStyle || "alternate"}`;
  const railClass = `journey-rail-${design.timelineStyle || "glow"}`;
  const animClass = !animationsEnabled ? "journey-no-animations" : "";

  return (
    <>
      <Navbar />
      <div
        className={`journey-page ${spacingClass} ${layoutClass} ${railClass} ${animClass}`}
        style={journeyStyle}
        ref={pageRef}
      >
        {/* ══ HERO ══ */}
        <section className="jrny-hero" aria-labelledby="jrny-hero-heading">
          {/* Background blueprint grid */}
          {hero.showHeroGrid !== false && (
            <div className="jrny-hero-bg" aria-hidden="true">
              <BlueprintGrid />
            </div>
          )}

          {/* Flowing connected-nodes path */}
          {hero.showHeroPath !== false && (
            <div className="jrny-hero-path-wrap" aria-hidden="true">
              <svg className="jrny-hero-path-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
                <path
                  className="jrny-hero-path-line"
                  d="M-50,900 C100,750 200,600 350,500 C500,400 550,350 700,280 C850,210 950,180 1100,120 C1250,60 1350,30 1500,-20"
                />
                <path
                  className="jrny-hero-path-line"
                  d="M1500,900 C1300,800 1100,700 900,600 C700,500 600,400 400,320 C200,240 100,180 -50,100"
                  strokeDasharray="4 20"
                  opacity="0.06"
                />
                {/* Node dots along the path */}
                {[[350, 500], [700, 280], [1100, 120]].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    opacity="0.25"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Glow */}
          <div className="jrny-hero-glow" aria-hidden="true" />

          {/* Badge */}
          {hero.showBadge !== false && (
            <div className="jrny-hero-badge">
              <span className="jrny-badge-dot" />
              {hero.badge || "THE EVOLUTION OF A DEVELOPER"}
            </div>
          )}

          {/* Editorial heading */}
          <h1 className="jrny-hero-title" id="jrny-hero-heading">
            <span className="jrny-word-wrap">
              <span className="jrny-word">{hero.titleLine1 || "Every Line of Code"}</span>
            </span>
            <span className="jrny-word-wrap">
              <span className="jrny-word">
                {hero.titleLine2 || "Built a Part of"}{" "}
                <span className="jrny-accent">{hero.titleHighlight || "Me."}</span>
              </span>
            </span>
          </h1>

          {/* Intro paragraph */}
          {hero.showIntro !== false && (
            <p className="jrny-hero-intro">
              {hero.intro}
            </p>
          )}

          {/* Scroll indicator */}
          {hero.showScrollIndicator !== false && (
            <div className="jrny-scroll-indicator" aria-hidden="true">
              <div className="jrny-scroll-line" />
              SCROLL TO EXPLORE
              <div className="jrny-scroll-arrow">
                <span />
                <span />
              </div>
            </div>
          )}
        </section>

        {/* ══ CHAPTERS ══ */}
        <div className="jrny-chapters">
          {/* Growth path rail */}
          {design.showRail !== false && (
            <div className="jrny-rail" aria-hidden="true">
              <div className="jrny-rail-fill" ref={railFillRef} style={{ height: "100%" }} />
            </div>
          )}

          {visibleChapters.map((ch, i) => (
            <article
              key={ch.id}
              className="jrny-chapter"
              ref={(el) => { chapRefs.current[i] = el; }}
              aria-labelledby={`${ch.id}-title`}
            >
              {/* Rail node */}
              {design.showRail !== false && (
                <div
                  className="jrny-node"
                  ref={(el) => { nodeRefs.current[i] = el; }}
                  aria-hidden="true"
                />
              )}

              <div className="jrny-chapter-inner">
                {/* Text column */}
                <div className="jrny-chapter-text">
                  <div className="jrny-chapter-num jrny-reveal" aria-hidden="true">
                    {ch.num}
                  </div>

                  <span className="jrny-chapter-kicker jrny-reveal jrny-reveal-d1">
                    {ch.kicker}
                    {ch.period && <span className="jrny-chapter-period">{ch.period}</span>}
                  </span>

                  <h2
                    className="jrny-chapter-title jrny-reveal jrny-reveal-d2"
                    id={`${ch.id}-title`}
                  >
                    {ch.title}
                  </h2>

                  <p className="jrny-chapter-desc jrny-reveal jrny-reveal-d3">
                    {ch.desc}
                  </p>

                  {ch.tags && ch.tags.length > 0 && (
                    <div className="jrny-tags jrny-reveal jrny-reveal-d4">
                      {ch.tags.map((t) => (
                        <span key={t} className="jrny-tag">{t}</span>
                      ))}
                    </div>
                  )}

                  {ch.projectUrl && (
                    <div className="jrny-reveal jrny-reveal-d4">
                      <a
                        href={ch.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="jrny-chapter-link-btn"
                      >
                        Explore Project
                        <ArrowIcon />
                      </a>
                    </div>
                  )}
                </div>

                {/* Visual column */}
                <div className={`jrny-chapter-visual ${i % 2 === 0 ? "jrny-reveal-right" : "jrny-reveal-left"}`}>
                  <div className="jrny-illus">
                    <ChapterVisual
                      type={ch.visual}
                      image={ch.image}
                      title={ch.title}
                      projectUrl={ch.projectUrl}
                      achievement={ch.achievement}
                      projects={projects}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ══ CLOSING STATEMENT ══ */}
        {closing.showClosing !== false && (
          <section className="jrny-closing" aria-labelledby="jrny-closing-heading">
            <div className="jrny-closing-glow" aria-hidden="true" />
            <div className="jrny-closing-inner">
              {closing.kicker && (
                <div className="jrny-closing-kicker jrny-reveal">
                  <span className="jrny-badge-dot" />
                  {closing.kicker}
                </div>
              )}

              <h2 className="jrny-closing-title jrny-reveal" id="jrny-closing-heading">
                {closing.titleLine1 || "This Isn't the"}{" "}
                <span className="jrny-accent">{closing.titleAccent1 || "Finish Line."}</span>
                <br />
                {closing.titleLine2 || "It's the Next"}{" "}
                <span className="jrny-accent">{closing.titleAccent2 || "Commit."}</span>
              </h2>

              {closing.sub && (
                <p className="jrny-closing-sub jrny-reveal jrny-reveal-d1">
                  {closing.sub}
                </p>
              )}

              <div className="jrny-closing-actions jrny-reveal jrny-reveal-d2">
                {closing.showPrimaryBtn !== false && (
                  <Link to={closing.primaryBtnLink || "/#projects"} className="jrny-btn-primary">
                    {closing.primaryBtnLabel || "See My Projects"}
                    <ArrowIcon />
                  </Link>
                )}
                {closing.showSecondaryBtn !== false && (
                  <button
                    className="jrny-btn-ghost"
                    onClick={() => {
                      const link = closing.secondaryBtnLink || "/#contact";
                      if (link.startsWith("/#") || link.startsWith("#")) {
                        navigate("/#contact", { state: { scrollTo: "contact" } });
                      } else {
                        navigate(link);
                      }
                    }}
                  >
                    {closing.secondaryBtnLabel || "Let's Collaborate"}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
