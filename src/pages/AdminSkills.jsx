import { useState } from "react";
import Icon from "../components/Icon";
import useSite from "../hooks/useSite";

const EMPTY_FORM = { name: "", description: "", icon: "", category: "Frontend" };

const ICON_OPTIONS = [
  "html", "css", "javascript", "react", "gsap",
  "bootstrap", "git", "github",
];

const CATEGORY_OPTIONS = ["Frontend", "Backend", "Tools", "Design", "Other"];

export default function AdminSkills() {
  const { skills, addSkill, updateSkill, deleteSkill } = useSite();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      flash("Name aur description required hain.", "error");
      return;
    }

    if (editId) {
      updateSkill(editId, {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim().toLowerCase(),
        category: form.category,
      });
      flash(`"${form.name.trim()}" updated.`);
      setEditId(null);
    } else {
      addSkill({
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim().toLowerCase(),
        category: form.category,
      });
      flash(`"${form.name.trim()}" added.`);
    }

    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const startEdit = (skill) => {
    setForm({
      name: skill.name,
      description: skill.description,
      icon: skill.icon || "",
      category: skill.category || "Frontend",
    });
    setEditId(skill.id);
    setShowForm(true);
    setConfirmDelete(null);
  };

  const handleDelete = (id) => {
    const skill = skills.find((s) => s.id === id);
    deleteSkill(id);
    flash(`"${skill?.name}" deleted.`);
    setConfirmDelete(null);
    if (editId === id) {
      setEditId(null);
      setForm(EMPTY_FORM);
      setShowForm(false);
    }
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="adm-skills">
      {/* Header */}
      <div className="adm-sec-head">
        <div>
          <h3 className="adm-sec-title">Skills Management</h3>
          <p className="adm-sec-sub">{skills.length} skill{skills.length !== 1 ? "s" : ""} saved</p>
        </div>
        {!showForm && (
          <button
            className="adm-btn adm-btn-accent"
            onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
          >
            <Icon name="plus" size={16} /> Add Skill
          </button>
        )}
      </div>

      {/* Flash message */}
      {msg && (
        <div className={`adm-flash ${msg.type === "error" ? "adm-flash--err" : ""}`}>
          {msg.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form className="adm-card adm-skill-form" onSubmit={handleSubmit}>
          <h4>{editId ? "Edit Skill" : "Add New Skill"}</h4>

          <div className="adm-form-grid">
            <div className="adm-field">
              <label htmlFor="skill-name">Name *</label>
              <input
                id="skill-name"
                name="name"
                placeholder="e.g. React"
                value={form.name}
                onChange={handleChange}
                maxLength={40}
              />
            </div>

            <div className="adm-field">
              <label htmlFor="skill-category">Category</label>
              <select
                id="skill-category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="adm-field">
              <label htmlFor="skill-icon">Icon key</label>
              <select
                id="skill-icon"
                name="icon"
                value={form.icon}
                onChange={handleChange}
              >
                <option value="">— select —</option>
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
              <span className="adm-hint">Or type a custom key below</span>
              <input
                name="icon"
                placeholder="custom-icon-key"
                value={form.icon}
                onChange={handleChange}
                maxLength={30}
                style={{ marginTop: 6 }}
              />
            </div>

            <div className="adm-field adm-field--full">
              <label htmlFor="skill-desc">Description *</label>
              <textarea
                id="skill-desc"
                name="description"
                placeholder="Short description of this skill..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                maxLength={200}
              />
            </div>
          </div>

          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn-accent">
              <Icon name="check" size={16} /> {editId ? "Update" : "Save"}
            </button>
            <button type="button" className="adm-btn" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Skills list */}
      {skills.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>No skills yet. Click "Add Skill" to get started.</p>
        </div>
      ) : (
        <div className="adm-skills-list">
          {skills.map((skill) => (
            <div className="adm-card adm-skill-row" key={skill.id}>
              <div className="adm-skill-info">
                <strong>{skill.name}</strong>
                <span className="adm-skill-cat">{skill.category}</span>
                <p>{skill.description}</p>
              </div>

              <div className="adm-skill-actions">
                <button
                  className="adm-btn adm-btn-sm"
                  onClick={() => startEdit(skill)}
                  title="Edit"
                >
                  Edit
                </button>
                {confirmDelete === skill.id ? (
                  <>
                    <button
                      className="adm-btn adm-btn-sm adm-btn-danger"
                      onClick={() => handleDelete(skill.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="adm-btn adm-btn-sm"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="adm-btn adm-btn-sm adm-btn-danger-outline"
                    onClick={() => setConfirmDelete(skill.id)}
                    title="Delete"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
