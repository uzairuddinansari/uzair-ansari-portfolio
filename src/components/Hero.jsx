import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/Hero.css";
import heroPortrait from "../assets/hero-img.jpeg";

export default function Hero() {
  const homeRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-kicker", {
        y: 15,
        opacity: 0,
        duration: 0.4,
      }, "-=0.2")
        .from(".hero-title span", {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
        }, "-=0.1")
        .from(".hero-copy, .hero-actions, .hero-social", {
          y: 18,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
        }, "-=0.35")
        .from(".hero-portrait", {
          clipPath: "inset(0 0 100% 0)",
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
        }, "-=0.8")
        .from(".hero-detail", {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
        }, "-=0.4");

      gsap.to(".hero-portrait img", {
        y: -7,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="portfolio-home" ref={homeRef}>

      <section className="hero-section" id="home">
        <div className="hero-copy-column">
          <p className="hero-kicker">
            <span /> FRONTEND DEVELOPER
          </p>

          <h1 className="hero-title">
            <span className="title-white">Hi, I’m</span>
            <span className="title-accent">Uzair Ansari.</span>
          </h1>

          <p className="hero-copy">
            I build modern, responsive and user-focused web experiences.
            Currently exploring the <strong>MERN stack</strong> to turn
            bigger ideas into real products.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              View Projects <span>↗</span>
            </a>
            <a className="button button-outline" href="#contact">
              Let’s Talk <span>↗</span>
            </a>
          </div>

          <div className="hero-social">
            <a href="https://github.com/" aria-label="GitHub">GH</a>
            <a href="https://linkedin.com/" aria-label="LinkedIn">in</a>
            <a href="mailto:hello@example.com" aria-label="Email">✉</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit hero-detail" />
          <div className="hero-portrait">
            <img
              src={heroPortrait}
              alt="Uzair Ansari"
            />
          </div>

          <div className="hero-note hero-detail">
            <span>BUILD</span>
            <span>CREATE</span>
            <span>GROW</span>
            <i />
          </div>

          <div className="role-chip hero-detail">
            <span>CURRENTLY</span>
            <strong>Frontend Developer</strong>
            <b>↗</b>
          </div>
        </div>
      </section>
    </main>
  );
}
