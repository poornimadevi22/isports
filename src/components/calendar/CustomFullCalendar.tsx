import React, { useState } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { createEventId } from './event-utils';

interface Event {
  title: string;
  date: string;
}

interface CustomFullCalendarProps {
  events: Event[]
}

const CustomFullCalendar: React.FC<CustomFullCalendarProps> = ({ events }) => {
  const [weekendsVisible, setWeekendsVisible] = useState(true); 
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [selectInfo, setSelectInfo] = useState<any>(null);

  const handleDateSelect = (selectInfo: any) => {
    setSelectInfo(selectInfo);
    setEventTitle('');
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEventTitle('');
  };

  const handleEventTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventTitle(event.target.value);
  };

  const handleSaveEvent = () => {
    if (eventTitle) {
      let calendarApi = selectInfo.view.calendar;
      const eventColor = eventTitle.toLowerCase().includes('tournament') ? 'green' : 'orange';
      const isAllDayEvent = selectInfo.allDay;
      calendarApi.addEvent({
        id: createEventId(),
        title: eventTitle,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: isAllDayEvent,
        backgroundColor: eventColor,
        borderColor: eventColor,
        textColor: 'white',
      });
      setOpen(false);
      setEventTitle('');
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  };

  return (
    <div className="demo-app-main">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ]}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'today dayGridMonth,timeGridDay,listMonth',
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
        }}
        initialView="dayGridMonth"
        dayHeaderFormat={{
          weekday: 'short',
        }}
        editable={true} // Drag-and-drop functionality
        selectable={true} // Allow date selection
        selectMirror={true}
        dayMaxEvents={false}
        weekends={weekendsVisible} // Control weekends visibility
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        views={{
          dayGridMonth: {
            dayMaxEvents: 3,
          },
          timeGridWeek: {
            dayMaxEvents: 5,
          },
          timeGridDay: {
            dayMaxEvents: 5,
          },
        }}
        listDaySideFormat={false} 
      />
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={eventTitle}
            onChange={handleEventTitleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomFullCalendar;
