import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Stars from "../components/Stars";
import useSite from "../hooks/useSite";
import { timeAgo } from "../utils/format";

const FILTERS = ["all", "pending", "approved", "hidden"];

// /adminpanel/reviews
// Review visitor website par dalta hai. Admin yahan sirf dekhta hai,
// approve karta hai (website par dikhane ke liye), hide karta hai ya delete.
export default function AdminReviews() {
  const { reviews, setReviewStatus, deleteReview } = useSite();
  const [filter, setFilter] = useState("all");

  const count = (status) =>
    status === "all" ? reviews.length : reviews.filter((r) => r.status === status).length;

  const shown = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="FEEDBACK"
        title="Reviews"
        text="Visitors ke reviews. Jo approve karoge wahi website par dikhenge."
      />

      <div className="adm-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f} <span>{count(f)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="star"
          title="Koi review nahi"
          text="Website ke Reviews section se visitors review bhej sakte hain."
        />
      ) : (
        <div className="adm-reviews">
          {shown.map((r) => (
            <article className="adm-review" key={r.id}>
              <div className="adm-review-top">
                <Stars value={r.rating} />
                <span className={`adm-chip ${r.status}`}>{r.status}</span>
              </div>

              <p className="adm-review-text">“{r.text}”</p>

              <div className="adm-review-who">
                <strong>{r.name}</strong>
                {r.role && <span>{r.role}</span>}
                <span>{timeAgo(r.date)}</span>
              </div>

              <div className="adm-card-actions">
                {r.status !== "approved" && (
                  <button className="adm-btn adm-btn-sm" onClick={() => setReviewStatus(r.id, "approved")}>
                    <Icon name="check" size={14} /> Approve
                  </button>
                )}
                {r.status === "approved" && (
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setReviewStatus(r.id, "hidden")}>
                    Hide
                  </button>
                )}
                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-danger" onClick={() => deleteReview(r.id)}>
                  <Icon name="trash" size={14} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
