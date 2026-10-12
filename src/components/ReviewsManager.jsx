import { useState } from "react";

const EMPTY_FORM = { name: "", role: "", rating: "5", text: "" };

export default function ReviewsManager() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [reviews, setReviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    setReviews([{ id: Date.now(), ...form }, ...reviews]);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <div>
          <p className="admin-label">03 / REVIEWS</p>
          <h2>Reviews</h2>
        </div>
        <span className="admin-total">{reviews.length} total</span>
      </div>

      <form className="admin-form" onSubmit={handleAdd}>
        <input
          name="name"
          placeholder="Client name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="role"
          placeholder="Role / Company (optional)"
          value={form.role}
          onChange={handleChange}
        />
        <select name="rating" value={form.rating} onChange={handleChange}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} Stars</option>
          ))}
        </select>
        <textarea
          name="text"
          rows="3"
          placeholder="Review"
          value={form.text}
          onChange={handleChange}
        />

        <button type="submit" className="admin-btn">Add Review ↗</button>
      </form>

      {reviews.length === 0 ? (
        <p className="admin-empty">Abhi koi review add nahi hua.</p>
      ) : (
        <div className="admin-grid">
          {reviews.map((r) => (
            <article key={r.id} className="review-card">
              <div className="review-stars">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>
              <p>“{r.text}”</p>
              <h3>{r.name}</h3>
              {r.role && <span>{r.role}</span>}

              <div className="card-actions">
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
