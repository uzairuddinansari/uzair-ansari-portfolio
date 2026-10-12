import Icon from "./Icon";

export default function EmptyState({ icon, title, text }) {
  return (
    <div className="adm-empty">
      <Icon name={icon} size={26} />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
