import React, { useState } from "react";
import CandidateColumn from "./CandidateColumn";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

const COLORS = {
  yellow: "#ffe6b3",
  blue: "#dcf1ff",
  purple: "#efb7ff",
  lightYellow: "#fdfdb0",
  green: "#bcffd4",
  mint: "#bef3ce",
  paleGreen: "#e1ffd0",
  lavender: "#e6d1fa",
};

const BOARD_COLUMNS = {
  screening: [
    { label: "List of Candidates", color: COLORS.yellow },
    { label: "Email Sent", color: COLORS.blue },
    { label: "Scheduled", color: COLORS.purple },
    { label: "Interviewed", color: COLORS.lightYellow },
    { label: "Selected", color: COLORS.green },
  ],
  l1: [
    { label: "List of Candidates", color: COLORS.yellow },
    { label: "Email Sent", color: COLORS.blue },
    { label: "Scheduled", color: COLORS.purple },
    { label: "Interviewed", color: COLORS.lightYellow },
    { label: "Selected", color: COLORS.green },
  ],
  l2: [
    { label: "List of Candidates", color: COLORS.yellow },
    { label: "Email Sent", color: COLORS.blue },
    { label: "Scheduled", color: COLORS.purple },
    { label: "Interviewed", color: COLORS.lightYellow },
    { label: "Selected", color: COLORS.green },
  ],
  hr: [
    { label: "List of Candidates", color: COLORS.yellow },
    { label: "Email Sent", color: COLORS.blue },
    { label: "Scheduled", color: COLORS.purple },
    { label: "Interviewed", color: COLORS.lightYellow },
    { label: "Selected", color: COLORS.green },
  ],
  onboarding: [
    { label: "List of Candidates", color: COLORS.yellow },
    { label: "Email Sent", color: COLORS.blue },
    { label: "Docs Verified", color: COLORS.mint },
    { label: "Offer Accepted", color: COLORS.green },
    { label: "Hired", color: COLORS.paleGreen },
  ],
};

export default function KanbanBoard({ activeBoard, candidates = [], onCandidateStageChange }) {
  const [extraColumns, setExtraColumns] = useState({
    screening: [],
    l1: [],
    l2: [],
    hr: [],
    onboarding: [],
  });

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const sensors = useSensors(sensor);

  function handleAddColumn() {
    const name = prompt("Enter new column name:");
    if (!name) return;
    setExtraColumns((prev) => ({
      ...prev,
      [activeBoard]: [...prev[activeBoard], { label: name.trim(), color: COLORS.lavender }],
    }));
  }

  function handleDeleteColumn(index) {
    const baseCols = BOARD_COLUMNS[activeBoard] || [];
    const customCols = extraColumns[activeBoard] || [];
    if (index < baseCols.length) {
      const updatedBase = [...baseCols];
      updatedBase.splice(index, 1);
      BOARD_COLUMNS[activeBoard] = updatedBase;
    } else {
      setExtraColumns((prev) => ({
        ...prev,
        [activeBoard]: customCols.filter((_, i) => i !== index - baseCols.length),
      }));
    }
  }

  const baseCols = BOARD_COLUMNS[activeBoard] || [];
  const customCols = extraColumns[activeBoard] || [];
  const columns = [...baseCols, ...customCols];

  function getCandidatesForColumn(col) {
    if (col.label === "List of Candidates") {
      return candidates; // show all candidates in first column
    }
    // If you want candidate distribution per status, map candidate.status or candidate.stage to col.label.
    return candidates.filter((c) => c.stage === col.label);
  }

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    // active.id expected to be like 'candidate-123'
    if (!active?.id || !over?.id) return;

    if (active.id.startsWith("candidate-") && over.id.startsWith("col-")) {
      const candidateId = parseInt(active.id.replace("candidate-", ""), 10);
      const colIndex = parseInt(over.id.replace("col-", ""), 10);
      const targetCol = columns[colIndex];
      if (targetCol) {
        const targetLabel = targetCol.label;
        // call parent's handler
        if (typeof onCandidateStageChange === "function") {
          onCandidateStageChange(candidateId, targetLabel);
        }
      }
    }
  };

  const colWidth = 330;
  const gap = 18;
  const maxColsNoScroll = 6;
  const needScroll = columns.length > maxColsNoScroll;
  const kanbanWidth = needScroll ? columns.length * (colWidth + gap) + 160 : maxColsNoScroll * (colWidth + gap) + 160;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          gap: gap,
          alignItems: "flex-start",
          padding: "16px 0 16px 16px",
          width: kanbanWidth,
          maxWidth: "calc(100vw - 220px)",
          minHeight: "calc(100vh - 110px)",
          overflowX: needScroll ? "auto" : "hidden",
          overflowY: "hidden",
          background: "#f8f8fa",
        }}
      >
        {columns.map((col, idx) => (
          <div
            key={col.label + idx}
            id={`col-${idx}`}
            style={{
              minWidth: colWidth,
              maxWidth: colWidth,
              height: "100%",
              borderRadius: 15,
              border: "1px solid #ececec",
              boxShadow: "0 2px 10px 0 #ededfa",
              display: "flex",
              flexDirection: "column",
              padding: "0 8px 10px 8px",
              background: "#fff",
              position: "relative",
            }}
          >
            <div
              style={{
                background: col.color,
                borderRadius: "10px",
                padding: "10px 12px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 16,
                color: "#333",
                margin: "12px 0 7px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ flex: 1 }}>{col.label}</span>
              <span
                style={{
                  background: "#fff",
                  color: "#883FAB",
                  fontWeight: 800,
                  borderRadius: 7,
                  marginLeft: 9,
                  padding: "2px 8px",
                  minWidth: 22,
                  boxShadow: "0 1px 2px #f1eafd",
                }}
              >
                {getCandidatesForColumn(col).length}
              </span>
              {idx >= baseCols.length && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure to delete the column "${col.label}"?`)) {
                      handleDeleteColumn(idx);
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    marginLeft: 8,
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Delete column"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <circle cx="8" cy="8" r="8" fill="#ffe1f5" />
                    <path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke="#e458a6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingRight: 6 }}>
              <CandidateColumn candidates={getCandidatesForColumn(col)} />
            </div>
          </div>
        ))}

        <button
          onClick={handleAddColumn}
          style={{
            background: "#ece4ff",
            color: "#883FAB",
            fontWeight: "bold",
            borderRadius: 13,
            padding: "11px 12px",
            border: "none",
            minWidth: 115,
            height: 48,
            marginTop: 25,
            cursor: "pointer",
            boxShadow: "0 1px 4px #ececec",
          }}
        >
          + Add Column
        </button>
      </div>
    </DndContext>
  );
}
