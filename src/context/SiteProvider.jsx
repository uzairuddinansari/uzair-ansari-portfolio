import { useLayoutEffect } from "react";
import SiteContext from "./SiteContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_THEME, applyTheme } from "../utils/theme";

// Default skills (initialize ONLY when localStorage is empty)
const DEFAULT_SKILLS = [
  { id: 1, name: "HTML", description: "Structuring accessible web content.", icon: "html", category: "Frontend" },
  { id: 2, name: "CSS", description: "Styling responsive and polished interfaces.", icon: "css", category: "Frontend" },
  { id: 3, name: "JavaScript", description: "Building interactive web experiences.", icon: "javascript", category: "Frontend" },
  { id: 4, name: "React", description: "Creating reusable component-based interfaces.", icon: "react", category: "Frontend" },
  { id: 5, name: "GSAP", description: "Adding smooth, purposeful motion.", icon: "gsap", category: "Frontend" },
  { id: 6, name: "Bootstrap", description: "Building responsive layouts efficiently.", icon: "bootstrap", category: "Frontend" },
  { id: 7, name: "Git", description: "Tracking changes and managing code history.", icon: "git", category: "Tools" },
  { id: 8, name: "GitHub", description: "Hosting repositories and collaborating on code.", icon: "github", category: "Tools" },
];

// Website ka saara data (projects, reviews, messages, theme, skills) yahan rehta hai.
// Abhi browser mein save hota hai, baad mein yahi functions Firebase se jud jayenge.
export default function SiteProvider({ children }) {
  const [projects, setProjects] = useLocalStorage("site-projects", []);
  const [reviews, setReviews] = useLocalStorage("site-reviews", []);
  const [messages, setMessages] = useLocalStorage("site-messages", []);
  const [theme, setTheme] = useLocalStorage("site-theme", DEFAULT_THEME);
  const [skills, setSkills] = useLocalStorage("site-skills", DEFAULT_SKILLS);

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

