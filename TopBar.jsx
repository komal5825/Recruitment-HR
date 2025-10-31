import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function TopBar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "16px 40px 8px 40px",
      alignItems: "center",
      background: "#fff",
      boxShadow: "0 1px 6px #eee"
    }}>
      <input
        type="search"
        placeholder="Search keyword…"
        style={{
          border: "1px solid #ececec",
          borderRadius: 8,
          padding: "7px 14px", width: 270, fontSize: 16
        }}
      />
      <div style={{
        fontWeight: 700, fontSize: 22, color: "#883FAB", display: "flex", alignItems: "center"
      }}>
        <FaUserCircle style={{ marginRight: 16, fontSize: 28 }} />
        HR Recruitment Pipeline
      </div>
    </div>
  );
}
