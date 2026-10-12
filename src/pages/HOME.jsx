import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import Navbar from "../components/Nav.jsx";
import ProjectsSection from "../components/ProjectsSection.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import Footer from "../components/Footer.jsx";
import useVisitorTracker from "../hooks/useVisitorTracker";
import useLenis from "../hooks/useLenis";
import "../styles/Sections.css";

function HOME() {
  const location = useLocation();
  useVisitorTracker(); // admin ko live visitor dikhane ke liye
  useLenis();          // Lenis smooth scroll (synced with GSAP ScrollTrigger)

  useEffect(() => {
    if (location.hash === "#contact" || location.state?.scrollTo === "contact") {
      const timer = setTimeout(() => {
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProjectsSection />
        <ReviewsSection />
      </main>

      {/* Footer has Let's Talk contact section built-in */}
      <Footer />
    </>
  );
}

export default HOME;
