// src/App.jsx
import React, { useState } from "react";
import { CssBaseline } from "@mui/material";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

// Pages
import DashboardHome from "./pages/DashboardHome"; // analytics dashboard
import Dashboard from "./pages/Dashboard"; // recruitment pipeline
import Schedule from "./pages/Schedule";
import Payroll from "./pages/Payroll";
import Employee from "./pages/Employee";
import ResumeParser from "./pages/ResumeParser";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const navigate = (page) => setActivePage(page);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome />;
      case "recruitment":
        return <Dashboard />;
      case "schedule":
        return <Schedule />;
      case "payroll":
        return <Payroll />;
      case "employee":
        return <Employee />;
      case "resumeparser":
        return <ResumeParser />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <CssBaseline />
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "#f7f8fa"
        }}
      >
        {/* Sidebar */}
        <Sidebar selectedBoard={activePage} setSelectedBoard={setActivePage} navigate={navigate} />

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <TopBar />
          <div style={{ padding: "16px 24px" }}>{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
