import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenis from "../hooks/useLenis";
import Navbar from "../components/Nav";
import avatarImg from "../assets/hero-img-removebg-preview.png";
import "../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_COMMANDS = {
  whoami: "Uzair Ansari — Creative Web Developer, UI craftsman & full-stack explorer based in Karachi, Pakistan.",
  stack: "Frontend: React, JavaScript (ES6+), GSAP, HTML5, CSS3/Tailwind.\nBackend & Tools: Node.js, Express, Git, GitHub, REST APIs, Vite.",
  philosophy: "« Good software is where rigorous logic meets fluid aesthetics. Every pixel should have purpose, and every interaction should feel effortless. »",
  setup: "💻 Workstation: High-Performance Rig\n⌨️ Keyboard: Mechanical (Tactile switches)\n🎧 Audio: Lo-Fi Beats & Synthwave playlists\n⚡ Theme: Sleek Minimalist Dark 24/7",
  hobbies: "Chess strategy ♟️, exploring emerging tech trends 🚀, continuous learning 📚, and brewing warm chai ☕.",
  contact: "Redirecting to contact form... You can reach out at the contact section or email hello@example.com!",
};

export default function About() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Lenis smooth scroll
  useLenis();

  // 1. Live Pakistan Time Clock
  const [liveTime, setLiveTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Asia/Karachi (PKT)
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setLiveTime(formatted + " PKT");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Direct DOM 3D Card Mouse Tilt (Zero React re-render lag)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    cardRef.current.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  // 3. Interactive Terminal State
  const [terminalHistory, setTerminalHistory] = useState([
    {
      cmd: "whoami",
      output: TERMINAL_COMMANDS.whoami,
    },
    {
      cmd: "cat philosophy.txt",
      output: TERMINAL_COMMANDS.philosophy,
    },
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  const runCommand = (commandName) => {
    const clean = commandName.trim().toLowerCase();
    if (clean === "clear") {
      setTerminalHistory([]);
      return;
    }
    if (clean === "contact") {
      setTerminalHistory((prev) => [
        ...prev,
        { cmd: clean, output: TERMINAL_COMMANDS.contact },
      ]);
      setTimeout(() => {
        navigate("/#contact", { state: { scrollTo: "contact" } });
      }, 900);
      return;
    }
    const output =
      TERMINAL_COMMANDS[clean] ||
      `Command not found: "${clean}". Available commands: whoami, stack, philosophy, setup, hobbies, contact, clear`;
    setTerminalHistory((prev) => [...prev, { cmd: clean, output }]);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    runCommand(terminalInput);
    setTerminalInput("");
  };

  // 4. Hero entrance GSAP (Runs once on initial page load)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(
        ".about-hero-title .about-word",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          clearProps: "transform,opacity",
        }
      ).fromTo(
        ".about-hero-badge, .about-hero-lead, .about-hero-stats",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          clearProps: "transform,opacity",
        },
        "-=0.2"
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // 5. Native Hardware-Accelerated Scroll Reveals (Zero CPU overhead on scroll & 100% guaranteed visibility)
  useEffect(() => {
    const revealTargets = document.querySelectorAll(
      ".about-terminal-box, .about-bento-card, .about-timeline-item, .about-cta-box"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));

    // Safety fallback: ensure nothing stays hidden if scrolled fast or on small screens
    const safetyTimer = setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add("about-visible"));
    }, 600);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="about-page" ref={pageRef}>
        {/* Ambient atmospheric glows */}
        <div className="about-blob about-blob--1" aria-hidden="true" />
        <div className="about-blob about-blob--2" aria-hidden="true" />

        {/* ── SECTION 1: HERO & INTERACTIVE DEVELOPER BADGE ── */}
        <section className="about-hero-section">
          <div className="about-hero-left">
            <div className="about-hero-badge">
              <span className="about-hero-badge-dot" />
              <span>THE PERSON BEHIND THE CRAFT</span>
            </div>

            <h1 className="about-hero-title">
              <span className="about-word-wrap"><span className="about-word">Designing logic,</span></span>
              <br />
              <span className="about-word-wrap"><span className="about-word about-word--accent">crafting emotions.</span></span>
            </h1>

            <p className="about-hero-lead">
              I'm <strong>Uzair Ansari</strong> — a creative software developer who turns abstract ideas
              into polished, responsive, and tactile web interfaces. I treat development not as a routine,
              but as an art form built on speed, precision, and relentless curiosity.
            </p>

            <div className="about-hero-stats">
              <div className="about-hero-stat-item">
                <strong>10+</strong>
                <span>Projects Shipped</span>
              </div>
              <div className="about-hero-stat-sep" />
              <div className="about-hero-stat-item">
                <strong>99.9%</strong>
                <span>Pixel Perfection</span>
              </div>
              <div className="about-hero-stat-sep" />
              <div className="about-hero-stat-item">
                <strong>∞</strong>
                <span>Love for Code</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Holographic Developer Pass */}
          <div className="about-hero-right">
            <div
              className="about-id-card"
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="about-id-card-shimmer" aria-hidden="true" />

              <div className="about-id-topbar">
                <div className="about-id-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>DEVELOPER PASS</span>
                </div>
                <div className="about-id-status">
                  <span className="about-id-status-dot" />
                  <span>Available</span>
                </div>
              </div>

              <div className="about-id-avatar-wrap">
                <img
                  src={avatarImg}
                  alt="Uzair Ansari"
                  className="about-id-avatar"
                  loading="eager"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>

              <div className="about-id-body">
                <h3 className="about-id-name">UZAIR ANSARI</h3>
                <p className="about-id-role">Frontend & Full-Stack Craftsman</p>

                <div className="about-id-meta-grid">
                  <div className="about-id-meta-cell">
                    <span>LOCATION</span>
                    <strong>Karachi, PK</strong>
                  </div>
                  <div className="about-id-meta-cell">
                    <span>LOCAL TIME</span>
                    <strong className="about-id-clock">{liveTime || "Karachi Time"}</strong>
                  </div>
                  <div className="about-id-meta-cell">
                    <span>FOCUS</span>
                    <strong>Interactive UX & Scalability</strong>
                  </div>
                  <div className="about-id-meta-cell">
                    <span>STATUS</span>
                    <strong className="about-id-status-text">Building Next-Gen Web</strong>
                  </div>
                </div>
              </div>

              <div className="about-id-barcode">
                <div className="about-barcode-lines" aria-hidden="true" />
                <span>#UA-PORTFOLIO-2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: INTERACTIVE DEVELOPER TERMINAL ── */}
        <section className="about-terminal-section">
          <div className="about-sec-heading">
            <span className="about-sec-kicker">01 / INTERACTIVE ENVIRONMENT</span>
            <h2>
              Explore my mind through the <span className="about-word--accent">CLI.</span>
            </h2>
            <p>Click any quick command pill or type directly into the terminal below:</p>
          </div>

          <div className="about-terminal-box">
            {/* Terminal Window Header */}
            <div className="about-term-header">
              <div className="about-term-dots">
                <span className="about-term-dot about-term-dot--red" />
                <span className="about-term-dot about-term-dot--yellow" />
                <span className="about-term-dot about-term-dot--green" />
              </div>
              <span className="about-term-title">uzair@portfolio: ~ (zsh)</span>
              <div className="about-term-tag">INTERACTIVE CLI</div>
            </div>

            {/* Quick Command Pills */}
            <div className="about-term-quick-bar">
              <span className="about-term-quick-label">RUN QUICK COMMAND:</span>
              {["whoami", "stack", "philosophy", "setup", "hobbies", "contact", "clear"].map(
                (cmd) => (
                  <button
                    key={cmd}
                    className="about-term-pill"
                    onClick={() => runCommand(cmd)}
                  >
                    ${cmd}
                  </button>
                )
              )}
            </div>

            {/* Terminal Body */}
            <div className="about-term-body">
              <div className="about-term-banner">
                <p>Welcome to Uzair's interactive shell v2.4. Type commands or click buttons above.</p>
              </div>

              {terminalHistory.map((item, idx) => (
                <div key={idx} className="about-term-entry">
                  <div className="about-term-prompt-line">
                    <span className="about-term-user">uzair@portfolio</span>
                    <span className="about-term-colon">:</span>
                    <span className="about-term-path">~</span>
                    <span className="about-term-symbol">$</span>
                    <span className="about-term-cmd-text">{item.cmd}</span>
                  </div>
                  <pre className="about-term-output">{item.output}</pre>
                </div>
              ))}

              {/* Live Input Form */}
              <form onSubmit={handleTerminalSubmit} className="about-term-input-line">
                <span className="about-term-user">uzair@portfolio</span>
                <span className="about-term-colon">:</span>
                <span className="about-term-path">~</span>
                <span className="about-term-symbol">$</span>
                <input
                  type="text"
                  className="about-term-input"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type a command (e.g. stack, whoami, setup)..."
                  spellCheck="false"
                  autoComplete="off"
                />
                <span className="about-term-cursor" />
              </form>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: BENTO WORKBENCH (BEHIND THE CODE) ── */}
        <section className="about-bento-section">
          <div className="about-sec-heading">
            <span className="about-sec-kicker">02 / THE WORKBENCH & LIFESTYLE</span>
            <h2>What keeps me in the flow.</h2>
          </div>

          <div className="about-bento-grid">
            {/* Bento Card 1: Music & Rhythm */}
            <article className="about-bento-card about-bento-card--music">
              <div className="about-bento-icon-box">🎧</div>
              <div className="about-bento-top">
                <span className="about-bento-pill">NOW PLAYING</span>
                <div className="about-sound-bars" aria-hidden="true">
                  <span className="about-sound-bar" />
                  <span className="about-sound-bar" />
                  <span className="about-sound-bar" />
                  <span className="about-sound-bar" />
                </div>
              </div>
              <h3>Lo-Fi Chill & Synthwave Vibes</h3>
              <p>
                Rhythm drives productivity. Smooth background melodies keep brainwaves focused
                during deep architecture and debugging runs.
              </p>
              <div className="about-bento-foot">
                <span className="about-bento-tag">Deep Focus State</span>
              </div>
            </article>

            {/* Bento Card 2: Fuel */}
            <article className="about-bento-card about-bento-card--fuel">
              <div className="about-bento-icon-box">☕</div>
              <div className="about-bento-top">
                <span className="about-bento-pill">DAILY FUEL</span>
              </div>
              <h3>Chai Over Everything</h3>
              <p>
                A freshly brewed cup of hot cardamom chai before opening VS Code. It turns complex
                bugs into elegant, solved equations.
              </p>
              <div className="about-bento-foot">
                <span className="about-bento-tag">100% Organic Energy</span>
              </div>
            </article>

            {/* Bento Card 3: Philosophy */}
            <article className="about-bento-card about-bento-card--wide">
              <div className="about-bento-icon-box">⚡</div>
              <div className="about-bento-top">
                <span className="about-bento-pill">CORE BELIEF</span>
              </div>
              <h3>"Simple is hard. Complex is easy."</h3>
              <p>
                Anyone can build something that works, but building something that feels effortless,
                fast, and delightfully fluid requires obsessive attention to typography, margins,
                latency, and transitions.
              </p>
              <div className="about-quote-author">— Uzair Ansari</div>
            </article>

            {/* Bento Card 4: Hardware & Environment */}
            <article className="about-bento-card">
              <div className="about-bento-icon-box">🖥️</div>
              <div className="about-bento-top">
                <span className="about-bento-pill">SETUP</span>
              </div>
              <h3>Minimalist Workspace</h3>
              <p>
                Dual monitor workflow, mechanical brown switches for tactile rhythm, pure dark IDE
                themes, and zero desktop clutter.
              </p>
            </article>

            {/* Bento Card 5: Continuous Growth */}
            <article className="about-bento-card">
              <div className="about-bento-icon-box">🚀</div>
              <div className="about-bento-top">
                <span className="about-bento-pill">MINDSET</span>
              </div>
              <h3>Relentless Evolution</h3>
              <p>
                Never satisfied with yesterday's code. Constantly reading documentation, experimenting
                with new libraries, and pushing UI limits.
              </p>
            </article>
          </div>
        </section>

        {/* ── SECTION 4: MY JOURNEY TIMELINE ── */}
        <section className="about-timeline-section">
          <div className="about-sec-heading">
            <span className="about-sec-kicker">03 / EVOLUTION & MILESTONES</span>
            <h2>How the journey unfolded.</h2>
          </div>

          <div className="about-timeline">
            <div className="about-timeline-line" aria-hidden="true" />

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <span>01</span>
              </div>
              <div className="about-timeline-content">
                <span className="about-timeline-year">2023 — THE SPARK</span>
                <h3>The First "Hello, World!"</h3>
                <p>
                  Started dissecting inspect elements of beautiful websites. Fell in love with HTML,
                  CSS layouts, and the sheer magic of writing code that transforms into visuals.
                </p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <span>02</span>
              </div>
              <div className="about-timeline-content">
                <span className="about-timeline-year">2024 — THE LOGIC ENGINE</span>
                <h3>Deep Dive into JavaScript</h3>
                <p>
                  Transitioned from static layouts to full dynamic applications. Mastered DOM
                  manipulation, asynchronous promises, algorithms, and real-time APIs.
                </p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <span>03</span>
              </div>
              <div className="about-timeline-content">
                <span className="about-timeline-year">2025 — REACT & MOTION</span>
                <h3>Component Architecture & Animation</h3>
                <p>
                  Adopted React for state-driven UI development and GSAP for silky-smooth motion.
                  Began building rich single-page applications with production performance.
                </p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <span>04</span>
              </div>
              <div className="about-timeline-content">
                <span className="about-timeline-year">2026 & BEYOND — CRAFTING PRODUCTS</span>
                <h3>Creative Full-Stack Mastery</h3>
                <p>
                  Focused on building meaningful full-stack digital products, scalable codebases,
                  accessible interfaces, and experiences that users remember.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: FINAL CTA ── */}
        <section className="about-cta-section">
          <div className="about-cta-box">
            <div className="about-cta-badge">LET'S COLLABORATE</div>
            <h2 className="about-cta-title">
              Have an exciting project in mind?
              <br />
              <span className="about-word--accent">Let's build something unforgettable.</span>
            </h2>
            <p className="about-cta-sub">
              Whether you need a high-impact website, interactive animations, or clean frontend
              engineering — my inbox is always open.
            </p>

            <button
              className="about-cta-btn"
              onClick={() => navigate("/#contact", { state: { scrollTo: "contact" } })}
            >
              Get In Touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
