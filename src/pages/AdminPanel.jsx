import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import Stars from "../components/Stars";
import useSite from "../hooks/useSite";
import useVisitorStats from "../hooks/useVisitorStats";
import { lastSevenDays, timeAgo } from "../utils/format";

// Overview page: /adminpanel
export default function AdminPanel() {
  const { projects, reviews, messages } = useSite();
  const { visitors, totalVisits, daily } = useVisitorStats();

  const days = lastSevenDays().map((d) => ({ ...d, count: daily[d.key] || 0 }));
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const unread = messages.filter((m) => !m.read).length;
  const pending = reviews.filter((r) => r.status === "pending").length;
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : "–";

  return (
    <>
      <section className="adm-banner">
        <div>
          <p className="adm-eyebrow">ADMINISTRATION / OVERVIEW</p>
          <h1>Welcome back, Uzair<span>.</span></h1>
          <p>Yahan se apni website ka sab kuch control karo.</p>
        </div>

        <div className="adm-actions">
          <Link className="adm-btn" to="/adminpanel/projects">
            <Icon name="plus" size={16} /> Add project
          </Link>
          <a className="adm-btn adm-btn-ghost" href="/" target="_blank" rel="noreferrer">
            View website <Icon name="external" size={16} />
          </a>
        </div>
      </section>

      <section className="adm-stats">
        <StatCard
          label="Online now"
          value={visitors.length}
          hint="Abhi website par"
          icon="eye"
        />
        <StatCard
          label="Total visits"
          value={totalVisits}
          hint="Is browser se ginti"
          icon="trend"
        />
        <StatCard
          label="Projects"
          value={projects.length}
          hint="Website par dikh rahe hain"
          icon="briefcase"
        />
        <StatCard
          label="Reviews"
          value={reviews.length}
          hint={`Average ${average} / 5 · ${pending} pending`}
          icon="star"
        />
        <StatCard
          label="Unread messages"
          value={unread}
          hint={`${messages.length} total`}
          icon="mail"
        />
      </section>

      <section className="adm-two">
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Visits — last 7 days</h3>
            <span>{days.reduce((sum, d) => sum + d.count, 0)} total</span>
          </div>

          <div className="adm-bars">
            {days.map((d) => (
              <div className="adm-bar-col" key={d.key}>
                <span className="adm-bar-value">{d.count}</span>
                <div className="adm-bar-track">
                  <div
                    className="adm-bar"
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="adm-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Quick links</h3>
          </div>

          <div className="adm-quick">
            <Link to="/adminpanel/reviews">
              <Icon name="star" /> Reviews approve karo
              <span>{pending} pending</span>
            </Link>
            <Link to="/adminpanel/messages">
              <Icon name="mail" /> Messages dekho
              <span>{unread} unread</span>
            </Link>
            <Link to="/adminpanel/appearance">
              <Icon name="sliders" /> Website ke colours badlo
            </Link>
            <Link to="/adminpanel/visitors">
              <Icon name="eye" /> Live visitors dekho
            </Link>
          </div>
        </div>
      </section>

      <section className="adm-two">
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Latest reviews</h3>
            <Link className="adm-link-text" to="/adminpanel/reviews">View all</Link>
          </div>

          {reviews.length === 0 ? (
            <EmptyState icon="star" title="No reviews yet" text="Jab visitor review dalega to yahan dikhega." />
          ) : (
            <ul className="adm-list">
              {reviews.slice(0, 3).map((r) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.name}</strong>
                    <Stars value={r.rating} />
                    <p>{r.text}</p>
                  </div>
                  <span className="adm-muted">{timeAgo(r.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Latest messages</h3>
            <Link className="adm-link-text" to="/adminpanel/messages">View all</Link>
          </div>

          {messages.length === 0 ? (
            <EmptyState icon="mail" title="No messages yet" text="Contact form se aane wale messages yahan aayenge." />
          ) : (
            <ul className="adm-list">
              {messages.slice(0, 3).map((m) => (
                <li key={m.id}>
                  <div>
                    <strong>
                      {!m.read && <span className="adm-unread-dot" />}
                      {m.name}
                    </strong>
                    <p>{m.message}</p>
                  </div>
                  <span className="adm-muted">{timeAgo(m.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
