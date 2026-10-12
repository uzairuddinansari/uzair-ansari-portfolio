export default function PageHeader({ eyebrow, title, text, children }) {
  return (
    <div className="adm-page-head">
      <div>
        <p className="adm-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}
