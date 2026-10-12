import useSite from "../hooks/useSite";

// Public website: #projects  (data admin panel ke Projects page se aata hai)
export default function ProjectsSection() {
  const { projects } = useSite();

  return (
    <section className="sec" id="projects">
      <p className="sec-kicker">SELECTED WORK</p>
      <h2 className="sec-title">Projects<span>.</span></h2>

      {projects.length === 0 ? (
        <p className="sec-empty">Projects jaldi aa rahe hain.</p>
      ) : (
        <div className="sec-grid">
          {projects.map((p) => (
            <article className="sec-project" key={p.id}>
              {p.image && <img src={p.image} alt={p.title} />}

              <div className="sec-project-body">
                <h3>{p.title}</h3>
                {p.description && <p>{p.description}</p>}

                <div className="sec-tags">
                  {p.tech.map((t) => <span key={t}>{t}</span>)}
                </div>

                <div className="sec-links">
                  <a href={p.link} target="_blank" rel="noreferrer">Live ↗</a>
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
