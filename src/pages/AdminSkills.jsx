import { useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import useSite from "../hooks/useSite";

const EMPTY_FORM = {
  name: "",
  description: "",
  icon: "react",
  category: "Frontend",
};

const ICON_OPTIONS = [
  "html",
  "css",
  "javascript",
  "react",
  "gsap",
  "bootstrap",
  "git",
  "github",
  "nextjs",
  "typescript",
  "tailwind",
  "node",
  "express",
  "mongodb",
  "figma",
  "python",
];

const CATEGORY_OPTIONS = ["Frontend", "Backend", "Tools", "Design", "Other"];

export default function AdminSkills() {
  const { skills, addSkill, updateSkill, deleteSkill } = useSite();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Skill name zaroori hai.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description zaroori hai.");
      return;
    }

    if (editId) {
      updateSkill(editId, {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim().toLowerCase() || "react",
        category: form.category,
      });
      setEditId(null);
    } else {
      addSkill({
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim().toLowerCase() || "react",
        category: form.category,
      });
    }

    setForm(EMPTY_FORM);
    setError("");
    setConfirmDelete(null);
  };

  const startEdit = (skill) => {
    setForm({
      name: skill.name,
      description: skill.description,
      icon: skill.icon || "react",
      category: skill.category || "Frontend",
    });
    setEditId(skill.id);
    setError("");
    setConfirmDelete(null);
    // Scroll form into view if on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
  };

  const handleDelete = (id) => {
    deleteSkill(id);
    setConfirmDelete(null);
    if (editId === id) {
      setEditId(null);
      setForm(EMPTY_FORM);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="PORTFOLIO"
        title="Skills"
        text="Yahan add aur edit kiye hue skills public Skills page par live dikhte hain."
      >
        <span className="adm-pill big">{skills.length} total</span>
      </PageHeader>

      <div className="adm-split">
        {/* Left Form */}
        <form className="adm-card adm-form" onSubmit={handleSubmit}>
          <div className="adm-card-head">
            <h3>{editId ? "Edit Skill" : "New Skill"}</h3>
            {editId && (
              <span className="adm-chip approved">Editing</span>
            )}
          </div>

          <label className="adm-field">
            <span>Skill Name *</span>
            <input
              className="adm-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. React, Next.js, Docker"
              maxLength={40}
            />
          </label>

          <label className="adm-field">
            <span>Category</span>
            <select
              className="adm-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="adm-field">
            <span>Icon</span>
            <select
              className="adm-input"
              name="icon"
              value={form.icon}
              onChange={handleChange}
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="adm-field">
            <span>Custom Icon Key (optional)</span>
            <input
              className="adm-input"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g. tailwind, typescript"
              maxLength={30}
            />
          </label>

          <label className="adm-field">
            <span>Description *</span>
            <textarea
              className="adm-input"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Creating reusable component-based interfaces."
              maxLength={220}
            />
          </label>

          {error && <p className="adm-error">{error}</p>}

          <div className="adm-actions">
            <button type="submit" className="adm-btn">
              <Icon name={editId ? "check" : "plus"} size={16} />
              {editId ? "Update skill" : "Add skill"}
            </button>
            {editId && (
              <button
                type="button"
                className="adm-btn adm-btn-ghost"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Right Skills Grid */}
        <div>
          {skills.length === 0 ? (
            <EmptyState
              icon="skills"
              title="Koi skill nahi mila"
              text="Left side ke form se pehla skill add karein."
            />
          ) : (
            <div className="adm-skills-grid">
              {skills.map((s) => (
                <article
                  className={`adm-skill-item ${editId === s.id ? "editing" : ""}`}
                  key={s.id}
                >
                  <div className="adm-skill-item-header">
                    <div>
                      <h4 className="adm-skill-item-title">{s.name}</h4>
                      <span className="adm-skill-item-cat">{s.category}</span>
                    </div>
                    <span className="adm-skill-item-icon-tag">
                      {s.icon || "default"}
                    </span>
                  </div>

                  <p className="adm-skill-item-desc">{s.description}</p>

                  <div className="adm-card-actions">
                    <button
                      className="adm-btn adm-btn-ghost adm-btn-sm"
                      onClick={() => startEdit(s)}
                    >
                      <Icon name="sliders" size={13} /> Edit
                    </button>

                    {confirmDelete === s.id ? (
                      <div className="adm-actions" style={{ gap: 6 }}>
                        <button
                          className="adm-btn adm-btn-sm adm-btn-danger"
                          onClick={() => handleDelete(s.id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                          onClick={() => setConfirmDelete(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-danger"
                        onClick={() => setConfirmDelete(s.id)}
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    )}
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
