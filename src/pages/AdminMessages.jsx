import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import useSite from "../hooks/useSite";
import { timeAgo } from "../utils/format";

// /adminpanel/messages  (website ke Contact form se aate hain)
export default function AdminMessages() {
  const { messages, toggleMessageRead, deleteMessage } = useSite();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        eyebrow="INBOX"
        title="Messages"
        text="Website ke Contact form se aane wale messages."
      >
        <span className="adm-pill big">{unread} unread</span>
      </PageHeader>

      {messages.length === 0 ? (
        <EmptyState
          icon="mail"
          title="Inbox khali hai"
          text="Jab koi Contact form bharega to message yahan aayega."
        />
      ) : (
        <div className="adm-messages">
          {messages.map((m) => (
            <article className={`adm-message ${m.read ? "" : "unread"}`} key={m.id}>
              <div className="adm-message-top">
                <div>
                  <strong>
                    {!m.read && <span className="adm-unread-dot" />}
                    {m.name}
                  </strong>
                  <a className="adm-link-text" href={`mailto:${m.email}`}>{m.email}</a>
                </div>
                <span className="adm-muted">{timeAgo(m.date)}</span>
              </div>

              <p>{m.message}</p>

              <div className="adm-card-actions">
                <a className="adm-btn adm-btn-sm" href={`mailto:${m.email}`}>
                  Reply <Icon name="external" size={14} />
                </a>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => toggleMessageRead(m.id)}>
                  {m.read ? "Mark unread" : "Mark read"}
                </button>
                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-danger" onClick={() => deleteMessage(m.id)}>
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
