import React from "react";

export default function Employee() {
  return (
    <div
      style={{
        padding: "40px",
        minHeight: "calc(100vh - 80px)",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 0 8px #ddd",
        margin: "20px",
      }}
    >
      <h2 style={{ color: "#883FAB" }}>Employee Management</h2>
      <p>This section will display all employees with add/edit/delete options.</p>
    </div>
  );
}
