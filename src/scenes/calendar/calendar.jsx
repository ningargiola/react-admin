import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core"; 
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [open, setOpen] = useState(false); // For opening the dialog
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: false, // Add allDay property
  });

  // Retrieve events from localStorage when the component mounts
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setCurrentEvents(savedEvents);
  }, []);

  // Save events to localStorage whenever currentEvents changes
  useEffect(() => {
    if (currentEvents.length > 0) {
      localStorage.setItem("calendarEvents", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  // Handle date selection to add an event
  const handleDateClick = (selected) => {
    setOpen(true);
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      allDay: false, // Reset allDay property
    });
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && (newEvent.allDay || newEvent.end)) {
      const calendarEvent = {
        id: `${newEvent.start}-${newEvent.title}`,
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.allDay ? newEvent.start : newEvent.end, // If allDay is true, use start date as end date as well
        allDay: newEvent.allDay, // Pass allDay property to event
      };

      setCurrentEvents((prevEvents) => [...prevEvents, calendarEvent]);

      // Reset and close the dialog
      handleClose();
    } else {
      alert("Please fill out all fields!");
    }
  };

  // Handle event click to remove an event
  const handleEventClick = (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      const updatedEvents = currentEvents.filter(
        (event) => event.id !== selected.event.id
      );
      setCurrentEvents(updatedEvents);
    }
  };

  // Handle input change for new event
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handle checkbox change for "All Day" option
  const handleCheckboxChange = (e) => {
    setNewEvent({ ...newEvent, allDay: e.target.checked });
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="8px"
        >
          <Typography variant="h5" sx={{ color: colors.grey[100] }}>Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "4px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                  secondary={
                    <Typography sx={{ color: colors.grey[200] }}>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        ...(event.allDay
                          ? {}
                          : { hour: "numeric", minute: "numeric" }) // Show time if not all day
                      })}
                      {!event.allDay && event.end && (
                        <>
                          {" - "}
                          {formatDate(event.end, {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </>
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents} // Use events from state
            eventColor={colors.greenAccent[500]}
          />
        </Box>
      </Box>

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newEvent.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="start"
            label="Start Date and Time"
            type={newEvent.allDay ? "date" : "datetime-local"} // Use "date" if all day is selected
            fullWidth
            variant="outlined"
            value={newEvent.start}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {!newEvent.allDay && (
            <TextField
              margin="dense"
              name="end"
              label="End Date and Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={newEvent.end}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={newEvent.allDay}
                onChange={handleCheckboxChange}
              />
            }
            label="All Day Event"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
