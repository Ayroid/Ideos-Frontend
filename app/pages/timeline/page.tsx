"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridFourDay"
        views={{
          timeGridFourDay: {
            type: "timeGrid",
            duration: { days: 4 },
            buttonText: '4 day' // Text for the custom view button (optional)
          },
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridFourDay,timeGridWeek,timeGridDay",
        }}
        editable={true}
        selectable={true}
        initialEvents={[
          { title: "Nice Event", start: new Date(), resourceId: "a" },
        ]}
      />
    </div>
  );
}
