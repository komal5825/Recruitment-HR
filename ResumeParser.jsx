import React, { useState } from "react";
import { Box, Button, Typography, TextField, CircularProgress } from "@mui/material";


export default function ResumeParser() {
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);

  // Placeholder for backend integration later
  const handleSubmit = () => {
    if (!jdText && !jdFile) {
      alert("Please paste or upload a Job Description first.");
      return;
    }
    if (resumes.length === 0) {
      alert("Please upload at least one resume or folder.");
      return;
    }

    // Demo results (to simulate backend)
    const demoResults = [
      { name: "Komal Shelar", email: "komal@ezest.com", match: 92, skills: "Python, FastAPI, React" },
      { name: "Rohit Pawar", email: "rohit@ezest.com", match: 86, skills: "SQL, Flask, Pandas" },
      { name: "Sakshi Patil", email: "sakshi@ezest.com", match: 74, skills: "Node.js, MongoDB, Express" },
      { name: "Nilesh Shinde", email: "nilesh@ezest.com", match: 65, skills: "Power BI, Excel" },
    ];

    setResults(demoResults);
  };

  const handleExport = (format) => {
    alert(`Exporting as ${format} — backend integration pending.`);
  };

  return (
    <div style={{ padding: "24px 36px", minHeight: "100vh", background: "#f7f8fa" }}>
      <h2 style={{ color: "#883FAB", marginBottom: 20 }}>Resume Parser & JD Matcher</h2>

      {/* JD Upload Section */}
      <Box
        sx={{
          background: "#fff",
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h4 style={{ color: "#883FAB" }}>Upload or Paste Job Description</h4>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10 }}>
          <Button
            variant="outlined"
            component="label"
            sx={{ borderColor: "#883FAB", color: "#883FAB" }}
          >
            Upload JD File
            <input
              type="file"
              hidden
              onChange={(e) => setJdFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.txt"
            />
          </Button>
          {jdFile && (
            <span style={{ fontSize: 14, color: "#555" }}>
              Selected: {jdFile.name}
            </span>
          )}
        </div>

        <TextField
          multiline
          rows={5}
          fullWidth
          placeholder="Paste Job Description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Box>

      {/* Resume Upload Section */}
      <Box
        sx={{
          background: "#fff",
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h4 style={{ color: "#883FAB" }}>Upload Resume Files</h4>
        <Button
          variant="outlined"
          component="label"
          sx={{ borderColor: "#883FAB", color: "#883FAB", mt: 1 }}
        >
          Upload Resume(s) or Folder
          <input
            type="file"
            hidden
            multiple
            webkitdirectory="true"
            directory=""
            onChange={(e) => setResumes(Array.from(e.target.files))}
            accept=".pdf,.doc,.docx"
          />
        </Button>

        {/* Folder and count info */}
        {resumes.length > 0 && (
          <p style={{ marginTop: 8, color: "#555" }}>
            {resumes.length} resume(s) selected
            {resumes[0].webkitRelativePath
              ? ` from folder "${resumes[0].webkitRelativePath.split("/")[0]}"`
              : ""}
          </p>
        )}

        {/* Match Button */}
        <Button
          variant="contained"
          sx={{
            background: "#883FAB",
            mt: 3,
            fontSize: 16,
            padding: "10px 28px",
            textTransform: "none",
            boxShadow: "0 3px 8px rgba(136,63,171,0.3)",
          }}
          onClick={handleSubmit}
        >
          🔍 Match Resumes with JD
        </Button>
      </Box>

      {/* Results Table */}
      {results.length > 0 && (
  <Box sx={{ mt: 5, background: "#fff", padding: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
    <Typography variant="h6" sx={{ mb: 2, color: "#883FAB" }}>
      Parsed Candidates ({results.length})
    </Typography>
    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f4ecff" }}>
            {Object.keys(results[0]).map((key) => (
              <th key={key} style={{ textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #ddd" }}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              {Object.values(row).map((val, j) => (
                <td key={j} style={{ padding: "8px 8px", color: "#333" }}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
      <Button variant="outlined" onClick={() => handleExport("excel")}>Export Excel</Button>
      <Button variant="outlined" onClick={() => handleExport("csv")}>Export CSV</Button>
      <Button variant="outlined" onClick={() => handleExport("pdf")}>Export PDF</Button>
    </div>
  </Box>
)}

    </div>
  );
}
