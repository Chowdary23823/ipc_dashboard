import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/attainment", label: "Attainment" },
  { path: "/Reliabilityweekly", label: "Reliabilityweekly" },
  { path: "/Reliability", label: "Reliability" },
  { path: "/EagleEye", label: "EagleEye" },
  { path: "/FDP_view", label: "FDP_view" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div
      className="d-flex flex-column p-4 h-100"
      style={{
        backgroundColor: "#e9ecef",
        // color: "#0460a0",
      }}
    >
      <ul className="nav nav-pills flex-column gap-3">
        {links.map(({ path, label }) => (
          <li key={path} className="nav-item">
            {/* The conditional logic for the external 'View' link has been removed. */}
            <Link
              to={path}
              className={`nav-link ${
                pathname === path ? "active text-white" : "text-dark"
              }`}
              style={{
                borderRadius: "6px",
                backgroundColor:
                  pathname === path ? "#1a2942" : "transparent",
                padding: "10px 15px",
                
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}