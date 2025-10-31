import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Modal, Box, TextField, Button } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS, // ✅ fixed capitalization
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


const style = {
  position: "fixed",
  top: "18vh",
  left: "50%",
  transform: "translate(-50%, 0)",
  width: 420,
  bgcolor: "#fff",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
  outline: "none",
};

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ title: "", start: "", end: "" });

  useEffect(() => {
    // sample default event
    setEvents([
      {
        id: 1,
        title: "Interview - Rohit Pawar",
        start: new Date(),
        end: new Date(Date.now() + 60 * 60 * 1000),
      },
    ]);
  }, []);

  function handleAddEvent() {
    setForm({ title: "", start: "", end: "" });
    setOpenModal(true);
  }

  function saveEvent() {
    if (!form.title || !form.start || !form.end) {
      alert("Please fill title, start, and end fields.");
      return;
    }
    const newEvent = {
      id: Date.now(),
      title: form.title,
      start: new Date(form.start),
      end: new Date(form.end),
    };
    setEvents((prev) => [...prev, newEvent]);
    setOpenModal(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      {/* Header */}
      <div style={{ boxShadow: "0 1px 6px #eee", background: "#fff" }}>
        <div
          style={{
            padding: "12px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#883FAB", margin: 0 }}>Schedule</h2>
          <Button
            variant="contained"
            onClick={handleAddEvent}
            style={{ background: "#883FAB", color: "#fff" }}
          >
            + Add Event
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          }}
        >
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "70vh" }}
          />
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={style}>
          <h3 style={{ color: "#883FAB" }}>Add Event</h3>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Start (YYYY-MM-DDTHH:mm)"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="End (YYYY-MM-DDTHH:mm)"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            sx={{ mb: 2 }}
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={saveEvent}
              style={{ background: "#883FAB", color: "#fff" }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
