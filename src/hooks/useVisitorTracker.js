import { useEffect } from "react";
import { dayKey } from "../utils/format";

// Public website par lagta hai. Har 5 second mein "main yahan hoon" likhta hai,
// aur tab band hote hi apni entry hata deta hai.
// NOTE: abhi ye sirf isi browser ke tabs mein kaam karta hai.
// Asli visitors ke liye baad mein Firebase lagega, hook wahi rahega.

const getDevice = () => (window.innerWidth < 768 ? "Mobile" : "Desktop");

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Browser";
}

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

function countVisit() {
  if (sessionStorage.getItem("visit-counted")) return;
  sessionStorage.setItem("visit-counted", "1");

  localStorage.setItem(
    "site-total-visits",
    String(Number(localStorage.getItem("site-total-visits") || 0) + 1)
  );

  const daily = readJSON("site-daily-visits", {});
  daily[dayKey()] = (daily[dayKey()] || 0) + 1;
  localStorage.setItem("site-daily-visits", JSON.stringify(daily));
}

export default function useVisitorTracker() {
  useEffect(() => {
    const id = crypto.randomUUID();
    const joined = Date.now();

    const ping = () => {
      const all = readJSON("site-visitors", {});
      all[id] = {
        id,
        joined,
        lastSeen: Date.now(),
        page: window.location.pathname,
        device: getDevice(),
        browser: getBrowser(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      localStorage.setItem("site-visitors", JSON.stringify(all));
    };

    const leave = () => {
      const all = readJSON("site-visitors", {});
      delete all[id];
      localStorage.setItem("site-visitors", JSON.stringify(all));
    };

    countVisit();
    ping();
    const timer = setInterval(ping, 5000);
    window.addEventListener("pagehide", leave);

    return () => {
      clearInterval(timer);
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, []);
}
