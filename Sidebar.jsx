import React, { useState } from "react";
import { FaRegBuilding, FaRegClock, FaCog } from "react-icons/fa";
import CalendarWidget from "./CalendarWidget";

const boardsList = [
  { key: "screening", label: "Screening" },
  { key: "l1", label: "L1 Evaluation" },
  { key: "l2", label: "L2 Evaluation" },
  { key: "hr", label: "HR Round" },
  { key: "onboarding", label: "Onboarding" }
];

const departments = [
  { label: "Business and Marketing", color: "#1976D2" },
  { label: "Design", color: "#388E3C" },
  { label: "Project Manager", color: "#FFA000" },
  { label: "Human Resource", color: "#E64A19" },
  { label: "Development", color: "#7B1FA2" }
];

export default function Sidebar({ selectedBoard, setSelectedBoard, navigate }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const hrName = "Komal Shelar";
  const hrEmail = "Komal.Shelar@e-zest.com";

  return (
    <aside
      style={{
        background: "#fff",
        width: 270,
        minWidth: 270,
        borderRight: "1px solid #eee",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          <img src="/ezestlogo.png" alt="e-Zest" style={{ height: 40, width: "auto", marginRight: 10 }} />
          <div>
            <div style={{ color: "#883FAB", fontWeight: 800, fontSize: 30,letterSpacing: "0.5px" }}>e-Zest</div>
           <div style={{ fontSize: 14,color: "#888",fontStyle: "italic",}}>Digital experience engineering</div>
          </div>
        </div>

        {/* Nav List */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 17 }}>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              cursor: "pointer",
              background: selectedBoard === "dashboard" ? "#f2eaff" : "transparent",
              color: selectedBoard === "dashboard" ? "#883FAB" : "#333",
              fontWeight: selectedBoard === "dashboard" ? "bold" : "normal",
              borderRadius: 7,
              padding: "10px 12px"
            }}
            onClick={() => navigate("dashboard")}
          >
            <FaRegBuilding style={{ marginRight: 12 }} /> Dashboard
          </li>

          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              cursor: "pointer",
              background: selectedBoard === "recruitment" ? "#f2eaff" : "transparent",
              color: selectedBoard === "recruitment" ? "#883FAB" : "#333",
              fontWeight: selectedBoard === "recruitment" ? "bold" : "normal",
              borderRadius: 7,
              padding: "10px 12px"
            }}
            onClick={() => navigate("recruitment")}
          >
            <FaRegBuilding style={{ marginRight: 12 }} /> Recruitment
          </li>

          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              cursor: "pointer"
            }}
            onClick={() => navigate("employee")}
          >
            <FaRegBuilding style={{ marginRight: 12 }} /> Employee
          </li>

          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              cursor: "pointer"
            }}
            onClick={() => navigate("resumeparser")}
          >
            <FaRegBuilding style={{ marginRight: 12 }} /> Resume Parser
          </li>

          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              cursor: "pointer"
            }}
            onClick={() => navigate("schedule")}
          >
            <FaRegClock style={{ marginRight: 12 }} /> Schedule
          </li>

          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              cursor: "pointer"
            }}
            onClick={() => navigate("payroll")}
          >
            <FaRegBuilding style={{ marginRight: 12 }} /> Payroll
          </li>
        </ul>

        {/* Departments */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7 }}>DEPARTMENT</div>
          {departments.map((dep) => (
            <div key={dep.label} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span
                style={{
                  background: dep.color,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  marginRight: 8
                }}
              />
              <span style={{ fontSize: 13 }}>{dep.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer (HR Info + Settings) */}
      <div style={{ marginTop: 30 }}>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />
        <div style={{ fontWeight: 700, color: "#883FAB" }}>{hrName}</div>
        <div style={{ color: "#555", fontSize: 13, marginBottom: 6 }}>{hrEmail}</div>
        <button
          style={{
            background: "#883FAB",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "5px 14px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 8
          }}
        >
          Logout
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#555",
            fontSize: 15,
            cursor: "pointer",
            marginTop: 10
          }}
        >
          <FaCog style={{ marginRight: 8 }} /> Settings
        </div>
      </div>
    </aside>
  );
}
