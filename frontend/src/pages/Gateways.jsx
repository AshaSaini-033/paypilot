import {
  Activity,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import GatewayCard from "../components/GatewayCard";
import { getGateways } from "../services/api";

function Gateways() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      const data = await getGateways();
      setGateways(data);
    } catch (error) {
      console.error("Gateway fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="page-content">
          <div className="page-header">
            <div>
              <span className="page-eyebrow">INFRASTRUCTURE</span>
              <h1>Payment Gateways</h1>
              <p>
                Monitor gateway health and performance in real time.
              </p>
            </div>

            <button className="secondary-btn" onClick={loadGateways}>
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="table-card">
              <p style={{ padding: "30px" }}>Loading gateways...</p>
            </div>
          ) : (
            <>
              <div className="gateway-grid gateway-page-grid">
                {gateways.map((gateway) => (
                  <GatewayCard
                    key={gateway.id}
                    name={gateway.name}
                    status={
                      gateway.active && !gateway.circuit_open
                        ? "Operational"
                        : "Unavailable"
                    }
                    successRate={gateway.success_rate}
                    latency={gateway.average_latency}
                    fee={gateway.transaction_fee}
                    selected={gateway.id === 3}
                  />
                ))}
              </div>

              <section className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>Gateway Monitoring</h2>
                    <p>
                      Current operational status of all payment routes.
                    </p>
                  </div>
                </div>

                <div className="monitoring-card">
                  {gateways.map((gateway) => {
                    const operational =
                      gateway.active && !gateway.circuit_open;

                    return (
                      <div className="monitoring-row" key={gateway.id}>
                        <div className="monitoring-gateway">
                          <div className="monitoring-icon">
                            <Server size={18} />
                          </div>

                          <div>
                            <strong>{gateway.name}</strong>
                            <span>Payment route</span>
                          </div>
                        </div>

                        <div className="monitoring-metric">
                          <Activity size={16} />
                          <span>{gateway.success_rate}%</span>
                        </div>

                        <div className="monitoring-metric">
                          <Clock3 size={16} />
                          <span>{gateway.average_latency} ms</span>
                        </div>

                        <div
                          className={`monitoring-status ${
                            operational ? "operational" : "failed"
                          }`}
                        >
                          {operational ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}

                          {operational
                            ? "Operational"
                            : "Unavailable"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>Gateway Reliability</h2>
                    <p>
                      Success and failure distribution across routes.
                    </p>
                  </div>
                </div>

                <div className="reliability-grid">
                  <div className="reliability-card">
                    <div className="reliability-icon success">
                      <CheckCircle2 size={19} />
                    </div>

                    <span>Successful Requests</span>
                    <strong>Live Data</strong>
                  </div>

                  <div className="reliability-card">
                    <div className="reliability-icon failure">
                      <XCircle size={19} />
                    </div>

                    <span>Failed Requests</span>
                    <strong>Live Data</strong>
                  </div>

                  <div className="reliability-card">
                    <div className="reliability-icon">
                      <Activity size={19} />
                    </div>

                    <span>Overall Success Rate</span>
                    <strong>
                      {gateways.length > 0
                        ? (
                            gateways.reduce(
                              (sum, gateway) =>
                                sum + Number(gateway.success_rate),
                              0
                            ) / gateways.length
                          ).toFixed(1)
                        : "0.0"}
                      %
                    </strong>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Gateways;