import Hero from "../components/Hero.jsx";
import Navbar from "../components/Nav.jsx";
import ProjectsSection from "../components/ProjectsSection.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import useVisitorTracker from "../hooks/useVisitorTracker";
import "../styles/Sections.css";

function HOME() {
  useVisitorTracker(); // admin ko live visitor dikhane ke liye

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProjectsSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      <footer className="sec-footer">© 2026 Uzair Ansari. All rights reserved.</footer>
    </>
  );
}

export default HOME;
