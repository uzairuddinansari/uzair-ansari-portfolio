import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis — initializes Lenis smooth scroll and wires it to GSAP's ticker
 * so ScrollTrigger stays in sync.
 * Call this ONCE at the top level (in HOME).
 */
export default function useLenis() {
  useEffect(() => {
    // Ultra-smooth, lightweight Lenis configuration (zero drag lag)
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // Refresh ScrollTrigger once Lenis is ready
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, []);
}
