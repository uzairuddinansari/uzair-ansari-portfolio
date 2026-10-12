import { useState } from "react";
import PageHeader from "../components/PageHeader";
import useSite from "../hooks/useSite";
import { THEME_PRESETS } from "../utils/theme";

// Color picker + hex box. Hex tabhi lagta hai jab poora code (#rrggbb) likh do.
function ColorField({ label, value, onChange }) {
  const [draft, setDraft] = useState(null);

  const handleText = (e) => {
    const text = e.target.value;
    setDraft(text);
    if (/^#[0-9a-f]{6}$/i.test(text)) onChange(text.toLowerCase());
  };

  return (
    <div className="adm-color">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
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

// /adminpanel/appearance
export default function AdminAppearance() {
  const { theme, updateTheme, resetTheme } = useSite();

  const isActive = (p) =>
    p.accent === theme.accent && p.bg === theme.bg && p.text === theme.text;

  return (
    <>
      <PageHeader
        eyebrow="THEME"
        title="Appearance"
        text="Yahan se poori website ke colours badlo. Change turant lagta hai aur khud save ho jata hai."
      >
        <button className="adm-btn adm-btn-ghost" onClick={resetTheme}>
          Reset to default
        </button>
      </PageHeader>

      <div className="adm-split wide">
        <div className="adm-stack">
          <section className="adm-card">
            <div className="adm-card-head">
              <h3>Colours</h3>
            </div>

            <div className="adm-color-grid">
              <ColorField label="ACCENT" value={theme.accent} onChange={(accent) => updateTheme({ accent })} />
              <ColorField label="BACKGROUND" value={theme.bg} onChange={(bg) => updateTheme({ bg })} />
              <ColorField label="TEXT" value={theme.text} onChange={(text) => updateTheme({ text })} />
            </div>
          </section>

          <section className="adm-card">
            <div className="adm-card-head">
              <h3>Ready-made themes</h3>
            </div>

            <div className="adm-presets">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.name}
                  className={`adm-preset ${isActive(p) ? "active" : ""}`}
                  onClick={() => updateTheme({ accent: p.accent, bg: p.bg, text: p.text })}
                >
                  <span className="adm-swatches">
                    <i style={{ background: p.bg }} />
                    <i style={{ background: p.accent }} />
                    <i style={{ background: p.text }} />
                  </span>
                  {p.name}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="adm-card adm-preview">
          <div className="adm-card-head">
            <h3>Preview</h3>
          </div>

          <div className="adm-preview-box">
            <p className="adm-preview-kicker">FRONTEND DEVELOPER</p>
            <h2>
              Hi, I’m <em>Uzair.</em>
            </h2>
            <p>Yeh aapki website ka chhota sa namoona hai.</p>
            <div className="adm-actions">
              <span className="adm-btn">View Projects ↗</span>
              <span className="adm-btn adm-btn-ghost">Let’s Talk ↗</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
