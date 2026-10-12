import { useLayoutEffect } from "react";
import SiteContext from "./SiteContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_THEME, applyTheme } from "../utils/theme";

// Website ka saara data (projects, reviews, messages, theme) yahan rehta hai.
// Abhi browser mein save hota hai, baad mein yahi functions Firebase se jud jayenge.
export default function SiteProvider({ children }) {
  const [projects, setProjects] = useLocalStorage("site-projects", []);
  const [reviews, setReviews] = useLocalStorage("site-reviews", []);
  const [messages, setMessages] = useLocalStorage("site-messages", []);
  const [theme, setTheme] = useLocalStorage("site-theme", DEFAULT_THEME);

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

  /* ---------- Theme ---------- */
  const updateTheme = (changes) => setTheme((t) => ({ ...t, ...changes }));
  const resetTheme = () => setTheme(DEFAULT_THEME);

  const value = {
    projects, addProject, deleteProject,
    reviews, addReview, setReviewStatus, deleteReview,
    messages, addMessage, toggleMessageRead, deleteMessage,
    theme, updateTheme, resetTheme,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
