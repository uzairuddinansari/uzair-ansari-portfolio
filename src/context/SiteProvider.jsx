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

export const DEFAULT_JOURNEY_DATA = {
  hero: {
    badge: "THE EVOLUTION OF A DEVELOPER",
    titleLine1: "Every Line of Code",
    titleLine2: "Built a Part of",
    titleHighlight: "Me.",
    intro:
      "This isn't a résumé. It's a story — the real one. From my first inspect element to building full-stack products, competing globally, and still chasing what's next. Scroll through the chapters that made me a developer.",
    supportingText: "Interactive Developer Odyssey",
    showBadge: true,
    showIntro: true,
    showScrollIndicator: true,
    showHeroGrid: true,
    showHeroPath: true,
  },
  chapters: [
    {
      id: "ch-01",
      num: "01",
      kicker: "01 — The Beginning",
      title: "The First Line of Code",
      subtitle: "The Beginning",
      period: "2022",
      desc: "It started with curiosity — right-clicking a beautiful website and hitting Inspect. I began learning HTML and CSS, amazed that a few lines could transform into something visual. That spark became an obsession: understanding how every pixel is placed, every layout crafted.",
      tags: ["HTML", "CSS", "Flexbox", "Box Model", "Inspect"],
      visual: "code",
      image: "",
      projectUrl: "",
      achievement: "First Responsive Page",
      published: true,
    },
    {
      id: "ch-02",
      num: "02",
      kicker: "02 — From Code to Logic",
      title: "Thinking in JavaScript",
      subtitle: "From Code to Logic",
      period: "2023",
      desc: "Static pages weren't enough. I dove into JavaScript — not just syntax, but logic. Functions, the DOM, asynchronous code, and eventually React. The shift from \"making things look good\" to \"making things work intelligently\" changed how I see every problem.",
      tags: ["JavaScript", "ES6+", "DOM", "React", "Promises", "APIs"],
      visual: "logic",
      image: "",
      projectUrl: "",
      achievement: "Asynchronous Mastery",
      published: true,
    },
    {
      id: "ch-03",
      num: "03",
      kicker: "03 — Building Real Projects",
      title: "Turning Ideas into Products",
      subtitle: "Building Real Projects",
      period: "2023 - 2024",
      desc: "Theory became real. I built full projects from scratch — designing interfaces, managing state, integrating APIs, and shipping something people could actually use. Each project taught me more than any tutorial ever could.",
      tags: ["React", "Vite", "Firebase", "GSAP", "CSS", "Cloudinary"],
      visual: "projects",
      image: "",
      projectUrl: "",
      achievement: "Shipped Real Products",
      published: true,
    },
    {
      id: "ch-04",
      num: "04",
      kicker: "04 — Beyond the Screen",
      title: "Techwiz & the World Stage",
      subtitle: "Beyond the Screen",
      period: "2024",
      desc: "Competing in Techwiz — an international tech competition — pushed me beyond solo coding. I collaborated under pressure, adapted to real constraints, and learned that great software isn't just written alone. Teamwork, iteration, and presenting your work to experts are skills that no IDE teaches.",
      tags: ["Techwiz", "Teamwork", "Competition", "Presentation", "Problem-Solving"],
      visual: "techwiz",
      image: "",
      projectUrl: "",
      achievement: "International Competitor",
      published: true,
    },
    {
      id: "ch-05",
      num: "05",
      kicker: "05 — Still Becoming",
      title: "The Horizon Is Always Moving",
      subtitle: "Still Becoming",
      period: "2025 - Present",
      desc: "The stack keeps evolving and so do I. Right now I'm exploring backend depth with Node.js and Express, learning database design, and studying what makes interfaces truly accessible. I'm building toward full-stack confidence — one commit at a time.",
      tags: ["Node.js", "Express", "MongoDB", "TypeScript", "Accessibility", "Next.js"],
      visual: "future",
      image: "",
      projectUrl: "",
      achievement: "Full-Stack Horizon",
      published: true,
    },
  ],
  design: {
    accent: "#B99A68",
    bg: "#211416",
    text: "#E8DFD0",
    timelineStyle: "glow",
    showRail: true,
    layoutStyle: "alternate",
    enableAnimations: true,
    spacing: "comfortable",
  },
  closing: {
    kicker: "THE STORY CONTINUES",
    titleLine1: "This Isn't the",
    titleAccent1: "Finish Line.",
    titleLine2: "It's the Next",
    titleAccent2: "Commit.",
    sub: "Every great developer is perpetually a student. The technologies keep evolving, the problems get more interesting, and the craft deepens with every project shipped. I'm not done learning — I'm just getting started.",
    primaryBtnLabel: "See My Projects",
    primaryBtnLink: "/#projects",
    secondaryBtnLabel: "Let's Collaborate",
    secondaryBtnLink: "/#contact",
    showClosing: true,
    showPrimaryBtn: true,
    showSecondaryBtn: true,
  },
};

function sanitizeJourneyData(raw) {
  if (!raw || typeof raw !== "object") return DEFAULT_JOURNEY_DATA;
  return {
    hero: { ...DEFAULT_JOURNEY_DATA.hero, ...(raw.hero || {}) },
    chapters: Array.isArray(raw.chapters) && raw.chapters.length > 0
      ? raw.chapters.map((ch, idx) => ({
          id: ch.id || `ch-${String(idx + 1).padStart(2, "0")}`,
          num: ch.num || String(idx + 1).padStart(2, "0"),
          kicker: ch.kicker || `Chapter ${idx + 1}`,
          title: ch.title || "Untitled Chapter",
          subtitle: ch.subtitle || "",
          period: ch.period || "",
          desc: ch.desc || "",
          tags: Array.isArray(ch.tags)
            ? ch.tags
            : (typeof ch.tags === "string" ? ch.tags.split(",").map((s) => s.trim()).filter(Boolean) : []),
          visual: ch.visual || "code",
          image: ch.image || "",
          projectUrl: ch.projectUrl || "",
          achievement: ch.achievement || "",
          published: ch.published !== false,
        }))
      : DEFAULT_JOURNEY_DATA.chapters,
    design: { ...DEFAULT_JOURNEY_DATA.design, ...(raw.design || {}) },
    closing: { ...DEFAULT_JOURNEY_DATA.closing, ...(raw.closing || {}) },
  };
}

// Website ka saara data (projects, reviews, messages, theme, skills, journey) yahan rehta hai.
// Browser mein localStorage ke zariye save rehta hai aur public page + admin sync rehte hain.
export default function SiteProvider({ children }) {
  const [projects, setProjects] = useLocalStorage("site-projects", []);
  const [reviews, setReviews] = useLocalStorage("site-reviews", []);
  const [messages, setMessages] = useLocalStorage("site-messages", []);
  const [theme, setTheme] = useLocalStorage("site-theme", DEFAULT_THEME);
  const [rawSkills, setSkills] = useLocalStorage("site-skills", DEFAULT_SKILLS);
  const [rawJourney, setRawJourney] = useLocalStorage("portfolioJourneyData", DEFAULT_JOURNEY_DATA);

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

  const journeyData = sanitizeJourneyData(rawJourney);

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
      { id: Date.now(), read: false, status: "unread", date: new Date().toISOString(), ...message },
      ...list,
    ]);

  const toggleMessageRead = (id) =>
    setMessages((list) =>
      list.map((m) => {
        if (m.id !== id) return m;
        const newRead = !m.read;
        const newStatus = newRead ? "read" : "unread";
        return { ...m, read: newRead, status: newStatus };
      })
    );
  const deleteMessage = (id) =>
    setMessages((list) => list.filter((m) => m.id !== id));

  const setMessageStatus = (id, status) =>
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, status } : m)));

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

  /* ---------- Journey ---------- */
  const updateJourneyHero = (heroUpdates) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        hero: { ...current.hero, ...heroUpdates },
      };
    });
  };

  const updateJourneyChapters = (newChapters) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        chapters: newChapters,
      };
    });
  };

  const addJourneyChapter = (chapter) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      const nextNum = String(current.chapters.length + 1).padStart(2, "0");
      const newCh = {
        id: `ch-${Date.now()}`,
        num: chapter.num || nextNum,
        kicker: chapter.kicker || `${nextNum} — ${chapter.title || "New Milestone"}`,
        title: chapter.title || "New Chapter",
        subtitle: chapter.subtitle || "",
        period: chapter.period || "",
        desc: chapter.desc || "",
        tags: Array.isArray(chapter.tags) ? chapter.tags : [],
        visual: chapter.visual || "code",
        image: chapter.image || "",
        projectUrl: chapter.projectUrl || "",
        achievement: chapter.achievement || "",
        published: chapter.published !== false,
      };
      return {
        ...current,
        chapters: [...current.chapters, newCh],
      };
    });
  };

  const updateJourneyChapter = (id, changes) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        chapters: current.chapters.map((ch) => (ch.id === id ? { ...ch, ...changes } : ch)),
      };
    });
  };

  const deleteJourneyChapter = (id) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        chapters: current.chapters.filter((ch) => ch.id !== id),
      };
    });
  };

  const reorderJourneyChapters = (reorderedChapters) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        chapters: reorderedChapters,
      };
    });
  };

  const updateJourneyDesign = (designUpdates) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        design: { ...current.design, ...designUpdates },
      };
    });
  };

  const updateJourneyClosing = (closingUpdates) => {
    setRawJourney((prev) => {
      const current = sanitizeJourneyData(prev);
      return {
        ...current,
        closing: { ...current.closing, ...closingUpdates },
      };
    });
  };

  const resetJourneyData = () => {
    setRawJourney(DEFAULT_JOURNEY_DATA);
  };

  const value = {
    projects, addProject, deleteProject,
    reviews, addReview, setReviewStatus, deleteReview,
    messages, addMessage, toggleMessageRead, deleteMessage, setMessageStatus,
    skills, addSkill, updateSkill, deleteSkill,
    theme, updateTheme, resetTheme,
    // Journey exports
    journeyData,
    updateJourneyHero,
    updateJourneyChapters,
    addJourneyChapter,
    updateJourneyChapter,
    deleteJourneyChapter,
    reorderJourneyChapters,
    updateJourneyDesign,
    updateJourneyClosing,
    resetJourneyData,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

