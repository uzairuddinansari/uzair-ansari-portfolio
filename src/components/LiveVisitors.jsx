import { useState } from "react";

// Abhi sirf sample data hai. Baad mein Firebase se real visitors aayenge:
// visitor aaye to list mein add, chala jaye to list se remove.
const SAMPLE_VISITORS = [
  { id: 1, page: "/", device: "Desktop", country: "Pakistan", since: "2 min" },
  { id: 2, page: "/", device: "Mobile", country: "UAE", since: "5 min" },
];

export default function LiveVisitors() {
  const [visitors] = useState(SAMPLE_VISITORS);

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <div>
          <p className="admin-label">01 / LIVE</p>
          <h2>Live Visitors</h2>
        </div>

        <div className="live-count">
          <span className="live-dot" />
          {visitors.length} online
        </div>
      </div>

      {visitors.length === 0 ? (
        <p className="admin-empty">Abhi koi visitor online nahi hai.</p>
      ) : (
        <ul className="visitor-list">
          {visitors.map((v) => (
            <li key={v.id}>
              <span className="live-dot" />
              <span className="visitor-page">{v.page}</span>
              <span>{v.device}</span>
              <span>{v.country}</span>
              <span className="visitor-time">{v.since}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
