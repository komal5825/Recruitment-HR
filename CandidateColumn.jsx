import React from "react";
import CandidateCard from "./CandidateCard";
import { useDroppable } from "@dnd-kit/core";

export default function CandidateColumn({ columnId, candidates }) {
  const { setNodeRef } = useDroppable({ id: columnId });

  if (!candidates || candidates.length === 0) {
    return (
      <div
        ref={setNodeRef}
        style={{ color: "#aaa", textAlign: "center", marginTop: 16 }}
      >
        No candidates yet.
      </div>
    );
  }

  return (
    <div ref={setNodeRef}>
      {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  );
}
