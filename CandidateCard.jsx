import React, { useState } from "react";
import { FaCheckCircle, FaLinkedin, FaExpand } from "react-icons/fa";
import CandidateModal from "./CandidateModal";

function getStatusColor(status) {
  if (status === "selected" || status === "hired") return "#4BB543";
  if (status === "rejected") return "#DA0000";
  if (status === "on_hold") return "#FFD700";
  return "#ececec";
}

export default function CandidateCard({ candidate, onMove }) {
  const [open, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // ✅ toggle state

  return (
    <div
      style={{
        border: `2px solid ${getStatusColor(candidate.status)}`,
        borderRadius: 12,
        background: "#fff",
        marginBottom: 14,
        padding: "16px 16px 24px 16px",
        boxShadow: "0 1px 4px #e0e0e0",
        position: "relative",
      }}
    >
      {/* ✅ Select / Deselect icon */}
      <FaCheckCircle
        style={{
          color: isSelected ? "#33d17a" : "#ccc",
          position: "absolute",
          top: 10,
          right: 10,
          cursor: "pointer",
        }}
        size={20}
        title={isSelected ? "Selected" : "Select Candidate"}
        onClick={() => setIsSelected(!isSelected)}
      />

      {/* Candidate details */}
      <div style={{ fontWeight: 700, fontSize: 16 }}>{candidate.name}</div>
      <div style={{ fontSize: 14, color: "#883FAB" }}>{candidate.email}</div>
      {candidate.contact && (
        <div style={{ fontSize: 13, color: "#777" }}>
          Contact: {candidate.contact}
        </div>
      )}

      {/* LinkedIn if exists */}
      {candidate.linkedin && (
        <div style={{ color: "#0077b5", margin: "6px 0 0 0" }}>
          <FaLinkedin style={{ marginRight: 4 }} />
          <a
            href={candidate.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0077b5" }}
          >
            LinkedIn
          </a>
        </div>
      )}

      {/* Expand for more details */}
      <FaExpand
        style={{
          position: "absolute",
          bottom: 10,
          right: 36,
          color: "#883FAB",
          cursor: "pointer",
        }}
        size={18}
        onClick={() => setOpen(true)}
      />

      <CandidateModal
        candidate={candidate}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
