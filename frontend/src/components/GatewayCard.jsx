import { Activity, Clock3, CircleDollarSign } from "lucide-react";

function GatewayCard({
  name,
  status,
  successRate,
  latency,
  fee,
  selected = false,
}) {
  const isOnline = status === "Operational";

  return (
    <div className={`gateway-card ${selected ? "selected" : ""}`}>
      <div className="gateway-header">
        <div>
          <h3>{name}</h3>

          <span className={`gateway-status ${isOnline ? "online" : "offline"}`}>
            <i></i>
            {status}
          </span>
        </div>

        {selected && <span className="ai-selected">AI Selected</span>}
      </div>

      <div className="gateway-metrics">
        <div className="gateway-metric">
          <Activity size={17} />
          <div>
            <span>Success Rate</span>
            <strong>{successRate}%</strong>
          </div>
        </div>

        <div className="gateway-metric">
          <Clock3 size={17} />
          <div>
            <span>Avg. Latency</span>
            <strong>{latency} ms</strong>
          </div>
        </div>

        <div className="gateway-metric">
          <CircleDollarSign size={17} />
          <div>
            <span>Transaction Fee</span>
            <strong>₹{fee}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GatewayCard;