import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import useSite from "../hooks/useSite";
import imageToDataUrl from "../utils/imageToDataUrl";
import { withProtocol } from "../utils/format";

const VISUAL_OPTIONS = [
  { value: "projects", label: "Projects Showcase (Interactive Cards)" },
  { value: "code", label: "Code Editor Art (HTML/CSS Inspect)" },
  { value: "logic", label: "Logic & Fetch Async Snippet (JavaScript)" },
  { value: "techwiz", label: "Techwiz International Globe (Competition)" },
  { value: "future", label: "Constellation Learning Map (Future Stack)" },
  { value: "image", label: "Custom Project Screenshot / Uploaded Image" },
];

const JOURNEY_COLOR_PRESETS = [
  {
    name: "Antique Gold & Burgundy (Default)",
    accent: "#B99A68",
    bg: "#211416",
    text: "#E8DFD0",
  },
  {
    name: "Obsidian & Cyber Lime",
    accent: "#d5f278",
    bg: "#080909",
    text: "#f5f5f0",
  },
  {
    name: "Midnight Sapphire",
    accent: "#38bdf8",
    bg: "#0b1120",
    text: "#f1f5f9",
  },
  {
    name: "Emerald Forest",
    accent: "#10b981",
    bg: "#061a14",
    text: "#ecfdf5",
  },
  {
    name: "Rose Gold Luxury",
    accent: "#fb7185",
    bg: "#1c0d12",
    text: "#fff1f2",
  },
];

const EMPTY_CHAPTER = {
  num: "",
  kicker: "",
  title: "",
  subtitle: "",
  period: "",
  desc: "",
  tagsString: "",
  visual: "projects",
  image: "",
  projectUrl: "",
  achievement: "",
  published: true,
};

function ColorField({ label, value, onChange }) {
  const [draft, setDraft] = useState(null);

  const handleText = (e) => {
    const text = e.target.value;
    setDraft(text);
    if (/^#[0-9a-f]{6}$/i.test(text)) onChange(text.toLowerCase());
  };

  return (
    <div className="adm-color">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
      <div>
        <span>{label}</span>
        <input
          className="adm-hex"
          value={draft ?? value}
          onChange={handleText}
          onBlur={() => setDraft(null)}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function AdminJourney() {
  const {
    projects,
    journeyData,
    updateJourneyHero,
    addJourneyChapter,
    updateJourneyChapter,
    deleteJourneyChapter,
    reorderJourneyChapters,
    updateJourneyDesign,
    updateJourneyClosing,
    resetJourneyData,
  } = useSite();

  const [activeTab, setActiveTab] = useState("chapters");
  const [toast, setToast] = useState(null);

  // Chapter editing/creation state
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterForm, setChapterForm] = useState(EMPTY_CHAPTER);
  const [chapterError, setChapterError] = useState("");
  const [fileKey, setFileKey] = useState(0);

  // Modals
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chapter: null });
  const [resetModal, setResetModal] = useState(false);

  // Local state for Hero, Design, Closing forms to allow draft edits before save
  const [heroForm, setHeroForm] = useState(journeyData?.hero || {});
  const [designForm, setDesignForm] = useState(journeyData?.design || {});
  const [closingForm, setClosingForm] = useState(journeyData?.closing || {});

  // Sync draft forms if journeyData updates outside
  useEffect(() => {
    if (journeyData?.hero) setHeroForm(journeyData.hero);
  }, [journeyData?.hero]);

  useEffect(() => {
    if (journeyData?.design) setDesignForm(journeyData.design);
  }, [journeyData?.design]);

  useEffect(() => {
    if (journeyData?.closing) setClosingForm(journeyData.closing);
  }, [journeyData?.closing]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  /* ---------- CHAPTER HANDLERS ---------- */
  const handleOpenAddChapter = () => {
    const nextIndex = (journeyData?.chapters?.length || 0) + 1;
    const nextNum = String(nextIndex).padStart(2, "0");
    setChapterForm({
      ...EMPTY_CHAPTER,
      num: nextNum,
      kicker: `${nextNum} — Milestone`,
    });
    setEditingChapterId(null);
    setChapterError("");
    setShowChapterForm(true);
    setFileKey((prev) => prev + 1);
  };

  const handleEditChapter = (ch) => {
    setChapterForm({
      num: ch.num || "",
      kicker: ch.kicker || "",
      title: ch.title || "",
      subtitle: ch.subtitle || "",
      period: ch.period || "",
      desc: ch.desc || "",
      tagsString: Array.isArray(ch.tags) ? ch.tags.join(", ") : "",
      visual: ch.visual || "code",
      image: ch.image || "",
      projectUrl: ch.projectUrl || "",
      achievement: ch.achievement || "",
      published: ch.published !== false,
    });
    setEditingChapterId(ch.id);
    setChapterError("");
    setShowChapterForm(true);
    setFileKey((prev) => prev + 1);
  };

  const handleCancelChapterForm = () => {
    setShowChapterForm(false);
    setEditingChapterId(null);
    setChapterForm(EMPTY_CHAPTER);
    setChapterError("");
  };

  const handleChapterImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setChapterError("Please choose an image file (PNG, JPG, WebP).");
      return;
    }

    try {
      const dataUrl = await imageToDataUrl(file);
      setChapterForm((prev) => ({
        ...prev,
        image: dataUrl,
        visual: prev.visual === "image" ? prev.visual : "image",
      }));
      setChapterError("");
    } catch {
      setChapterError("Failed to process image. Try a smaller image.");
    }
  };

  const handleRemoveChapterImage = () => {
    setChapterForm((prev) => ({ ...prev, image: "" }));
    setFileKey((prev) => prev + 1);
  };

  const handleSaveChapter = (e) => {
    e.preventDefault();

    if (!chapterForm.title.trim()) {
      setChapterError("Chapter title is required.");
      return;
    }

    if (!chapterForm.desc.trim()) {
      setChapterError("Chapter description is required.");
      return;
    }

    const tags = chapterForm.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      num: chapterForm.num.trim() || "01",
      kicker: chapterForm.kicker.trim() || `${chapterForm.num} — Milestone`,
      title: chapterForm.title.trim(),
      subtitle: chapterForm.subtitle.trim(),
      period: chapterForm.period.trim(),
      desc: chapterForm.desc.trim(),
      tags,
      visual: chapterForm.visual,
      image: chapterForm.image,
      projectUrl: chapterForm.projectUrl.trim()
        ? withProtocol(chapterForm.projectUrl.trim())
        : "",
      achievement: chapterForm.achievement.trim(),
      published: chapterForm.published,
    };

    if (editingChapterId) {
      updateJourneyChapter(editingChapterId, payload);
      showToast(`Chapter "${payload.title}" updated successfully!`);
    } else {
      addJourneyChapter(payload);
      showToast(`New chapter "${payload.title}" added to your Journey!`);
    }

    setShowChapterForm(false);
    setEditingChapterId(null);
    setChapterForm(EMPTY_CHAPTER);
    setChapterError("");
  };

  const handleTogglePublished = (ch) => {
    const nextState = !ch.published;
    updateJourneyChapter(ch.id, { published: nextState });
    showToast(
      `Chapter "${ch.title}" is now ${nextState ? "published" : "hidden"} on the public Journey.`
    );
  };

  const handleMoveChapter = (index, direction) => {
    const list = [...(journeyData?.chapters || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    reorderJourneyChapters(list);
    showToast("Chapter order updated.");
  };

  const confirmDeleteChapter = () => {
    if (!deleteModal.chapter) return;
    deleteJourneyChapter(deleteModal.chapter.id);
    showToast(`Chapter "${deleteModal.chapter.title}" has been deleted.`);
    setDeleteModal({ isOpen: false, chapter: null });
  };

  /* ---------- HERO SECTION SAVE ---------- */
  const handleSaveHero = (e) => {
    e.preventDefault();
    updateJourneyHero(heroForm);
    showToast("Journey Hero section updated successfully!");
  };

  /* ---------- DESIGN SETTINGS SAVE ---------- */
  const handleSaveDesign = (e) => {
    e.preventDefault();
    updateJourneyDesign(designForm);
    showToast("Journey Design settings updated successfully!");
  };

  const applyColorPreset = (preset) => {
    setDesignForm((prev) => ({
      ...prev,
      accent: preset.accent,
      bg: preset.bg,
      text: preset.text,
    }));
    updateJourneyDesign({
      accent: preset.accent,
      bg: preset.bg,
      text: preset.text,
    });
    showToast(`Applied preset: ${preset.name}`);
  };

  /* ---------- CLOSING SECTION SAVE ---------- */
  const handleSaveClosing = (e) => {
    e.preventDefault();
    updateJourneyClosing(closingForm);
    showToast("Closing CTA section updated successfully!");
  };

  /* ---------- RESET TO DEFAULTS ---------- */
  const handleConfirmReset = () => {
    resetJourneyData();
    setResetModal(false);
    showToast("Journey has been reset to original default settings & content.");
  };

  const chaptersList = journeyData?.chapters || [];

  return (
    <>
      <PageHeader
        eyebrow="PORTFOLIO EXPERIENCE"
        title="Journey Management"
        text="Manage your entire public Developer Journey: customize Hero copy, timeline chapters, bespoke color schemes, and closing CTA."
      >
        <div className="adm-actions">
          <a
            href="/journey"
            target="_blank"
            rel="noreferrer"
            className="adm-btn adm-btn-ghost adm-btn-sm"
          >
            <Icon name="external" size={14} />
            Preview Journey ↗
          </a>
          <button
            className="adm-btn adm-btn-ghost adm-btn-sm"
            onClick={() => setResetModal(true)}
            title="Reset all Journey content and design to original defaults"
          >
            <Icon name="refresh" size={14} />
            Reset Defaults
          </button>
        </div>
      </PageHeader>

      {/* Global Toast / Notice */}
      {toast && (
        <div className={`adm-notice-banner ${toast.type}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon name={toast.type === "success" ? "check" : "x"} size={16} />
            <span>{toast.message}</span>
          </div>
          <button
            className="adm-notice-dismiss"
            onClick={() => setToast(null)}
            aria-label="Dismiss notice"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="adm-tabs" aria-label="Journey management sections">
        <button
          className={`adm-tab-btn ${activeTab === "chapters" ? "active" : ""}`}
          onClick={() => setActiveTab("chapters")}
        >
          <Icon name="layers" size={16} />
          Chapters Timeline
          <span className="adm-tab-badge">{chaptersList.length}</span>
        </button>

        <button
          className={`adm-tab-btn ${activeTab === "hero" ? "active" : ""}`}
          onClick={() => setActiveTab("hero")}
        >
          <Icon name="sparkles" size={16} />
          Hero Section
        </button>

        <button
          className={`adm-tab-btn ${activeTab === "design" ? "active" : ""}`}
          onClick={() => setActiveTab("design")}
        >
          <Icon name="palette" size={16} />
          Design & Colors
        </button>

        <button
          className={`adm-tab-btn ${activeTab === "closing" ? "active" : ""}`}
          onClick={() => setActiveTab("closing")}
        >
          <Icon name="sliders" size={16} />
          Closing Section
        </button>
      </nav>

      {/* ══════════════════════════════════════════════
          TAB 1: CHAPTERS TIMELINE
          ══════════════════════════════════════════════ */}
      {activeTab === "chapters" && (
        <div className="adm-stack">
          {showChapterForm ? (
            <form className="adm-card adm-form" onSubmit={handleSaveChapter}>
              <div className="adm-card-head">
                <h3>{editingChapterId ? "Edit Journey Chapter" : "New Journey Chapter"}</h3>
                <span className="adm-muted">
                  Fill in the details below. Chapter 03 &amp; custom chapters will render seamlessly.
                </span>
              </div>

              {chapterError && (
                <div className="adm-notice-banner error">
                  <Icon name="x" size={16} />
                  <span>{chapterError}</span>
                </div>
              )}

              <div className="adm-two">
                <label className="adm-field">
                  <span>Chapter Number (e.g. 01, 02, 03) *</span>
                  <input
                    className="adm-input"
                    value={chapterForm.num}
                    onChange={(e) => setChapterForm({ ...chapterForm, num: e.target.value })}
                    placeholder="01"
                    maxLength={4}
                  />
                </label>

                <label className="adm-field">
                  <span>Subtitle / Kicker (e.g. 03 — Building Real Products)</span>
                  <input
                    className="adm-input"
                    value={chapterForm.kicker}
                    onChange={(e) => setChapterForm({ ...chapterForm, kicker: e.target.value })}
                    placeholder="03 — Building Real Products"
                    maxLength={60}
                  />
                </label>
              </div>

              <div className="adm-two">
                <label className="adm-field">
                  <span>Chapter Title *</span>
                  <input
                    className="adm-input"
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    placeholder="e.g. Turning Ideas into Products"
                    maxLength={80}
                  />
                </label>

                <label className="adm-field">
                  <span>Date or Period (optional, e.g. 2023 - 2024)</span>
                  <input
                    className="adm-input"
                    value={chapterForm.period}
                    onChange={(e) => setChapterForm({ ...chapterForm, period: e.target.value })}
                    placeholder="e.g. 2023 - 2024"
                    maxLength={30}
                  />
                </label>
              </div>

              <label className="adm-field">
                <span>Story &amp; Description *</span>
                <textarea
                  className="adm-input"
                  rows={4}
                  value={chapterForm.desc}
                  onChange={(e) => setChapterForm({ ...chapterForm, desc: e.target.value })}
                  placeholder="Detail the challenges, technical learnings, and what made this phase significant in your evolution..."
                  maxLength={600}
                />
              </label>

              <label className="adm-field">
                <span>Technologies / Tags (comma separated)</span>
                <input
                  className="adm-input"
                  value={chapterForm.tagsString}
                  onChange={(e) => setChapterForm({ ...chapterForm, tagsString: e.target.value })}
                  placeholder="React, GSAP, Firebase, Vite, CSS"
                />
              </label>

              <div className="adm-two">
                <label className="adm-field">
                  <span>Visual Style</span>
                  <select
                    className="adm-input"
                    value={chapterForm.visual}
                    onChange={(e) => setChapterForm({ ...chapterForm, visual: e.target.value })}
                  >
                    {VISUAL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="adm-field">
                  <span>Achievement Badge (optional milestone badge)</span>
                  <input
                    className="adm-input"
                    value={chapterForm.achievement}
                    onChange={(e) => setChapterForm({ ...chapterForm, achievement: e.target.value })}
                    placeholder="e.g. Shipped FurCare, 1st Place Winner"
                    maxLength={40}
                  />
                </label>
              </div>

              <div className="adm-two">
                <label className="adm-field">
                  <span>External Project URL (optional link)</span>
                  <input
                    className="adm-input"
                    value={chapterForm.projectUrl}
                    onChange={(e) => setChapterForm({ ...chapterForm, projectUrl: e.target.value })}
                    placeholder="https://example.com/project"
                  />
                </label>

                <label className="adm-field">
                  <span>Link with Existing Portfolio Project</span>
                  <select
                    className="adm-input"
                    onChange={(e) => {
                      const selected = projects.find((p) => String(p.id) === e.target.value);
                      if (selected) {
                        setChapterForm((prev) => ({
                          ...prev,
                          projectUrl: selected.link || selected.github || prev.projectUrl,
                          image: selected.image || prev.image,
                          achievement: selected.title ? `Featured: ${selected.title}` : prev.achievement,
                        }));
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose from your existing projects...
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Image Upload Area */}
              <div className="adm-field">
                <span>Chapter Screenshot or Image (Optional)</span>
                {chapterForm.image ? (
                  <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
                    <img
                      src={chapterForm.image}
                      alt="Chapter visual preview"
                      style={{ width: "100%", maxHeight: "240px", objectFit: "cover", display: "block" }}
                    />
                    <button
                      type="button"
                      className="adm-btn adm-btn-danger adm-btn-sm"
                      style={{ position: "absolute", top: "12px", right: "12px" }}
                      onClick={handleRemoveChapterImage}
                    >
                      <Icon name="trash" size={14} /> Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="adm-upload">
                    <Icon name="image" size={28} />
                    <span>Upload chapter screenshot or artwork</span>
                    <small>Compressed automatically to preserve fast loading</small>
                    <input
                      key={fileKey}
                      type="file"
                      accept="image/*"
                      onChange={handleChapterImageUpload}
                      hidden
                    />
                  </label>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="adm-toggle-row">
                <div className="adm-toggle-info">
                  <span className="adm-toggle-title">Publish on Public Journey</span>
                  <span className="adm-toggle-sub">
                    When active, this chapter appears in the timeline on your portfolio.
                  </span>
                </div>
                <label className="adm-switch">
                  <input
                    type="checkbox"
                    checked={chapterForm.published}
                    onChange={(e) => setChapterForm({ ...chapterForm, published: e.target.checked })}
                  />
                  <span className="adm-switch-slider" />
                </label>
              </div>

              <div className="adm-actions" style={{ marginTop: "12px" }}>
                <button type="submit" className="adm-btn">
                  <Icon name="check" size={16} />
                  {editingChapterId ? "Update Chapter" : "Create Chapter"}
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-ghost"
                  onClick={handleCancelChapterForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "600" }}>Timeline Chapters</h3>
                  <p className="adm-muted">
                    Reorder, edit, hide or add chapters. Chapter 03 &quot;Turning Ideas into Products&quot; is fully editable below.
                  </p>
                </div>
                <button className="adm-btn" onClick={handleOpenAddChapter}>
                  <Icon name="plus" size={16} /> Add New Chapter
                </button>
              </div>

              {chaptersList.length === 0 ? (
                <EmptyState
                  title="No chapters yet"
                  text="Add your first milestone or click 'Reset Defaults' to load the standard developer journey."
                />
              ) : (
                <div className="adm-chapter-list">
                  {chaptersList.map((ch, index) => (
                    <div
                      key={ch.id}
                      className={`adm-chapter-item ${ch.published === false ? "hidden-chapter" : ""}`}
                    >
                      {/* Order Controls */}
                      <div className="adm-chapter-order-btns">
                        <button
                          type="button"
                          className="adm-order-btn"
                          disabled={index === 0}
                          onClick={() => handleMoveChapter(index, -1)}
                          title="Move chapter up"
                        >
                          <Icon name="arrowUp" size={12} />
                        </button>
                        <button
                          type="button"
                          className="adm-order-btn"
                          disabled={index === chaptersList.length - 1}
                          onClick={() => handleMoveChapter(index, 1)}
                          title="Move chapter down"
                        >
                          <Icon name="arrowDown" size={12} />
                        </button>
                      </div>

                      {/* Number */}
                      <div className="adm-chapter-num-badge">{ch.num}</div>

                      {/* Thumbnail or Icon */}
                      <div className="adm-chapter-thumb">
                        {ch.image ? (
                          <img src={ch.image} alt={ch.title} />
                        ) : (
                          <span>{ch.visual || "code"}</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="adm-chapter-details">
                        <div className="adm-chapter-topline">
                          <span className="adm-chapter-kicker-tag">{ch.kicker}</span>
                          {ch.period && (
                            <span className="adm-chapter-period-tag">{ch.period}</span>
                          )}
                          {ch.achievement && (
                            <span className="adm-keyword-pill">{ch.achievement}</span>
                          )}
                          {ch.id === "ch-03" && (
                            <span className="adm-tab-badge" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                              Chapter 03
                            </span>
                          )}
                        </div>

                        <div className="adm-chapter-title-text">{ch.title}</div>

                        <p className="adm-list-sub" style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0", maxWidth: "600px" }}>
                          {ch.desc?.slice(0, 110)}
                          {ch.desc?.length > 110 ? "..." : ""}
                        </p>

                        {ch.tags && ch.tags.length > 0 && (
                          <div className="adm-chapter-tags-summary">
                            {ch.tags.map((t) => (
                              <span key={t} className="adm-chapter-tag-pill">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="adm-chapter-actions">
                        <button
                          type="button"
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                          onClick={() => handleTogglePublished(ch)}
                          title={ch.published !== false ? "Hide chapter" : "Publish chapter"}
                        >
                          <Icon name={ch.published !== false ? "eye" : "eyeOff"} size={14} />
                          {ch.published !== false ? "Visible" : "Hidden"}
                        </button>

                        <button
                          type="button"
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                          onClick={() => handleEditChapter(ch)}
                          title="Edit chapter content"
                        >
                          <Icon name="edit" size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="adm-btn adm-btn-ghost adm-btn-danger adm-btn-sm"
                          onClick={() => setDeleteModal({ isOpen: true, chapter: ch })}
                          title="Delete chapter"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 2: HERO SECTION
          ══════════════════════════════════════════════ */}
      {activeTab === "hero" && (
        <div className="adm-split wide">
          <form className="adm-card adm-form" onSubmit={handleSaveHero}>
            <div className="adm-card-head">
              <h3>Hero Editorial Typography &amp; Content</h3>
              <span className="adm-muted">Customise the high-impact opening of the Journey page.</span>
            </div>

            <label className="adm-field">
              <span>Small Label / Eyebrow Text</span>
              <input
                className="adm-input"
                value={heroForm.badge || ""}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                placeholder="THE EVOLUTION OF A DEVELOPER"
              />
            </label>

            <div className="adm-two">
              <label className="adm-field">
                <span>Main Heading (Line 1) *</span>
                <input
                  className="adm-input"
                  value={heroForm.titleLine1 || ""}
                  onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                  placeholder="Every Line of Code"
                />
              </label>

              <label className="adm-field">
                <span>Main Heading (Line 2 Prefix) *</span>
                <input
                  className="adm-input"
                  value={heroForm.titleLine2 || ""}
                  onChange={(e) => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                  placeholder="Built a Part of"
                />
              </label>
            </div>

            <label className="adm-field">
              <span>Highlighted Word (Accent Colour) *</span>
              <input
                className="adm-input"
                value={heroForm.titleHighlight || ""}
                onChange={(e) => setHeroForm({ ...heroForm, titleHighlight: e.target.value })}
                placeholder="Me."
              />
            </label>

            <label className="adm-field">
              <span>Introductory Description Paragraph</span>
              <textarea
                className="adm-input"
                rows={4}
                value={heroForm.intro || ""}
                onChange={(e) => setHeroForm({ ...heroForm, intro: e.target.value })}
                placeholder="This isn't a résumé. It's a story..."
              />
            </label>

            <label className="adm-field">
              <span>Supporting Subtext (Optional)</span>
              <input
                className="adm-input"
                value={heroForm.supportingText || ""}
                onChange={(e) => setHeroForm({ ...heroForm, supportingText: e.target.value })}
                placeholder="Interactive Developer Odyssey"
              />
            </label>

            <h4 style={{ fontSize: "14px", fontWeight: "600", marginTop: "12px" }}>
              Visibility Controls
            </h4>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Eyebrow Badge</span>
                <span className="adm-toggle-sub">Pill badge above the main title</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={heroForm.showBadge !== false}
                  onChange={(e) => setHeroForm({ ...heroForm, showBadge: e.target.checked })}
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Intro Paragraph</span>
                <span className="adm-toggle-sub">Descriptive narrative below title</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={heroForm.showIntro !== false}
                  onChange={(e) => setHeroForm({ ...heroForm, showIntro: e.target.checked })}
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Scroll Down Indicator</span>
                <span className="adm-toggle-sub">Animated pulsing line and arrow indicator</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={heroForm.showScrollIndicator !== false}
                  onChange={(e) => setHeroForm({ ...heroForm, showScrollIndicator: e.target.checked })}
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Blueprint Grid Background</span>
                <span className="adm-toggle-sub">Subtle architectural blueprint grid pattern</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={heroForm.showHeroGrid !== false}
                  onChange={(e) => setHeroForm({ ...heroForm, showHeroGrid: e.target.checked })}
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-actions" style={{ marginTop: "16px" }}>
              <button type="submit" className="adm-btn">
                <Icon name="check" size={16} /> Save Hero Settings
              </button>
            </div>
          </form>

          {/* Live Mini Preview */}
          <div className="adm-card adm-preview" style={{ background: designForm.bg || "#211416", color: designForm.text || "#E8DFD0" }}>
            <div className="adm-card-head" style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}>
              <h3 style={{ color: designForm.text || "#E8DFD0" }}>Hero Live Preview</h3>
            </div>

            <div style={{ padding: "20px 0" }}>
              {heroForm.showBadge !== false && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: designForm.accent || "#B99A68",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "1.5px",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: designForm.accent || "#B99A68",
                    }}
                  />
                  {heroForm.badge || "THE EVOLUTION OF A DEVELOPER"}
                </div>
              )}

              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "28px",
                  fontWeight: "700",
                  lineHeight: "1.1",
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                  margin: "0 0 16px",
                  color: designForm.text || "#E8DFD0",
                }}
              >
                <div>{heroForm.titleLine1 || "Every Line of Code"}</div>
                <div>
                  {heroForm.titleLine2 || "Built a Part of"}{" "}
                  <span style={{ color: designForm.accent || "#B99A68" }}>
                    {heroForm.titleHighlight || "Me."}
                  </span>
                </div>
              </h1>

              {heroForm.showIntro !== false && (
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.6",
                    opacity: 0.75,
                    marginBottom: "20px",
                    color: designForm.text || "#E8DFD0",
                  }}
                >
                  {heroForm.intro || "This isn't a résumé..."}
                </p>
              )}

              {heroForm.showScrollIndicator !== false && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    opacity: 0.6,
                    color: designForm.text || "#E8DFD0",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "1px",
                      background: designForm.accent || "#B99A68",
                    }}
                  />
                  SCROLL TO EXPLORE ↓
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 3: DESIGN & COLORS
          ══════════════════════════════════════════════ */}
      {activeTab === "design" && (
        <div className="adm-split wide">
          <form className="adm-card adm-form" onSubmit={handleSaveDesign}>
            <div className="adm-card-head">
              <h3>Bespoke Journey Colour Palette</h3>
              <span className="adm-muted">
                Scoped strictly to the Journey section without altering the rest of your website or admin.
              </span>
            </div>

            <div className="adm-color-grid">
              <ColorField
                label="ACCENT COLOUR"
                value={designForm.accent || "#B99A68"}
                onChange={(accent) => setDesignForm({ ...designForm, accent })}
              />
              <ColorField
                label="BACKGROUND"
                value={designForm.bg || "#211416"}
                onChange={(bg) => setDesignForm({ ...designForm, bg })}
              />
              <ColorField
                label="TEXT COLOUR"
                value={designForm.text || "#E8DFD0"}
                onChange={(text) => setDesignForm({ ...designForm, text })}
              />
            </div>

            <h4 style={{ fontSize: "14px", fontWeight: "600", marginTop: "12px" }}>
              Ready-made Colour Schemes
            </h4>
            <div className="adm-presets">
              {JOURNEY_COLOR_PRESETS.map((p) => {
                const isActive =
                  p.accent.toLowerCase() === (designForm.accent || "").toLowerCase() &&
                  p.bg.toLowerCase() === (designForm.bg || "").toLowerCase();
                return (
                  <button
                    key={p.name}
                    type="button"
                    className={`adm-preset ${isActive ? "active" : ""}`}
                    onClick={() => applyColorPreset(p)}
                  >
                    <span className="adm-swatches">
                      <i style={{ background: p.bg }} />
                      <i style={{ background: p.accent }} />
                      <i style={{ background: p.text }} />
                    </span>
                    {p.name}
                  </button>
                );
              })}
            </div>

            <h4 style={{ fontSize: "14px", fontWeight: "600", marginTop: "16px" }}>
              Timeline Rail &amp; Progress Line
            </h4>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Vertical Rail &amp; Nodes</span>
                <span className="adm-toggle-sub">
                  Connected vertical progress line and active chapter nodes
                </span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={designForm.showRail !== false}
                  onChange={(e) => setDesignForm({ ...designForm, showRail: e.target.checked })}
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-field">
              <span>Rail Appearance Style</span>
              <div className="adm-chip-group">
                {[
                  { value: "glow", label: "Accent Glow (Default)" },
                  { value: "solid", label: "Clean Solid Line" },
                  { value: "subtle", label: "Subtle 1px Minimalist" },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`adm-chip-btn ${designForm.timelineStyle === s.value ? "active" : ""}`}
                    onClick={() => setDesignForm({ ...designForm, timelineStyle: s.value })}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <h4 style={{ fontSize: "14px", fontWeight: "600", marginTop: "16px" }}>
              Layout &amp; Spacing
            </h4>

            <div className="adm-field">
              <span>Chapter Visual Alignment</span>
              <div className="adm-chip-group">
                {[
                  { value: "alternate", label: "Alternating Left / Right (Editorial)" },
                  { value: "right", label: "Visual Always on Right" },
                  { value: "left", label: "Visual Always on Left" },
                ].map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    className={`adm-chip-btn ${designForm.layoutStyle === l.value ? "active" : ""}`}
                    onClick={() => setDesignForm({ ...designForm, layoutStyle: l.value })}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="adm-field">
              <span>Chapter Vertical Spacing</span>
              <div className="adm-chip-group">
                {[
                  { value: "compact", label: "Compact (Shorter scroll)" },
                  { value: "comfortable", label: "Comfortable (Standard)" },
                  { value: "spacious", label: "Spacious (Dramatic editorial)" },
                ].map((sp) => (
                  <button
                    key={sp.value}
                    type="button"
                    className={`adm-chip-btn ${designForm.spacing === sp.value ? "active" : ""}`}
                    onClick={() => setDesignForm({ ...designForm, spacing: sp.value })}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            <h4 style={{ fontSize: "14px", fontWeight: "600", marginTop: "16px" }}>
              Animation Preferences
            </h4>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Enable Scroll Animations &amp; Reveals</span>
                <span className="adm-toggle-sub">
                  GSAP entrance timelines, rail height scrub, and IntersectionObserver reveals
                </span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={designForm.enableAnimations !== false}
                  onChange={(e) =>
                    setDesignForm({ ...designForm, enableAnimations: e.target.checked })
                  }
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-actions" style={{ marginTop: "16px" }}>
              <button type="submit" className="adm-btn">
                <Icon name="check" size={16} /> Save Design Settings
              </button>
            </div>
          </form>

          {/* Design Live Preview */}
          <div
            className="adm-card adm-preview"
            style={{
              background: designForm.bg || "#211416",
              color: designForm.text || "#E8DFD0",
              border: `1px solid ${designForm.accent || "#B99A68"}44`,
            }}
          >
            <div className="adm-card-head" style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}>
              <h3 style={{ color: designForm.text || "#E8DFD0" }}>Journey Palette Preview</h3>
              <span style={{ color: designForm.accent || "#B99A68", fontSize: "12px", fontWeight: "700" }}>
                {designForm.accent}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "44px",
                    fontWeight: "800",
                    color: "transparent",
                    WebkitTextStroke: `1px ${designForm.accent || "#B99A68"}88`,
                    lineHeight: 1,
                  }}
                >
                  03
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "2px",
                      fontWeight: "700",
                      color: designForm.accent || "#B99A68",
                      textTransform: "uppercase",
                    }}
                  >
                    03 — Building Real Products
                  </div>
                  <h4
                    style={{
                      fontSize: "17px",
                      fontWeight: "600",
                      color: designForm.text || "#E8DFD0",
                      margin: "4px 0",
                    }}
                  >
                    Turning Ideas into Products
                  </h4>
                </div>
              </div>

              <p style={{ fontSize: "12px", lineHeight: "1.6", opacity: 0.75, color: designForm.text || "#E8DFD0" }}>
                Theory became real. I built full projects from scratch — designing interfaces, managing
                state, integrating APIs.
              </p>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["React", "Vite", "Firebase", "GSAP"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "10px",
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: designForm.accent || "#B99A68",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 18px",
                    borderRadius: "100px",
                    background: designForm.accent || "#B99A68",
                    color: designForm.bg || "#211416",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Primary CTA ↗
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 18px",
                    borderRadius: "100px",
                    border: `1px solid ${designForm.accent || "#B99A68"}66`,
                    color: designForm.text || "#E8DFD0",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Ghost Button
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 4: CLOSING SECTION
          ══════════════════════════════════════════════ */}
      {activeTab === "closing" && (
        <div className="adm-split wide">
          <form className="adm-card adm-form" onSubmit={handleSaveClosing}>
            <div className="adm-card-head">
              <h3>Closing Statement &amp; Call To Action</h3>
              <span className="adm-muted">Customise the bottom section of your Journey page.</span>
            </div>

            <label className="adm-field">
              <span>Section Kicker / Eyebrow</span>
              <input
                className="adm-input"
                value={closingForm.kicker || ""}
                onChange={(e) => setClosingForm({ ...closingForm, kicker: e.target.value })}
                placeholder="THE STORY CONTINUES"
              />
            </label>

            <div className="adm-two">
              <label className="adm-field">
                <span>Heading Line 1 Prefix</span>
                <input
                  className="adm-input"
                  value={closingForm.titleLine1 || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, titleLine1: e.target.value })}
                  placeholder="This Isn't the"
                />
              </label>

              <label className="adm-field">
                <span>Heading Line 1 Highlight (Accent)</span>
                <input
                  className="adm-input"
                  value={closingForm.titleAccent1 || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, titleAccent1: e.target.value })}
                  placeholder="Finish Line."
                />
              </label>
            </div>

            <div className="adm-two">
              <label className="adm-field">
                <span>Heading Line 2 Prefix</span>
                <input
                  className="adm-input"
                  value={closingForm.titleLine2 || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, titleLine2: e.target.value })}
                  placeholder="It's the Next"
                />
              </label>

              <label className="adm-field">
                <span>Heading Line 2 Highlight (Accent)</span>
                <input
                  className="adm-input"
                  value={closingForm.titleAccent2 || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, titleAccent2: e.target.value })}
                  placeholder="Commit."
                />
              </label>
            </div>

            <label className="adm-field">
              <span>Closing Description Paragraph</span>
              <textarea
                className="adm-input"
                rows={4}
                value={closingForm.sub || ""}
                onChange={(e) => setClosingForm({ ...closingForm, sub: e.target.value })}
                placeholder="Every great developer is perpetually a student..."
              />
            </label>

            <div className="adm-two">
              <label className="adm-field">
                <span>Primary Button Label</span>
                <input
                  className="adm-input"
                  value={closingForm.primaryBtnLabel || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, primaryBtnLabel: e.target.value })}
                  placeholder="See My Projects"
                />
              </label>

              <label className="adm-field">
                <span>Primary Button Destination Link</span>
                <input
                  className="adm-input"
                  value={closingForm.primaryBtnLink || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, primaryBtnLink: e.target.value })}
                  placeholder="/#projects"
                />
              </label>
            </div>

            <div className="adm-two">
              <label className="adm-field">
                <span>Secondary Button Label</span>
                <input
                  className="adm-input"
                  value={closingForm.secondaryBtnLabel || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, secondaryBtnLabel: e.target.value })}
                  placeholder="Let's Collaborate"
                />
              </label>

              <label className="adm-field">
                <span>Secondary Button Destination Link</span>
                <input
                  className="adm-input"
                  value={closingForm.secondaryBtnLink || ""}
                  onChange={(e) => setClosingForm({ ...closingForm, secondaryBtnLink: e.target.value })}
                  placeholder="/#contact"
                />
              </label>
            </div>

            <h4 style={{ fontSize: "14px", fontWeight: "600", marginTop: "12px" }}>
              Visibility Controls
            </h4>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Closing Section</span>
                <span className="adm-toggle-sub">Entire closing CTA section at the bottom</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={closingForm.showClosing !== false}
                  onChange={(e) => setClosingForm({ ...closingForm, showClosing: e.target.checked })}
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Primary Button</span>
                <span className="adm-toggle-sub">Prominent accent button</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={closingForm.showPrimaryBtn !== false}
                  onChange={(e) =>
                    setClosingForm({ ...closingForm, showPrimaryBtn: e.target.checked })
                  }
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-toggle-row">
              <div className="adm-toggle-info">
                <span className="adm-toggle-title">Show Secondary Button</span>
                <span className="adm-toggle-sub">Ghost collaboration button</span>
              </div>
              <label className="adm-switch">
                <input
                  type="checkbox"
                  checked={closingForm.showSecondaryBtn !== false}
                  onChange={(e) =>
                    setClosingForm({ ...closingForm, showSecondaryBtn: e.target.checked })
                  }
                />
                <span className="adm-switch-slider" />
              </label>
            </div>

            <div className="adm-actions" style={{ marginTop: "16px" }}>
              <button type="submit" className="adm-btn">
                <Icon name="check" size={16} /> Save Closing Settings
              </button>
            </div>
          </form>

          {/* Closing Preview */}
          <div
            className="adm-card adm-preview"
            style={{
              background: designForm.bg || "#211416",
              color: designForm.text || "#E8DFD0",
              textAlign: "center",
            }}
          >
            <div className="adm-card-head" style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}>
              <h3 style={{ color: designForm.text || "#E8DFD0" }}>Closing Preview</h3>
            </div>

            <div style={{ padding: "20px 0" }}>
              {closingForm.kicker && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.06)",
                    color: designForm.accent || "#B99A68",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "1.5px",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: designForm.accent || "#B99A68",
                    }}
                  />
                  {closingForm.kicker}
                </div>
              )}

              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  lineHeight: "1.15",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                  color: designForm.text || "#E8DFD0",
                }}
              >
                {closingForm.titleLine1 || "This Isn't the"}{" "}
                <span style={{ color: designForm.accent || "#B99A68" }}>
                  {closingForm.titleAccent1 || "Finish Line."}
                </span>
                <br />
                {closingForm.titleLine2 || "It's the Next"}{" "}
                <span style={{ color: designForm.accent || "#B99A68" }}>
                  {closingForm.titleAccent2 || "Commit."}
                </span>
              </h2>

              {closingForm.sub && (
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.6",
                    opacity: 0.75,
                    marginBottom: "20px",
                    color: designForm.text || "#E8DFD0",
                  }}
                >
                  {closingForm.sub}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                {closingForm.showPrimaryBtn !== false && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 18px",
                      borderRadius: "100px",
                      background: designForm.accent || "#B99A68",
                      color: designForm.bg || "#211416",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {closingForm.primaryBtnLabel || "See My Projects"} ↗
                  </span>
                )}
                {closingForm.showSecondaryBtn !== false && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 18px",
                      borderRadius: "100px",
                      border: `1px solid ${designForm.accent || "#B99A68"}66`,
                      color: designForm.text || "#E8DFD0",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {closingForm.secondaryBtnLabel || "Let's Collaborate"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
          ══════════════════════════════════════════════ */}
      {deleteModal.isOpen && (
        <div className="adm-modal-backdrop" onClick={() => setDeleteModal({ isOpen: false, chapter: null })}>
          <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Journey Chapter?</h3>
            <p>
              Are you sure you want to delete chapter &quot;{deleteModal.chapter?.title}&quot; (Chapter{" "}
              {deleteModal.chapter?.num})? This action cannot be undone.
            </p>
            <div className="adm-modal-actions">
              <button
                type="button"
                className="adm-btn adm-btn-ghost"
                onClick={() => setDeleteModal({ isOpen: false, chapter: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-danger"
                onClick={confirmDeleteChapter}
              >
                Delete Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          RESET ALL DEFAULTS MODAL
          ══════════════════════════════════════════════ */}
      {resetModal && (
        <div className="adm-modal-backdrop" onClick={() => setResetModal(false)}>
          <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Journey to Original Defaults?</h3>
            <p>
              This will restore all 5 default chapters (including Chapter 03 &quot;Turning Ideas into
              Products&quot;), the default hero copy, and the original antique-gold &amp; burgundy palette
              (#B99A68 / #211416 / #E8DFD0). Any custom chapters or edits will be reset.
            </p>
            <div className="adm-modal-actions">
              <button
                type="button"
                className="adm-btn adm-btn-ghost"
                onClick={() => setResetModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-danger"
                onClick={handleConfirmReset}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
