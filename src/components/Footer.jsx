import { useState } from "react";
import useSite from "../hooks/useSite";
import "../styles/Footer.css";

const EMPTY_FORM = { name: "", email: "", message: "" };

export default function Footer() {
  const { addMessage } = useSite();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    addMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setForm(EMPTY_FORM);
    setSent(true);
  };

  return (
    <footer className="footer" id="contact">
      {/* ── Decorative blobs ── */}
      <div className="footer-blob footer-blob--left" aria-hidden="true" />
      <div className="footer-blob footer-blob--right" aria-hidden="true" />

      <div className="footer-inner">
        {/* ── Let's Talk ── */}
        <div className="footer-talk">
          <p className="footer-kicker">GET IN TOUCH</p>
          <h2 className="footer-heading">
            Let's talk<span className="footer-dot">.</span>
          </h2>
          <p className="footer-sub">
            Have a project in mind or just want to say hi? Drop me a message —
            I reply within&nbsp;24 hours.
          </p>

          {/* Social pills */}
          <div className="footer-socials">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-social-pill"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-social-pill"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="mailto:hello@example.com"
              className="footer-social-pill"
              aria-label="Email"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Email
            </a>
          </div>
        </div>

        {/* ── Contact form ── */}
        <div className="footer-form-wrap">
          <form className="footer-form" onSubmit={handleSubmit} noValidate>
            {sent ? (
              <div className="footer-success">
                <span className="footer-success-icon">✓</span>
                <p>Message mil gaya! Main jaldi jawab dunga.</p>
              </div>
            ) : (
              <>
                <div className="footer-row">
                  <div className="footer-field">
                    <label htmlFor="ft-name">Your name</label>
                    <input
                      id="ft-name"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      maxLength={40}
                      autoComplete="name"
                    />
                  </div>
                  <div className="footer-field">
                    <label htmlFor="ft-email">Your email</label>
                    <input
                      id="ft-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      maxLength={80}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="footer-field">
                  <label htmlFor="ft-message">Message</label>
                  <textarea
                    id="ft-message"
                    name="message"
                    rows="5"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={handleChange}
                    maxLength={1000}
                  />
                </div>

                <button type="submit" className="footer-send-btn">
                  Send message
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p>© 2026 Uzair Ansari. All rights reserved.</p>
        <nav className="footer-bottom-links" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
