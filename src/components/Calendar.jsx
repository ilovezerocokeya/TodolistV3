import React from "react";
import "./Calendar.css";

const Calendar = ({ currentDate, onDateChange }) => {
  const handleDateChange = (e) => {
    onDateChange(e.target.value);
  };

  return (
    <div className="Calendar">
      <input
        type="date"
        value={currentDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default Calendar;