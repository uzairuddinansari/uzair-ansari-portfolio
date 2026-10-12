export const DEFAULT_THEME = {
  accent: "#d5f278",
  bg: "#080909",
  text: "#f5f5f0",
};

export const THEME_PRESETS = [
  { name: "Lime Night", accent: "#d5f278", bg: "#080909", text: "#f5f5f0" },
  { name: "Ocean", accent: "#5ac8fa", bg: "#07101a", text: "#eaf4ff" },
  { name: "Sunset", accent: "#ff8a5b", bg: "#120a08", text: "#fff1ea" },
  { name: "Violet", accent: "#b794f6", bg: "#0c0912", text: "#f3edff" },
  { name: "Rose", accent: "#ff6b9d", bg: "#100810", text: "#ffeef4" },
  { name: "Paper (Light)", accent: "#2f5d3a", bg: "#f6f4ee", text: "#14150f" },
];

// Accent ke upar likha text dark ho ya light, ye brightness se decide hota hai
function textOn(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#10110b" : "#ffffff";
}

export function applyTheme(theme) {
  const style = document.documentElement.style;
  style.setProperty("--accent", theme.accent);
  style.setProperty("--bg", theme.bg);
  style.setProperty("--text", theme.text);
  style.setProperty("--on-accent", textOn(theme.accent));
}
