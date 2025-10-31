import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import KanbanBoard from "../components/KanbanBoard";

const BOARDS = [
  { key: "screening", label: "Screening" },
  { key: "l1", label: "L1 Evaluation" },
  { key: "l2", label: "L2 Evaluation" },
  { key: "hr", label: "HR Round" },
  { key: "onboarding", label: "Onboarding" },
];

export default function Recruitment() {
  const [activeBoard, setActiveBoard] = useState("screening");
  const [candidatesPerBoard, setCandidatesPerBoard] = useState({
    screening: [],
    l1: [],
    l2: [],
    hr: [],
    onboarding: [],
  });

  const API_BASE = "http://127.0.0.1:8000/candidates";
  const navigate = useNavigate();
  const location = useLocation();

  // if you want to support route like /recruitment?board=l1
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const b = search.get("board");
    if (b && BOARDS.some((x) => x.key === b)) setActiveBoard(b);
  }, [location.search]);

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
    // poll or websockets can be added later
  }, []);

  // Optimistically update candidate stage locally, and call backend
  async function handleCandidateStageChange(candidateId, targetStageLabel) {
    // update local state
    setCandidatesPerBoard((prev) => {
      // remove candidate from any list and add to target list
      const copy = {
        screening: [...prev.screening],
        l1: [...prev.l1],
        l2: [...prev.l2],
        hr: [...prev.hr],
        onboarding: [...prev.onboarding],
      };
      let moved = null;
      for (const key of Object.keys(copy)) {
        const idx = copy[key].findIndex((c) => c.id === candidateId);
        if (idx > -1) {
          moved = copy[key][idx];
          copy[key].splice(idx, 1);
          break;
        }
      }
      if (moved) {
        // update stage & push into right bucket
        moved = { ...moved, stage: targetStageLabel };
        // map targetStageLabel back to board key if necessary
        const mapping = {
          Screening: "screening",
          "L1 Evaluation": "l1",
          "L2 Evaluation": "l2",
          "HR Round": "hr",
          Onboarding: "onboarding",
          // also allow targetStageLabel equal to column labels like "List of Candidates" - default to screening
        };
        const destKey = mapping[targetStageLabel] || "screening";
        copy[destKey] = [moved, ...copy[destKey]];
      }
      return copy;
    });

    // call backend (best-effort). You can change payload/path to match your API
    try {
      await fetch(`${API_BASE}/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: targetStageLabel }),
      });
    } catch (err) {
      console.warn("Failed to persist candidate stage update:", err);
      // on failure, re-fetch to get authoritative state
      fetchCandidates();
    }
  }

  // import file handler (kept same)
  async function handleImportClick() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv, .xlsx, .xls";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const data = new FormData();
      data.append("file", file);
      try {
        const resp = await fetch(`${API_BASE}/import`, {
          method: "POST",
          body: data,
        });
        const result = await resp.json();
        if (!resp.ok) {
          alert("Import failed: " + result.detail);
          return;
        }
        alert(result.message);
        fetchCandidates();
      } catch (error) {
        console.error("Error importing candidates:", error);
        alert("Something went wrong while importing candidates.");
      }
    };
    fileInput.click();
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
      <Sidebar selectedBoard={activeBoard} setSelectedBoard={setActiveBoard} />

      <div style={{ flex: 1 }}>
        <TopBar />

        {/* Board Tabs */}
        <div style={{ display: "flex", gap: "12px", margin: "30px 24px 0 24px" }}>
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

        {/* Import Button */}
        <div style={{ margin: "16px 0 6px 24px" }}>
          <button
            onClick={handleImportClick}
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
        </div>

        <KanbanBoard
          activeBoard={activeBoard}
          candidates={candidatesPerBoard[activeBoard]}
          onCandidateStageChange={handleCandidateStageChange}
        />
      </div>
    </div>
  );
}
