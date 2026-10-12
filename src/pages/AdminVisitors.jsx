import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import useVisitorStats from "../hooks/useVisitorStats";
import { duration } from "../utils/format";

// /adminpanel/visitors
export default function AdminVisitors() {
  const { visitors, now } = useVisitorStats();

  return (
    <>
      <PageHeader
        eyebrow="LIVE"
        title="Live Visitors"
        text="Jo visitor aayega list mein dikhega, aur jaate hi gayab ho jayega."
      >
        <span className="adm-pill big">
          <span className="adm-live-dot" />
          {visitors.length} online
        </span>
      </PageHeader>

      <section className="adm-card">
        {visitors.length === 0 ? (
          <EmptyState
            icon="eye"
            title="Abhi koi online nahi"
            text="Apni website kisi doosre tab mein kholo, wo yahan nazar aayegi."
          />
        ) : (
          <div className="adm-table">
            <div className="adm-table-row adm-table-head">
              <span>DEVICE</span>
              <span>BROWSER</span>
              <span>LOCATION</span>
              <span>PAGE</span>
              <span>ON SITE</span>
            </div>

            {visitors.map((v) => (
              <div className="adm-table-row" key={v.id}>
                <span className="adm-cell-strong">
                  <span className="adm-live-dot" /> {v.device}
                </span>
                <span>{v.browser}</span>
                <span>{v.timezone}</span>
                <span>{v.page}</span>
                <span className="adm-muted">{duration(now - v.joined)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
