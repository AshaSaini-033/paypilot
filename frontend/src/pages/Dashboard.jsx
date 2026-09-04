import {
  CreditCard,
  CheckCircle2,
  RotateCcw,
  Timer,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import GatewayCard from "../components/GatewayCard";
import { getGateways, getPayments } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [gateways, setGateways] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [gatewayData, paymentData] = await Promise.all([
        getGateways(),
        getPayments(),
      ]);

      setGateways(gatewayData);
      setPayments(paymentData);
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPayments = payments.length;

  const successfulPayments = payments.filter(
    (payment) =>
      payment.status === "SUCCESS" ||
      payment.status === "RECOVERED"
  ).length;

  const recoveredPayments = payments.filter(
    (payment) => payment.status === "RECOVERED"
  ).length;

  const successRate =
    totalPayments > 0
      ? ((successfulPayments / totalPayments) * 100).toFixed(1)
      : "0.0";

  const averageLatency =
    payments.length > 0
      ? Math.round(
          payments.reduce(
            (sum, payment) => sum + Number(payment.latency || 0),
            0
          ) / payments.length
        )
      : 0;

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="page-content">
          <div className="page-header">
            <div>
              <span className="page-eyebrow">OVERVIEW</span>

              <h1>Payment Routing Dashboard</h1>

              <p>
                Monitor payment performance and AI-powered routing decisions.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => navigate("/payments/create")}
            >
              <CreditCard size={17} />
              Create Payment
            </button>
          </div>

          {loading ? (
            <div className="table-card">
              <p style={{ padding: "30px" }}>
                Loading dashboard...
              </p>
            </div>
          ) : (
            <>
              <section className="stats-grid">
                <StatCard
                  title="Total Payments"
                  value={totalPayments}
                  change="Live"
                  icon={CreditCard}
                />

                <StatCard
                  title="Success Rate"
                  value={`${successRate}%`}
                  change="Live"
                  icon={CheckCircle2}
                />

                <StatCard
                  title="Auto Recovered"
                  value={recoveredPayments}
                  change="Live"
                  icon={RotateCcw}
                />

                <StatCard
                  title="Avg. Latency"
                  value={`${averageLatency} ms`}
                  change="Live"
                  icon={Timer}
                />
              </section>

              <section className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>Gateway Health</h2>

                    <p>
                      Current performance of connected payment gateways.
                    </p>
                  </div>

                  <button
                    className="text-btn"
                    onClick={() => navigate("/gateways")}
                  >
                    View all
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="gateway-grid">
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
              </section>

              <section className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>AI Routing Overview</h2>

                    <p>
                      Current gateway traffic distribution.
                    </p>
                  </div>
                </div>

                <div className="routing-overview">
                  {gateways.map((gateway) => {
                    const gatewayPayments = payments.filter(
                      (payment) =>
                        payment.final_gateway === gateway.name
                    );

                    const percentage =
                      totalPayments > 0
                        ? Math.round(
                            (gatewayPayments.length /
                              totalPayments) *
                              100
                          )
                        : 0;

                    return (
                      <div key={gateway.id}>
                        <div className="routing-item">
                          <div className="routing-label">
                            <span className="gateway-dot"></span>
                            <span>{gateway.name}</span>
                          </div>

                          <strong>{percentage}%</strong>
                        </div>

                        <div className="routing-progress">
                          <div
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;