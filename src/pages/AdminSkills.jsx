import { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import useSite from "../hooks/useSite";
import { scanCode } from "../utils/codeScanner";

const EMPTY_FORM = {
  name: "",
  description: "",
  icon: "react",
  category: "Frontend",
  createdDate: "",
  purpose: "",
  code: "",
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

  const scanResult = useMemo(() => {
    return scanCode(form.code, form.name, form.category);
  }, [form.code, form.name, form.category]);

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
      setError("Short description zaroori hai.");
      return;
    }

    if (!form.code.trim()) {
      setError("Coding snippet zaroori hai.");
      return;
    }

    // Strict validation: Agar code kisi doosri skill ka hai to submit block karein
    if (!scanResult.matches || scanResult.status === "warning") {
      setError(
        `Code Mismatch Error: ${scanResult.message} Sahi code enter karein ya skill name theek karein, yeh submit nahi ho sakta.`
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      icon: form.icon.trim().toLowerCase() || "react",
      category: form.category,
      createdDate: form.createdDate.trim() || "History date not specified",
      purpose: form.purpose.trim() || form.description.trim(),
      code: form.code.trim(),
    };

    if (editId) {
      updateSkill(editId, payload);
      setEditId(null);
    } else {
      addSkill(payload);
    }

    setForm(EMPTY_FORM);
    setError("");
    setConfirmDelete(null);
  };

  const startEdit = (skill) => {
    setForm({
      name: skill.name || "",
      description: skill.description || "",
      icon: skill.icon || "react",
      category: skill.category || "Frontend",
      createdDate: skill.createdDate || "",
      purpose: skill.purpose || "",
      code: skill.code || "",
    });
    setEditId(skill.id);
    setError("");
    setConfirmDelete(null);
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
        title="Skills & Code Engine"
        text="Yahan skills, origin details aur coding snippets manage karein. Admin scanner code ko automatically verify karega."
      >
        <span className="adm-pill big">{skills.length} total</span>
      </PageHeader>

      <div className="adm-split">
        {/* Left Form */}
        <form className="adm-card adm-form" onSubmit={handleSubmit}>
          <div className="adm-card-head">
            <h3>{editId ? "Edit Skill & Code" : "New Skill & Code"}</h3>
            {editId && <span className="adm-chip approved">Editing ID #{editId}</span>}
          </div>

          <label className="adm-field">
            <span>Skill Name *</span>
            <input
              className="adm-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. React, Express, Python Backend"
              maxLength={40}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
          </div>

          <label className="adm-field">
            <span>Creation / History Date (Kese aur kab bani)</span>
            <input
              className="adm-input"
              name="createdDate"
              value={form.createdDate}
              onChange={handleChange}
              placeholder="e.g. 1995 by Brendan Eich / May 2013 by Jordan Walke"
              maxLength={80}
            />
          </label>

          <label className="adm-field">
            <span>Purpose (Kis liye use hoti he)</span>
            <textarea
              className="adm-input"
              name="purpose"
              rows="2"
              value={form.purpose}
              onChange={handleChange}
              placeholder="e.g. Building component-driven interactive web applications..."
              maxLength={260}
            />
          </label>

          <label className="adm-field">
            <span>Short Card Description *</span>
            <input
              className="adm-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Creating reusable component-based interfaces."
              maxLength={120}
            />
          </label>

          {/* Coding Snippet Textarea */}
          <label className="adm-field">
            <span>Coding Snippet (Shutter drawer mein display hoga) *</span>
            <textarea
              className="adm-input adm-code-editor-input"
              name="code"
              rows="7"
              value={form.code}
              onChange={handleChange}
              placeholder={`// Paste your ${form.name || form.category} code here...\nfunction example() {\n  return "clean code";\n}`}
              spellCheck="false"
            />
          </label>

          {/* Live Code Scanner Result Box */}
          {form.code.trim() && (
            <div
              className={`adm-scanner-box ${
                scanResult.status === "success"
                  ? "adm-scanner-success"
                  : scanResult.status === "warning"
                  ? "adm-scanner-warning"
                  : "adm-scanner-neutral"
              }`}
            >
              <div className="adm-scanner-top">
                <div className="adm-scanner-title">
                  <span className="adm-scanner-dot" />
                  <strong>AI Code Scanner</strong>
                </div>
                {scanResult.detectedLang && (
                  <span className="adm-scanner-badge">
                    {scanResult.detectedLang} ({scanResult.confidence}%)
                  </span>
                )}
              </div>

              <p className="adm-scanner-msg">{scanResult.message}</p>

              {scanResult.keywordsFound?.length > 0 && (
                <div className="adm-scanner-keywords">
                  <span>Detected patterns:</span>
                  {scanResult.keywordsFound.map((kw, i) => (
                    <span key={i} className="adm-keyword-pill">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <p className="adm-error">{error}</p>}

          <div className="adm-actions">
            <button
              type="submit"
              className="adm-btn"
              style={
                !scanResult.matches && form.code.trim()
                  ? { opacity: 0.65 }
                  : {}
              }
              title={
                !scanResult.matches && form.code.trim()
                  ? "Code mismatch detected - please correct code to submit"
                  : ""
              }
            >
              <Icon name={editId ? "check" : "plus"} size={16} />
              {editId ? "Update skill & code" : "Add skill & code"}
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
              text="Left side ke form se pehla skill aur coding add karein."
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

                  {s.createdDate && (
                    <div className="adm-skill-meta-row">
                      <small>📅 {s.createdDate}</small>
                    </div>
                  )}

                  {/* Code snippet mini-preview */}
                  <div className="adm-skill-code-peek">
                    <div className="adm-skill-code-peek-bar">
                      <span>CODE PREVIEW</span>
                      <small>{s.code?.split("\n").length || 0} lines</small>
                    </div>
                    <pre className="adm-skill-code-peek-text">
                      {s.code ? s.code.slice(0, 160) + (s.code.length > 160 ? "..." : "") : "// No code"}
                    </pre>
                  </div>

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
