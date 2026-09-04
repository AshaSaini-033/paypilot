import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import TransactionDetails from "./pages/TransactionDetails";
import Gateways from "./pages/Gateways";
import RoutingDecisions from "./pages/RoutingDecisions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/payments/create" element={<CreatePayment />} />
      <Route path="/payments/:id" element={<TransactionDetails />} />
      <Route path="/gateways" element={<Gateways />} />
      <Route path="/routing" element={<RoutingDecisions />} />
    </Routes>
  );
}

export default App;