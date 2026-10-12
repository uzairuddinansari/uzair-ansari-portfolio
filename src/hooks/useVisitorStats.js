import { useEffect, useState } from "react";

// Admin side: live visitors + total visits + daily visits (har 2 second mein refresh)
const STALE_MS = 15000; // 15 sec se zyada koi ping nahi aaya = visitor ja chuka

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

function snapshot() {
  const now = Date.now();
  const visitors = Object.values(readJSON("site-visitors", {}))
    .filter((v) => now - v.lastSeen < STALE_MS)
    .sort((a, b) => b.joined - a.joined);

  return {
    now,
    visitors,
    totalVisits: Number(localStorage.getItem("site-total-visits") || 0),
    daily: readJSON("site-daily-visits", {}),
  };
}

export default function useVisitorStats() {
  const [stats, setStats] = useState(snapshot);

  useEffect(() => {
    const timer = setInterval(() => setStats(snapshot()), 2000);
    return () => clearInterval(timer);
  }, []);

  return stats;
}
