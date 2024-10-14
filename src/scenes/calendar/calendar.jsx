import React, { useState, useEffect } from "react";
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

// Firestore imports
import { db } from "../../firebase"; // Ensure you have Firebase and Firestore initialized
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore functions

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

  // Firestore collection reference
  const eventsCollectionRef = collection(db, "calendar"); // Reference to Firestore collection

  // Fetch events from Firestore when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      const eventDocs = await getDocs(eventsCollectionRef);
      const events = eventDocs.docs.map((doc) => ({
        id: doc.id, // Use Firestore doc ID as event ID
        ...doc.data(),
      }));
      setCurrentEvents(events);
    };
    fetchEvents();
  }, []);

  // Save events to Firestore when an event is added
  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.start && (newEvent.allDay || newEvent.end)) {
      const calendarEvent = {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.allDay ? newEvent.start : newEvent.end, // If allDay is true, use start date as end date as well
        allDay: newEvent.allDay, // Pass allDay property to event
      };

      // Add the event to Firestore
      const docRef = await addDoc(eventsCollectionRef, calendarEvent);
      setCurrentEvents((prevEvents) => [
        ...prevEvents,
        { id: docRef.id, ...calendarEvent }, // Use Firestore doc ID as event ID
      ]);

      // Reset and close the dialog
      handleClose();
    } else {
      alert("Please fill out all fields!");
    }
  };

  // Handle event click to remove an event
  const handleEventClick = async (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      const eventId = selected.event.id;

      // Delete the event from Firestore
      await deleteDoc(doc(db, "calendar", eventId));

      // Remove the event from the state
      setCurrentEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    }
  };

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

