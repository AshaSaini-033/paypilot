import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Cpu,
  CreditCard,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import { getPaymentById } from "../services/api";

function TransactionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayment();
  }, [id]);

  const loadPayment = async () => {
    try {
      const data = await getPaymentById(id);
      setPayment(data);
    } catch (error) {
      console.error("Payment fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Navbar />
          <main className="page-content">
            <h1>Loading transaction...</h1>
          </main>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Navbar />
          <main className="page-content">
            <h1>Transaction not found</h1>

            <button
              className="secondary-btn"
              onClick={() => navigate("/payments")}
            >
              Back to Payments
            </button>
          </main>
        </div>
      </div>
    );
  }

  const isRecovered = payment.status === "RECOVERED";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="page-content">
          <button
            className="back-btn"
            onClick={() => navigate("/payments")}
          >
            <ArrowLeft size={17} />
            Back to Payments
          </button>

          <div className="page-header">
            <div>
              <span className="page-eyebrow">TRANSACTION DETAILS</span>
              <h1>{payment.transaction_id}</h1>
              <p>
                {new Date(payment.created_at).toLocaleString("en-IN")}
              </p>
            </div>

            <StatusBadge status={payment.status} />
          </div>

          <div className="transaction-grid">
            <div className="details-card">
              <div className="card-heading">
                <CreditCard size={19} />
                <h2>Payment Information</h2>
              </div>

              <div className="details-list">
                <div>
                  <span>Transaction ID</span>
                  <strong>{payment.transaction_id}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Payment Method</span>
                  <strong>{payment.payment_method}</strong>
                </div>

                <div>
                  <span>Bank</span>
                  <strong>{payment.bank}</strong>
                </div>

                <div>
                  <span>Initial Gateway</span>
                  <strong>{payment.initial_gateway || "-"}</strong>
                </div>

                <div>
                  <span>Final Gateway</span>
                  <strong>{payment.final_gateway || "-"}</strong>
                </div>

                <div>
                  <span>Total Attempts</span>
                  <strong>{payment.attempts}</strong>
                </div>

                <div>
                  <span>Processing Latency</span>
                  <strong>{payment.latency || 0} ms</strong>
                </div>
              </div>
            </div>

            <div className="details-card">
              <div className="card-heading">
                <Cpu size={19} />
                <h2>AI Routing Decision</h2>
              </div>

              <div className="ai-decision">
                <div className="decision-route">
                  <span>Selected Gateway</span>
                  <strong>
                    {payment.final_gateway || "Calculating..."}
                  </strong>
                </div>

                <p>
                  {isRecovered
                    ? "Initial gateway failed. PayPilot automatically selected an alternate healthy gateway and recovered the payment."
                    : payment.status === "SUCCESS"
                    ? "PayPilot successfully processed the payment through the selected gateway."
                    : "PayPilot evaluated the available gateway routes for this transaction."}
                </p>
              </div>
            </div>
          </div>

          <div className="details-card attempts-card">
            <div className="card-heading">
              <RotateCcw size={19} />
              <h2>Payment Attempts</h2>
            </div>

            <div className="attempt-timeline">
              <div
                className={`attempt ${
                  payment.status === "FAILED" ? "failed" : "success"
                }`}
              >
                <div className="attempt-icon">
                  {payment.status === "FAILED" ? (
                    <XCircle size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                </div>

                <div className="attempt-content">
                  <strong>
                    {payment.final_gateway || "Gateway pending"}
                  </strong>

                  <span>
                    {payment.status === "FAILED"
                      ? "Payment failed"
                      : "Payment processed"}
                  </span>
                </div>

                <span className="attempt-status">
                  {payment.status}
                </span>
              </div>
            </div>
          </div>

          <div className="transaction-footer-info">
            <Clock3 size={17} />

            <span>
              Transaction processed through PayPilot intelligent routing.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TransactionDetails;