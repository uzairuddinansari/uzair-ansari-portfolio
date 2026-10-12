import { useState } from "react";
import Stars from "./Stars";
import useSite from "../hooks/useSite";

const EMPTY_FORM = { name: "", role: "", text: "" };

// Public website: #reviews
// Yahan sirf approved reviews dikhte hain. Visitor naya review bhej sakta hai,
// wo admin ke approve karne ke baad dikhega.
export default function ReviewsSection() {
  const { reviews, addReview } = useSite();
  const [form, setForm] = useState(EMPTY_FORM);
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);

  const approved = reviews.filter((r) => r.status === "approved");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    addReview({
      name: form.name.trim(),
      role: form.role.trim(),
      text: form.text.trim(),
      rating,
    });

    setForm(EMPTY_FORM);
    setRating(5);
    setSent(true);
  };

  return (
    <section className="sec" id="reviews">
      <p className="sec-kicker">TESTIMONIALS</p>
      <h2 className="sec-title">Reviews<span>.</span></h2>

      {approved.length === 0 ? (
        <p className="sec-empty">Abhi koi review nahi. Pehla review aap dein!</p>
      ) : (
        <div className="sec-grid">
          {approved.map((r) => (
            <article className="sec-review" key={r.id}>
              <Stars value={r.rating} />
              <p>“{r.text}”</p>
              <div>
                <strong>{r.name}</strong>
                {r.role && <span>{r.role}</span>}
              </div>
            </article>
          ))}
        </div>
      )}

      <form className="sec-form" onSubmit={handleSubmit}>
        <h3>Leave a review</h3>

        {sent ? (
          <p className="sec-success">
            Shukriya! Aapka review admin ke approve karne ke baad website par dikhega.
          </p>
        ) : (
          <>
            <div className="sec-row">
              <input name="name" placeholder="Your name *" value={form.name} onChange={handleChange} maxLength={40} />
              <input name="role" placeholder="Role / Company (optional)" value={form.role} onChange={handleChange} maxLength={60} />
            </div>

            <div className="sec-rating">
              <span>Rating</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={n <= rating ? "on" : ""}
                  aria-label={`${n} star`}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea name="text" rows="4" placeholder="Write your review *" value={form.text} onChange={handleChange} maxLength={400} />

            <button type="submit" className="sec-btn">Submit review ↗</button>
          </>
        )}
      </form>
    </section>
  );
}
