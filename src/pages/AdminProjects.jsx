import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import useSite from "../hooks/useSite";
import imageToDataUrl from "../utils/imageToDataUrl";
import { withProtocol } from "../utils/format";

const EMPTY_FORM = { title: "", description: "", tech: "", link: "", github: "" };

// /adminpanel/projects
export default function AdminProjects() {
  const { projects, addProject, deleteProject } = useSite();

  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState("");
  const [fileKey, setFileKey] = useState(0); // file input ko reset karne ke liye
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Sirf image file chunein.");
      return;
    }

    setError("");
    setImage(await imageToDataUrl(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.link.trim()) {
      setError("Title aur project link zaroori hain.");
      return;
    }

    addProject({
      title: form.title.trim(),
      description: form.description.trim(),
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      link: withProtocol(form.link),
      github: form.github.trim() ? withProtocol(form.github) : "",
      image,
    });

    setForm(EMPTY_FORM);
    setImage("");
    setFileKey(fileKey + 1);
    setError("");
  };

  return (
    <>
      <PageHeader
        eyebrow="PORTFOLIO"
        title="Projects"
        text="Yahan add kiye hue projects seedha website ke Projects section mein dikhte hain."
      >
        <span className="adm-pill big">{projects.length} total</span>
      </PageHeader>

      <div className="adm-split">
        <form className="adm-card adm-form" onSubmit={handleSubmit}>
          <div className="adm-card-head">
            <h3>New project</h3>
          </div>

          <label className="adm-upload">
            {image ? (
              <img src={image} alt="Project preview" />
            ) : (
              <>
                <Icon name="image" size={28} />
                <span>Upload project image</span>
                <small>PNG, JPG ya WEBP</small>
              </>
            )}
            <input key={fileKey} type="file" accept="image/*" onChange={handleImage} hidden />
          </label>

          <label className="adm-field">
            <span>Title *</span>
            <input className="adm-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Portfolio Website" maxLength={60} />
          </label>

          <label className="adm-field">
            <span>Details</span>
            <textarea className="adm-input" name="description" rows="4" value={form.description} onChange={handleChange} placeholder="Project kya hai aur kya kaam karta hai" maxLength={300} />
          </label>

          <label className="adm-field">
            <span>Technologies</span>
            <input className="adm-input" name="tech" value={form.tech} onChange={handleChange} placeholder="React, Firebase, GSAP" />
          </label>

          <label className="adm-field">
            <span>Live link *</span>
            <input className="adm-input" name="link" value={form.link} onChange={handleChange} placeholder="https://myproject.com" />
          </label>

          <label className="adm-field">
            <span>GitHub link</span>
            <input className="adm-input" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
          </label>

          {error && <p className="adm-error">{error}</p>}

          <button type="submit" className="adm-btn">
            <Icon name="plus" size={16} /> Add project
          </button>
        </form>

        <div>
          {projects.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="Abhi koi project nahi"
              text="Left side ka form bharo, project card yahan aur website par aa jayega."
            />
          ) : (
            <div className="adm-projects">
              {projects.map((p) => (
                <article className="adm-project" key={p.id}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div className="adm-project-noimg"><Icon name="image" size={26} /></div>
                  )}

                  <div className="adm-project-body">
                    <h3>{p.title}</h3>
                    {p.description && <p>{p.description}</p>}

                    <div className="adm-tags">
                      {p.tech.map((t) => <span key={t}>{t}</span>)}
                    </div>

                    <div className="adm-card-actions">
                      <a className="adm-link-text" href={p.link} target="_blank" rel="noreferrer">
                        Visit ↗
                      </a>
                      <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-danger" onClick={() => deleteProject(p.id)}>
                        <Icon name="trash" size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
