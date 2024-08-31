"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { TodoTypes } from "@/types/kanban";
import { MdEvent } from "react-icons/md";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get("/api/todos");
        const formattedEvents = response.data
          .filter((todo: TodoTypes) => todo.dueDate !== null)
          .map((todo: TodoTypes) => ({
            title: todo.title,
            start: todo.dueDate,
            id: todo.uniqueId,
            backgroundColor: "#2D2D2D", // Dark grey background color
            borderColor: "#2D2D2D",     // Dark grey border color
            textColor: "#FFFFFF",       // White text color for contrast
            // Ensure border covers the event
            borderWidth: 2,
          }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="calendar-container bg-gray-900 text-white shadow-2xl rounded-lg p-4 h-screen w-full overflow-auto">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridFourDay"
        timeZone="UTC"
        events={events}
        eventMinHeight={70}
        eventClassNames="shadow-lg rounded-lg"
        eventOverlap={false}
        eventInteractive={true}
        eventContent={renderEventContent}
        views={{
          timeGridFourDay: {
            type: "timeGrid",
            duration: { days: 4 },
            buttonText: "4 Day",
          },
          timeGridWeek: {
            type: "timeGrid",
            duration: { days: 7 },
            buttonText: "Week",
          },
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridFourDay,timeGridWeek,timeGridDay",
        }}
        editable={true}
        selectable={true}
        height="100%"
        dayHeaderClassNames="text-white font-bold uppercase bg-gray-800 text-sm py-2"
        slotLabelClassNames="text-gray-300 text-xs"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        slotDuration="01:00:00" 
        allDaySlot={false}
        dayCellClassNames="px-4 py-2 border-b border-gray-700"
        slotLaneClassNames="bg-gray-900 border-b border-gray-700"
        expandRows={true}
        dayMaxEvents={true}
        dayMaxEventRows={3}
        eventBorderColor="#2D2D2D" // Ensure border color is consistent
      />
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <div className="flex flex-col bg-gray-800 text-white p-3 rounded-lg shadow-lg">
      <MdEvent className="text-xl text-blue-400 mb-1" />
      <b className="text-base">{eventInfo.timeText}</b>
      <i className="text-sm">{eventInfo.event.title}</i>
    </div>
  );
}
