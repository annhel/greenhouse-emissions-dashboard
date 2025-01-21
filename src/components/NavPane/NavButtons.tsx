import { BarChart, CompareArrows, Schedule } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Overview",
      icon: <BarChart />,
      path: "/",
    },
    {
      label: "Compare",
      icon: <CompareArrows />,
      path: "/compare",
    },
    {
      label: "Recent Dashboards",
      icon: <Schedule />,
      path: "/recent-dashboards",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="display-flex flex-dir-col">
        {navItems.map((navItem) => (
          <button
            key={navItem.label}
            className={`nav-button ${isActive(navItem.path) ? "active" : ""}`}
            onClick={() => navigate(navItem.path)}
          >
            {navItem.icon}
            {navItem.label}
          </button>
        ))}
      </div>
    </>
  );
}
