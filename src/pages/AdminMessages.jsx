import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import useSite from "../hooks/useSite";
import { timeAgo } from "../utils/format";

// /adminpanel/messages  (website ke Contact form se aate hain)
export default function AdminMessages() {
  const { messages, toggleMessageRead, deleteMessage, setMessageStatus } = useSite();
  const unread = messages.filter((m) => !m.read).length;
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  // Initialize EmailJS with public key
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

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
                <button
                  className="adm-btn adm-btn-sm"
                  onClick={() => {
                    setSelectedMessage(m);
                    setReplyText("");
                    setReplyError("");
                    setReplySuccess("");
                    setReplyOpen(true);
                  }}
                >
                  Reply <Icon name="external" size={14} />
                </button>
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

      {replyOpen && selectedMessage && (
        <div className="adm-reply-modal" onClick={() => setReplyOpen(false)}>
          <div className="adm-reply-content" onClick={e => e.stopPropagation()}>
            <h3>Reply to {selectedMessage.name}</h3>
            <p><strong>Subject:</strong> {selectedMessage.subject || "(no subject)"}</p>
            <p><strong>Message:</strong></p>
            <p className="adm-reply-original">{selectedMessage.message}</p>
            <textarea
              placeholder="Your reply..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={6}
            />
            {replyError && <p className="adm-error">{replyError}</p>}
            {replySuccess && <p className="adm-success">{replySuccess}</p>}
            <div className="adm-reply-actions">
              <button
                className="adm-btn"
                disabled={replyLoading}
                onClick={async () => {
                  setReplyLoading(true);
                  setReplyError("");
                  setReplySuccess("");
                  try {
                    await emailjs.send(
                      import.meta.env.VITE_EMAILJS_SERVICE_ID,
                      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                      {
                        customer_email: selectedMessage.email,
                        subject: `Re: ${selectedMessage.subject || ""}`,
                        message: replyText,
                      }
                    );
                    setReplySuccess("Reply sent successfully.");
                    setMessageStatus(selectedMessage.id, "replied");
                  } catch (err) {
                    console.error(err);
                    setReplyError(`Failed to send reply: ${err.text || err.message}`);
                  } finally {
                    setReplyLoading(false);
                  }
                }}
              >
                {replyLoading ? "Sending…" : "Send Reply"}
              </button>
              <button className="adm-btn adm-btn-ghost" onClick={() => setReplyOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
