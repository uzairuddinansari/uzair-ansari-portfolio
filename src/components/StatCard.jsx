import Icon from "./Icon";

export default function StatCard({ label, value, hint, icon }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-top">
        {label}
        <span className="adm-stat-icon">
          <Icon name={icon} size={17} />
        </span>
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}
