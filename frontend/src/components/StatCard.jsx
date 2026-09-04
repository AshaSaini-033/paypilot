function StatCard({ title, value, change, icon: Icon, positive = true }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">
          <Icon size={20} />
        </div>

        <span className={`stat-change ${positive ? "positive" : "negative"}`}>
          {change}
        </span>
      </div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default StatCard;