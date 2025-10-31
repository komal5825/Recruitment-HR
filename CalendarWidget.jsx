import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';  // import calendar styles

export default function CalendarWidget() {
  const [value, setValue] = useState(new Date());

  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 0 6px #ccc' }}>
      <Calendar
        onChange={setValue}
        value={value}
        calendarType="US"  // Sunday first day of week
      />
    </div>
  );
}
