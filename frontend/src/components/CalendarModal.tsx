import React, { useRef, useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createPortal } from "react-dom";
import { useAppointments } from "../hooks/useAppointments";
import "./CalendarModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CalendarModal({ isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const { appointments, loading } = useAppointments();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Update calendar view based on screen size
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        if (mobile && calendarApi.view.type === 'dayGridMonth') {
          calendarApi.changeView('timeGridDay');
        } else if (!mobile && calendarApi.view.type === 'timeGridDay') {
          calendarApi.changeView('dayGridMonth');
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Convert appointments to FullCalendar events format
  const calendarEvents = useMemo(() => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.patient.name} - ${appointment.type}`,
      start: `${appointment.date}T${appointment.startTime}`,
      end: `${appointment.date}T${appointment.endTime}`,
      backgroundColor: appointment.status === 'scheduled' ? '#10b981' : 
                      appointment.status === 'cancelled' ? '#ef4444' : '#6b7280',
      borderColor: 'transparent',
      extendedProps: {
        appointment: appointment
      }
    }));
  }, [appointments]);
  
  if (!isOpen) return null;

  const handleEventClick = (clickInfo: any) => {
    const appointment = clickInfo.event.extendedProps.appointment;
    alert(`Appointment Details:\nPatient: ${appointment.patient.name}\nTime: ${appointment.startTime} - ${appointment.endTime}\nStatus: ${appointment.status}\nNotes: ${appointment.notes || 'No notes'}`);
  };
  
  const handleDateClick = (dateClickInfo: any) => {
    const clickedDate = dateClickInfo.dateStr;
    alert(`Create new appointment for ${clickedDate}`);
  };

  const handleDatesSet = (dateInfo: any) => {
    // Handle visible range changes - can be used to load events for this range
    console.log('Visible range changed:', dateInfo);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      aria-modal="true"
      role="dialog"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      {/* Overlay - semi dark behind, plus subtle blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
         ref={modalRef}
         className="relative z-10 mt-2 sm:mt-8 md:mt-12 w-[98%] sm:w-[95%] max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl 
                    rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6
                    bg-gradient-to-br from-blue-50/30 to-white/20
                    border border-white/10 shadow-lg backdrop-blur-md
                    max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Calendar</h3>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-md hover:bg-white/10 text-slate-700"
            aria-label="Close calendar"
          >
            Close
          </button>
        </div>

        <div className="bg-transparent">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-600">Loading appointments...</div>
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={isMobile ? "dayGridMonth" : "dayGridMonth"}
              headerToolbar={{
                left: isMobile ? "prev,next" : "prev,next today",
                center: "title",
                right: isMobile ? "dayGridMonth,timeGridDay" : "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              initialDate={new Date()}
              events={calendarEvents}
              height={isMobile ? "70vh" : "auto"}
              aspectRatio={isMobile ? 1.0 : 1.35}
              contentHeight={isMobile ? "auto" : undefined}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              dayMaxEvents={isMobile ? 2 : 3}
              moreLinkClick="popover"
              eventDisplay="block"
              displayEventTime={true}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              dayHeaderFormat={isMobile ? { weekday: 'short' } : { weekday: 'short', day: 'numeric' }}
              titleFormat={isMobile ? { month: 'short', year: 'numeric' } : { month: 'long', year: 'numeric' }}
              dayCellClassNames={(date) => {
                // Highlight current date
                const today = new Date();
                const isToday = date.date.toDateString() === today.toDateString();
                return isToday ? 'fc-day-today-custom' : '';
              }}
              stickyHeaderDates={true}
              fixedWeekCount={false}
            />
          )}
        </div>
      </div>


    </div>,
    document.body
  );
}