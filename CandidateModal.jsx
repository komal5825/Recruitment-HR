import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "fixed",
  top: "15vh",
  left: "50%",
  transform: "translate(-50%, 0)",
  width: 330,
  bgcolor: "#fff",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
  outline: "none"
};

export default function CandidateModal({ open, onClose, candidate }) {
  if (!candidate) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" color="#883FAB">{candidate.name}</Typography>
        <Typography>Email: {candidate.email}</Typography>
        <Typography>Contact: {candidate.contact}</Typography>
        <Typography>Status: {candidate.status}</Typography>
        <Typography>Stage: {candidate.stage}</Typography>
        <Typography>Date of Birth: {candidate.birthdate || "-"}</Typography>
        <Typography>Experience: {candidate.year_of_experience || "-"} years</Typography>
        <Typography>Skills: {candidate.skills || "-"}</Typography>
        <Typography>
          Resume: {candidate.resume_link ? (
            <Button variant="outlined" href={candidate.resume_link} target="_blank">View</Button>
          ) : "-"}
        </Typography>
        <Button sx={{ mt: 1 }} variant="contained" color="secondary" onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
}
