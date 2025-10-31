import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import KanbanBoard from "../components/KanbanBoard";

const BOARDS = [
  { key: "screening", label: "Screening" },
  { key: "l1", label: "L1 Evaluation" },
  { key: "l2", label: "L2 Evaluation" },
  { key: "hr", label: "HR Round" },
  { key: "onboarding", label: "Onboarding" },
];

export default function Dashboard() {
  const [activeBoard, setActiveBoard] = useState("screening");
  const [candidatesPerBoard, setCandidatesPerBoard] = useState({
    screening: [],
    l1: [],
    l2: [],
    hr: [],
    onboarding: [],
  });

  const API_BASE = "http://127.0.0.1:8000/candidates";

  async function fetchCandidates() {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      const grouped = {
        screening: data.filter((c) => c.stage === "Screening"),
        l1: data.filter((c) => c.stage === "L1 Evaluation"),
        l2: data.filter((c) => c.stage === "L2 Evaluation"),
        hr: data.filter((c) => c.stage === "HR Round"),
        onboarding: data.filter((c) => c.stage === "Onboarding"),
      };
      setCandidatesPerBoard(grouped);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div style={{ flex: 1, background: "#f7f8fa" }}>
      {/* --- Tabs for Boards --- */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          margin: "30px 24px 0 24px",
        }}
      >
        {BOARDS.map((b) => (
          <button
            key={b.key}
            onClick={() => setActiveBoard(b.key)}
            style={{
              background: activeBoard === b.key ? "#883FAB" : "#fff",
              color: activeBoard === b.key ? "#fff" : "#883FAB",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              borderRadius: "8px 8px 0 0",
              padding: "16px 32px",
              outline: "none",
              cursor: "pointer",
              boxShadow: activeBoard === b.key ? "0 1px 6px #eee" : "none",
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* --- Import Button --- */}
      <div style={{ margin: "16px 0 6px 24px" }}>
        <button
          onClick={() => document.getElementById("fileInput").click()}
          style={{
            background: "#ece4ff",
            color: "#883FAB",
            fontWeight: "bold",
            borderRadius: 11,
            padding: "13px 22px",
            border: "none",
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 2px 8px #ececec",
          }}
        >
          Import Candidates
        </button>
        <input
          type="file"
          id="fileInput"
          accept=".csv, .xlsx, .xls"
          style={{ display: "none" }}
        />
      </div>

      {/* --- Kanban Board --- */}
      <KanbanBoard
        activeBoard={activeBoard}
        candidates={candidatesPerBoard[activeBoard]}
      />
    </div>
  );
}
