import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenis from "../hooks/useLenis";
import "../styles/About.css";
import Navbar from "../components/Nav";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const pageRef = useRef(null);

  // Lenis smooth scroll — synced with GSAP ScrollTrigger
  useLenis();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      /* ────────────────────────────────────────
         1. HERO INTRO — cinematic text reveal
      ──────────────────────────────────────── */
      const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Label slides in from left with line drawing
      introTl.fromTo(
        ".about-label",
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 }
      );

      // Heading — each word reveals via clip-path mask
      introTl.fromTo(
        ".about-heading .about-word",
        { yPercent: 120, opacity: 0, rotateX: -30 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // Copy paragraph fades in from below
      introTl.fromTo(
        ".about-copy",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.5"
      );

      // Decorative line grows
      introTl.fromTo(
        ".about-intro-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.4"
      );

      /* ────────────────────────────────────────
         2. STORY SECTION — parallax text reveal
      ──────────────────────────────────────── */
      // Section number and title
      gsap.fromTo(
        ".about-story .about-section-title > *",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-story",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Each story paragraph reveals one by one with parallax
      gsap.utils.toArray(".about-story-copy p").forEach((p, i) => {
        gsap.fromTo(
          p,
          { y: 60, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      /* ────────────────────────────────────────
         3. VALUES GRID — staggered card entrance
      ──────────────────────────────────────── */
      gsap.fromTo(
        ".about-values .about-section-title > *",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-values",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".about-value",
        { y: 80, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-values-grid",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Value icon pulse animation on scroll
      gsap.utils.toArray(".about-value-icon").forEach((icon) => {
        gsap.fromTo(
          icon,
          { scale: 0, rotate: -15 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: icon,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      /* ────────────────────────────────────────
         4. STATS — counter animation
      ──────────────────────────────────────── */
      gsap.fromTo(
        ".about-stat",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stats",
            start: "top 82%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              // Animate counter numbers
              document.querySelectorAll(".about-stat-num").forEach((num) => {
                const target = parseInt(num.getAttribute("data-target"), 10);
                gsap.fromTo(
                  num,
                  { innerText: 0 },
                  {
                    innerText: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    onUpdate: function () {
                      num.textContent = Math.round(gsap.getProperty(num, "innerText")) + "+";
                    },
                  }
                );
              });
            },
          },
        }
      );

      /* ────────────────────────────────────────
         5. DIRECTION — big text parallax
      ──────────────────────────────────────── */
      gsap.fromTo(
        ".about-direction .about-label",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-direction",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".about-direction h2 .about-word",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-direction h2",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".about-direction > p:last-of-type",
        { y: 30, opacity: 0, filter: "blur(3px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-direction > p:last-of-type",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Decorative closing line
      gsap.fromTo(
        ".about-end-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".about-end-line",
            start: "top 90%",
            toggleActions: "play none none once",
          },
        }
      );

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main className="about-page" ref={pageRef}>

        {/* Ambient gradient blobs */}
        <div className="about-blob about-blob--1" aria-hidden="true" />
        <div className="about-blob about-blob--2" aria-hidden="true" />

        {/* ── INTRO ── */}
        <section className="about-intro">
          <p className="about-label">
            GET TO KNOW ME <span>01 / ABOUT</span>
          </p>

          <h1 className="about-heading">
            <span className="about-word-wrap">
              <span className="about-word">A&nbsp;little</span>
            </span>
            <span className="about-word-wrap">
              <span className="about-word">about</span>
            </span>
            <br />
            <span className="about-word-wrap">
              <span className="about-word about-word--accent">who&nbsp;I&nbsp;am.</span>
            </span>
          </h1>

          <p className="about-copy">
            I'm <strong>Uzair Ansari</strong>, a developer who enjoys turning ideas into
            meaningful digital experiences. For me, development is where
            creativity meets logic — every detail has a purpose, and every
            project is a chance to become better.
          </p>

          <div className="about-intro-line" aria-hidden="true" />
        </section>

        {/* ── MY STORY ── */}
        <section className="about-content-block about-story">
          <div className="about-section-title">
            <span>01</span>
            <h2>The person behind the code.</h2>
          </div>

          <div className="about-story-copy">
            <p>
              My journey started with curiosity about how websites work.
              That curiosity grew into a passion for building interfaces
              that are responsive, accessible, and enjoyable to use.
            </p>
            <p>
              I work with HTML, CSS, JavaScript, and React, constantly
              improving my fundamentals while exploring better ways to
              structure code, solve problems, and create polished user
              experiences.
            </p>
            <p>
              I believe good development is not just about making something
              work. It's about understanding the problem, caring about the
              details, and being willing to learn from every mistake.
            </p>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="about-stats">
          <div className="about-stat">
            <span className="about-stat-num" data-target="10">0+</span>
            <span className="about-stat-label">Projects Built</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num" data-target="5">0+</span>
            <span className="about-stat-label">Technologies</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num" data-target="500">0+</span>
            <span className="about-stat-label">Hours Coding</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num" data-target="100">0+</span>
            <span className="about-stat-label">Cups of Chai</span>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="about-content-block about-values">
          <div className="about-section-title">
            <span>02</span>
            <h2>What drives me.</h2>
          </div>

          <div className="about-values-grid">
            <article className="about-value">
              <div className="about-value-icon">💡</div>
              <span>01 / THINK</span>
              <h3>Curiosity first.</h3>
              <p>
                I like asking questions, understanding how things work,
                and exploring solutions instead of settling for the first answer.
              </p>
            </article>

            <article className="about-value">
              <div className="about-value-icon">⚡</div>
              <span>02 / BUILD</span>
              <h3>Purposeful work.</h3>
              <p>
                I focus on clean code, thoughtful design, and interactions
                that make a real difference to the user.
              </p>
            </article>

            <article className="about-value">
              <div className="about-value-icon">🚀</div>
              <span>03 / GROW</span>
              <h3>Always improving.</h3>
              <p>
                Every challenge teaches me something new. I keep learning,
                practising, and building to move forward.
              </p>
            </article>
          </div>
        </section>

        {/* ── DIRECTION ── */}
        <section className="about-content-block about-direction">
          <p className="about-label">03 / THE DIRECTION</p>
          <h2>
            <span className="about-word-wrap">
              <span className="about-word">Not&nbsp;finished.</span>
            </span>
            <br />
            <span className="about-word-wrap">
              <span className="about-word about-word--accent">Just&nbsp;getting&nbsp;started.</span>
            </span>
          </h2>
          <p>
            My goal is to grow into a well-rounded full-stack developer,
            build useful products, and work on problems that challenge me
            to think beyond the obvious.
          </p>
        </section>

        {/* Decorative closing line */}
        <div className="about-end-line" aria-hidden="true" />

      </main>
    </>
  );
}
