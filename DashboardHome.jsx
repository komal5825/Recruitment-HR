// src/pages/DashboardHome.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

const pieData = [
  { name: "Screening", value: 25 },
  { name: "L1", value: 15 },
  { name: "L2", value: 10 },
  { name: "HR Round", value: 8 },
  { name: "Onboarding", value: 5 },
];

const barData = [
  { name: "Dev", employees: 20 },
  { name: "Design", employees: 10 },
  { name: "HR", employees: 8 },
  { name: "Sales", employees: 6 },
  { name: "Marketing", employees: 4 },
];

const lineData = [
  { month: "Jan", hires: 2 },
  { month: "Feb", hires: 4 },
  { month: "Mar", hires: 3 },
  { month: "Apr", hires: 6 },
  { month: "May", hires: 5 },
  { month: "Jun", hires: 8 },
  { month: "Jul", hires: 7 },
  { month: "Aug", hires: 5 },
  { month: "Sep", hires: 6 },
  { month: "Oct", hires: 4 },
  { month: "Nov", hires: 3 },
  { month: "Dec", hires: 2 },
];

const COLORS = ["#FF8C8C", "#A7E9AF", "#ADD8E6", "#FFD580", "#E1BEE7"];

export default function DashboardHome() {
  return (
    <div style={{ padding: "20px 30px", background: "#f9f9fb", minHeight: "100vh" }}>
      <h2 style={{ color: "#883FAB", fontWeight: 700, marginBottom: 20 }}>HR Overview</h2>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total Employees", value: 60 },
          { label: "Active Candidates", value: 45 },
          { label: "Hired This Month", value: 8 },
          { label: "Upcoming Interviews", value: 6 },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              flex: "1 1 220px",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 16, color: "#555", marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#883FAB" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 20,
        }}
      >
        {/* Pie Chart */}
        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ color: "#883FAB", marginBottom: 8 }}>Recruitment Stages</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ color: "#883FAB", marginBottom: 8 }}>Department-wise Employees</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#883FAB" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ color: "#883FAB", marginBottom: 8 }}>Monthly Hired Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hires" stroke="#883FAB" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
