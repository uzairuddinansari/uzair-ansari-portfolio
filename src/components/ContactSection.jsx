import { useState } from "react";
import useSite from "../hooks/useSite";

const EMPTY_FORM = { name: "", email: "", message: "" };

// Public website: #contact  (message admin ke Messages page mein aata hai)
export default function ContactSection() {
  const { addMessage } = useSite();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <section className="sec" id="contact">
      <p className="sec-kicker">GET IN TOUCH</p>
      <h2 className="sec-title">Let’s talk<span>.</span></h2>

      <form className="sec-form" onSubmit={handleSubmit}>
        {sent ? (
          <p className="sec-success">Message mil gaya! Main jaldi jawab dunga.</p>
        ) : (
          <>
            <div className="sec-row">
              <input name="name" placeholder="Your name *" value={form.name} onChange={handleChange} maxLength={40} />
              <input name="email" type="email" placeholder="Your email *" value={form.email} onChange={handleChange} maxLength={80} />
            </div>

            <textarea name="message" rows="5" placeholder="Your message *" value={form.message} onChange={handleChange} maxLength={1000} />

            <button type="submit" className="sec-btn">Send message ↗</button>
          </>
        )}
      </form>
    </section>
  );
}
