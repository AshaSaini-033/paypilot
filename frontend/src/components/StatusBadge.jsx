function StatusBadge({ status }) {
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${statusClass}`}>
      <i></i>
      {status}
    </span>
  );
}

export default StatusBadge;