import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSite from "../hooks/useSite";
import "../styles/Projects.css";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   HORIZONTAL PIN SCROLL — each project panel
   is 100vw × 100vh, slides in from the right
   as the user scrolls down the page.
───────────────────────────────────────────── */
export default function ProjectsSection() {
  const { projects } = useSite();
  const sectionRef  = useRef(null);   // outer pinning wrapper
  const trackRef    = useRef(null);   // inner horizontal track
  const headRef     = useRef(null);   // section heading

  /* ── Section heading entrance ── */
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        head.querySelectorAll(".proj-kicker, .proj-heading, .proj-sub"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: head,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, head);

    return () => ctx.revert();
  }, []);

  /* ── Horizontal pinned scroll ── */
  useEffect(() => {
    if (!projects.length) return;

    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    // Amount to scroll: total width of track minus one viewport width
    const getScrollAmount = () =>
      -(track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      /* Pin the section and scroll the track horizontally */
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* Individual panel reveal — each panel fades + slides in from right */
      const panels = track.querySelectorAll(".proj-panel");
      panels.forEach((panel, i) => {
        if (i === 0) return; // first panel is already visible
        gsap.fromTo(
          panel,
          { opacity: 0.3, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 85%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });

      /* Panel number counter animation */
      const counters = track.querySelectorAll(".proj-panel-num");
      counters.forEach((counter, i) => {
        gsap.fromTo(
          counter,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: counter.closest(".proj-panel"),
              containerAnimation: tween,
              start: "left 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [projects]);

  /* ─── Empty state ─── */
  if (projects.length === 0) {
    return (
      <section className="proj-empty-section" id="projects">
        <div className="proj-container">
          <div className="proj-head" ref={headRef}>
            <p className="proj-kicker">SELECTED WORK</p>
            <h2 className="proj-heading">
              Projects<span className="proj-accent">.</span>
            </h2>
          </div>
          <div className="proj-empty">
            <div className="proj-empty-icon">🚀</div>
            <p>Projects jaldi aa rahe hain.</p>
            <span>Check back soon!</span>
          </div>
        </div>
      </section>
    );
  }

  /* ─── Main horizontal scroll layout ─── */
  return (
    <div id="projects">
      {/* ── Sticky section label (above the pinned area) ── */}
      <div className="proj-label-bar" ref={headRef}>
        <div className="proj-label-inner">
          <p className="proj-kicker">SELECTED WORK</p>
          <div className="proj-label-right">
            <h2 className="proj-heading">
              Projects<span className="proj-accent">.</span>
            </h2>
            <p className="proj-sub">
              Scroll to explore →
            </p>
          </div>
        </div>
      </div>

      {/* ── Pinned horizontal scroll zone ── */}
      <section className="proj-section" ref={sectionRef}>
        <div className="proj-track" ref={trackRef}>
          {projects.map((p, i) => (
            <article className="proj-panel" key={p.id}>
              {/* Left: info */}
              <div className="proj-panel-info">
                <span className="proj-panel-num">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>

                <h3 className="proj-panel-title">{p.title}</h3>

                {p.description && (
                  <p className="proj-panel-desc">{p.description}</p>
                )}

                {p.tech?.length > 0 && (
                  <div className="proj-tags">
                    {p.tech.map((t) => (
                      <span key={t} className="proj-tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="proj-panel-links">
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-link-primary"
                    >
                      Live Demo
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-link-ghost"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              {/* Right: image */}
              <div className="proj-panel-visual">
                {p.image ? (
                  <a
                    href={p.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-panel-img-link"
                    aria-label={`Open ${p.title}`}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="proj-panel-img"
                    />
                    <div className="proj-panel-img-overlay">
                      <span>↗</span>
                    </div>
                  </a>
                ) : (
                  <div className="proj-panel-placeholder">
                    <span>{p.title.charAt(0)}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
