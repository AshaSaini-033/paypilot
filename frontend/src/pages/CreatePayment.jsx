import { ArrowLeft, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { createPayment } from "../services/api";

function CreatePayment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "",
    bank: "",
    customerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Backend ko payment request bhej rahe hain
      const payment = await createPayment(formData);

      // Successful payment ke baad details page par ja rahe hain
      navigate(`/payments/${payment.id}`);
    } catch (err) {
      console.error(err);
      setError("Payment process nahi ho paya.");
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
          <button className="back-btn" onClick={() => navigate("/payments")}>
            <ArrowLeft size={17} />
            Back to Payments
          </button>

          <div className="page-header">
            <div>
              <span className="page-eyebrow">PAYMENT</span>
              <h1>Create Payment</h1>
              <p>
                PayPilot will automatically select the optimal payment route.
              </p>
            </div>
          </div>

          <div className="payment-form-layout">
            <form className="form-card" onSubmit={handlePayment}>
              <div className="form-section">
                <div className="form-section-title">
                  <CreditCard size={19} />
                  <h2>Payment Details</h2>
                </div>

                <div className="form-group">
                  <label>Amount</label>

                  <div className="amount-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="amount"
                      placeholder="Enter amount"
                      min="1"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Method</label>

                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select method</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="NET_BANKING">Net Banking</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bank</label>

                    <select
                      name="bank"
                      value={formData.bank}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select bank</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Customer Email</label>

                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="customer@example.com"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <p className="form-error">{error}</p>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => navigate("/payments")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  <CreditCard size={17} />
                  {loading ? "Processing..." : "Process Payment"}
                </button>
              </div>
            </form>

            <div className="ai-info-card">
              <div className="ai-icon">
                <Sparkles size={21} />
              </div>

              <h2>AI-Powered Routing</h2>

              <p>
                PayPilot will analyze the current gateway conditions and
                automatically select the best route for your payment.
              </p>

              <div className="ai-feature">
                <ShieldCheck size={18} />

                <div>
                  <strong>Smart Route Selection</strong>
                  <span>
                    Success rate, latency and cost are considered.
                  </span>
                </div>
              </div>

              <div className="ai-feature">
                <ShieldCheck size={18} />

                <div>
                  <strong>Autonomous Recovery</strong>
                  <span>
                    Failed payments can be rerouted automatically.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreatePayment;