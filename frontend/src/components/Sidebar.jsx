import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Network,
  Route,
  Activity,
  Zap,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: CreditCard,
    },
    {
      name: "Gateways",
      path: "/gateways",
      icon: Network,
    },
    {
      name: "AI Routing",
      path: "/routing",
      icon: Route,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={20} />
        </div>

        <div>
          <h2>PayPilot</h2>
          <span>Payment Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-heading">MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <Activity size={17} />

          <div>
            <span>System Status</span>
            <strong>
              <i></i> Operational
            </strong>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;