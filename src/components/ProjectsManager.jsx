import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  tech: "",
  link: "",
  image: null, // preview ka URL
};

export default function ProjectsManager() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [projects, setProjects] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, image: URL.createObjectURL(file) });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.link.trim()) return;

    const newProject = {
      id: Date.now(),
      ...form,
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
    };

    setProjects([newProject, ...projects]);
    setForm(EMPTY_FORM);
    e.target.reset();
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <div>
          <p className="admin-label">02 / PROJECTS</p>
          <h2>Projects</h2>
        </div>
        <span className="admin-total">{projects.length} total</span>
      </div>

      <form className="admin-form" onSubmit={handleAdd}>
        <label className="upload-box">
          {form.image ? (
            <img src={form.image} alt="preview" />
          ) : (
            <span>+ Upload project image</span>
          )}
          <input type="file" accept="image/*" onChange={handleImage} hidden />
        </label>

        <input
          name="title"
          placeholder="Project title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          rows="3"
          placeholder="Project details (kya hai, kya kaam karta hai)"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="tech"
          placeholder="Technologies (React, Firebase, GSAP)"
          value={form.tech}
          onChange={handleChange}
        />
        <input
          name="link"
          placeholder="Project link (https://...)"
          value={form.link}
          onChange={handleChange}
        />

        <button type="submit" className="admin-btn">Add Project ↗</button>
      </form>

      {projects.length === 0 ? (
        <p className="admin-empty">Abhi koi project add nahi hua.</p>
      ) : (
        <div className="admin-grid">
          {projects.map((p) => (
            <article key={p.id} className="project-card">
              {p.image && <img src={p.image} alt={p.title} />}
              <h3>{p.title}</h3>
              <p>{p.description}</p>

              <div className="tag-list">
                {p.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="card-actions">
                <a href={p.link} target="_blank" rel="noreferrer">Visit ↗</a>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
