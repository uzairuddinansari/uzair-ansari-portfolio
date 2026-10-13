import { useState } from "react";
import useSite from "../hooks/useSite";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

// Public website: #contact  (message admin ke Messages page mein aata hai)
export default function ContactSection() {
  const { addMessage } = useSite();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.email.trim()) newErrors.email = "Email required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.subject.trim()) newErrors.subject = "Subject required";
    if (!form.message.trim()) newErrors.message = "Message required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        status: "unread",
      });
      setForm(EMPTY_FORM);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sec" id="contact">
      <p className="sec-kicker">GET IN TOUCH</p>
      <h2 className="sec-title">Let’s talk<span>.</span></h2>

      <form className="sec-form" onSubmit={handleSubmit} noValidate>
        {sent ? (
          <p className="sec-success">Message mil gaya! Main jaldi jawab dunga.</p>
        ) : (
          <>
            <div className="sec-row">
              <input name="name" placeholder="Your name *" value={form.name} onChange={handleChange} maxLength={40} disabled={loading} />
              {errors.name && <span className="sec-error">{errors.name}</span>}
              <input name="email" type="email" placeholder="Your email *" value={form.email} onChange={handleChange} maxLength={80} disabled={loading} />
              {errors.email && <span className="sec-error">{errors.email}</span>}
            </div>
            <input name="subject" placeholder="Subject *" value={form.subject} onChange={handleChange} maxLength={80} disabled={loading} />
            {errors.subject && <span className="sec-error">{errors.subject}</span>}
            <textarea name="message" rows="5" placeholder="Your message *" value={form.message} onChange={handleChange} maxLength={1000} disabled={loading} />
            {errors.message && <span className="sec-error">{errors.message}</span>}
            <button type="submit" className="sec-btn" disabled={loading}>{loading ? "Sending…" : "Send message ↗"}</button>
          </>
        )}
      </form>
    </section>
  );
}
