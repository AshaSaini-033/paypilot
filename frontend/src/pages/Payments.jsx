import { Eye, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import { getPayments } from "../services/api";

function Payments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Payments fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.transaction_id
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="page-content">
          <div className="page-header">
            <div>
              <span className="page-eyebrow">TRANSACTIONS</span>
              <h1>Payments</h1>
              <p>View and manage all payment transactions.</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => navigate("/payments/create")}
            >
              <Plus size={17} />
              Create Payment
            </button>
          </div>

          <div className="table-card">
            <div className="table-toolbar">
              <div className="table-search">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select className="filter-select">
                <option>All Status</option>
                <option>SUCCESS</option>
                <option>RECOVERED</option>
                <option>FAILED</option>
              </select>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Gateway</th>
                    <th>Attempts</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7">Loading payments...</td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7">No payments found.</td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <strong>{payment.transaction_id}</strong>
                        </td>

                        <td>
                          ₹{Number(payment.amount).toLocaleString("en-IN")}
                        </td>

                        <td>{payment.payment_method}</td>

                        <td>{payment.final_gateway || "-"}</td>

                        <td>{payment.attempts}</td>

                        <td>
                          <StatusBadge status={payment.status} />
                        </td>

                        <td>
                          <button
                            className="icon-btn"
                            onClick={() =>
                              navigate(`/payments/${payment.id}`)
                            }
                            title="View transaction"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Payments;