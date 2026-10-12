import { useLayoutEffect } from "react";
import SiteContext from "./SiteContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_THEME, applyTheme } from "../utils/theme";

// Default skills with creation timeline, purpose, and code snippet
const DEFAULT_SKILLS = [
  {
    id: 1,
    name: "HTML",
    description: "Structuring accessible web content.",
    icon: "html",
    category: "Frontend",
    createdDate: "1993 by Tim Berners-Lee",
    purpose: "World Wide Web ka basic skeleton aur semantic document structure define karne ke liye standard markup language.",
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Modern Web App</title>
  </head>
  <body>
    <main class="app-shell">
      <header class="header">
        <h1>Semantic Web Structure</h1>
      </header>
    </main>
  </body>
</html>`,
  },
  {
    id: 2,
    name: "CSS",
    description: "Styling responsive and polished interfaces.",
    icon: "css",
    category: "Frontend",
    createdDate: "1996 by Håkon Wium Lie",
    purpose: "Modern layouts (Flexbox/Grid), custom properties, dynamic micro-animations aur fluid responsiveness create karne ke liye.",
    code: `:root {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.12);
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`,
  },
  {
    id: 3,
    name: "JavaScript",
    description: "Building interactive web experiences.",
    icon: "javascript",
    category: "Frontend",
    createdDate: "1995 by Brendan Eich",
    purpose: "Client-side interactivity, DOM manipulation, asynchronous network calls aur full dynamic runtime applications ke liye.",
    code: `// Async data fetcher with resilient error handling
async function fetchUserMetrics(endpoint) {
  try {
    const response = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const data = await response.json();
    return { success: true, payload: data };
  } catch (err) {
    console.error("Fetch failure:", err.message);
    return { success: false, error: err.message };
  }
}`,
  },
  {
    id: 4,
    name: "React",
    description: "Creating reusable component-based interfaces.",
    icon: "react",
    category: "Frontend",
    createdDate: "May 2013 by Jordan Walke (Meta)",
    purpose: "Virtual DOM, reusable reactive component state architecture aur high-performance scalable web applications banane ke liye.",
    code: `import { useState, useEffect, useMemo } from "react";

export default function DynamicCounter({ initial = 0, step = 1 }) {
  const [count, setCount] = useState(initial);
  const isEven = useMemo(() => count % 2 === 0, [count]);

  useEffect(() => {
    document.title = \`Taps: \${count}\`;
  }, [count]);

  return (
    <div className="counter-box">
      <span className="badge">{isEven ? "Even" : "Odd"}</span>
      <h3>{count}</h3>
      <button onClick={() => setCount(prev => prev + step)}>
        Increment +{step}
      </button>
    </div>
  );
}`,
  },
  {
    id: 5,
    name: "GSAP",
    description: "Adding smooth, purposeful motion.",
    icon: "gsap",
    category: "Frontend",
    createdDate: "2008 by Jack Doyle (GreenSock)",
    purpose: "Complex multi-step scroll animations, timeline sequencing aur GPU-accelerated motion choreography ke liye.",
    code: `import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateReveal(element) {
  return gsap.fromTo(
    element,
    { y: 60, opacity: 0, scale: 0.96 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
}`,
  },
  {
    id: 6,
    name: "Bootstrap",
    description: "Building responsive layouts efficiently.",
    icon: "bootstrap",
    category: "Frontend",
    createdDate: "August 2011 by Mark Otto & Jacob Thornton",
    purpose: "Rapid mobile-first responsive prototyping aur pre-styled utility framework components build karne ke liye.",
    code: `<div class="container py-5">
  <div class="row g-4 align-items-center">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card bg-dark text-light border-secondary p-4 h-100">
        <h5 class="card-title text-warning">Quick Prototype</h5>
        <p class="card-text text-secondary">
          12-column responsive grid layout system.
        </p>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 7,
    name: "Git",
    description: "Tracking changes and managing code history.",
    icon: "git",
    category: "Tools",
    createdDate: "April 2005 by Linus Torvalds",
    purpose: "Distributed version control system, branch isolation, commit history aur merge conflicts solve karne ke liye.",
    code: `# Create and switch to new feature branch
git checkout -b feature/interactive-code-shutter

# Stage and commit atomic changes
git add src/pages/Skills.jsx src/styles/Skills.css
git commit -m "feat(skills): implement slide-over code shutter"

# Push to origin repository
git push origin feature/interactive-code-shutter`,
  },
  {
    id: 8,
    name: "GitHub",
    description: "Hosting repositories and collaborating on code.",
    icon: "github",
    category: "Tools",
    createdDate: "February 2008 by PJ Hyett, Chris Wanstrath & Tom Preston-Werner",
    purpose: "Cloud repository hosting, Pull Requests, automated CI/CD GitHub Actions workflows aur open-source teamwork ke liye.",
    code: `name: Production CI/CD Pipeline
on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build`,
  },
];

// Website ka saara data (projects, reviews, messages, theme, skills) yahan rehta hai.
// Abhi browser mein save hota hai, baad mein yahi functions Firebase se jud jayenge.
export default function SiteProvider({ children }) {
  const [projects, setProjects] = useLocalStorage("site-projects", []);
  const [reviews, setReviews] = useLocalStorage("site-reviews", []);
  const [messages, setMessages] = useLocalStorage("site-messages", []);
  const [theme, setTheme] = useLocalStorage("site-theme", DEFAULT_THEME);
  const [rawSkills, setSkills] = useLocalStorage("site-skills", DEFAULT_SKILLS);

  // Merge default enrichments for code & dates if not present
  const skills = (rawSkills && rawSkills.length > 0 ? rawSkills : DEFAULT_SKILLS).map((item) => {
    const match = DEFAULT_SKILLS.find(
      (d) => d.id === item.id || d.name?.toLowerCase() === item.name?.toLowerCase()
    );
    return {
      ...item,
      code: item.code || match?.code || "// Code snippet not provided",
      createdDate: item.createdDate || match?.createdDate || "History date not specified",
      purpose: item.purpose || match?.purpose || item.description || "General technology purpose",
    };
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /* ---------- Projects ---------- */
  const addProject = (project) =>
    setProjects((list) => [{ id: Date.now(), ...project }, ...list]);

  const deleteProject = (id) =>
    setProjects((list) => list.filter((p) => p.id !== id));

  /* ---------- Reviews (visitor dalta hai, admin approve/hide karta hai) ---------- */
  const addReview = (review) =>
    setReviews((list) => [
      { id: Date.now(), status: "pending", date: new Date().toISOString(), ...review },
      ...list,
    ]);

  const setReviewStatus = (id, status) =>
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));

  const deleteReview = (id) =>
    setReviews((list) => list.filter((r) => r.id !== id));

  /* ---------- Messages (contact form) ---------- */
  const addMessage = (message) =>
    setMessages((list) => [
      { id: Date.now(), read: false, date: new Date().toISOString(), ...message },
      ...list,
    ]);

  const toggleMessageRead = (id) =>
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, read: !m.read } : m)));

  const deleteMessage = (id) =>
    setMessages((list) => list.filter((m) => m.id !== id));

  /* ---------- Skills ---------- */
  const addSkill = (skill) =>
    setSkills((list) => [{ id: Date.now(), ...skill }, ...list]);

  const updateSkill = (id, changes) =>
    setSkills((list) => list.map((s) => (s.id === id ? { ...s, ...changes } : s)));

  const deleteSkill = (id) =>
    setSkills((list) => list.filter((s) => s.id !== id));

  /* ---------- Theme ---------- */
  const updateTheme = (changes) => setTheme((t) => ({ ...t, ...changes }));
  const resetTheme = () => setTheme(DEFAULT_THEME);

  const value = {
    projects, addProject, deleteProject,
    reviews, addReview, setReviewStatus, deleteReview,
    messages, addMessage, toggleMessageRead, deleteMessage,
    skills, addSkill, updateSkill, deleteSkill,
    theme, updateTheme, resetTheme,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

