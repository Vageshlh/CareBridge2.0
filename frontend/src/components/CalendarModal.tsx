import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './CalendarModal.css';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="calendar-modal-overlay" onClick={handleOverlayClick}>
      <div className="calendar-modal-content">
        <div className="calendar-modal-header">
          <h2>Doctor's Calendar</h2>
          <button className="calendar-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="calendar-modal-body">
          <p className="calendar-instructions">
            Today is highlighted. Navigate months using arrows. Click outside or the 'X' to close.
          </p>
          
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              initialDate={new Date()}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: ''
              }}
              showNonCurrentDates={false}
              selectable={true}
              height="auto"
              dayMaxEvents={true}
              weekends={true}
              events={[
                {
                  title: 'Patient Consultation',
                  date: new Date().toISOString().split('T')[0],
                  color: '#4f46e5'
                },
                {
                  title: 'Surgery',
                  date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                  color: '#dc2626'
                },
                {
                  title: 'Follow-up',
                  date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                  color: '#059669'
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;