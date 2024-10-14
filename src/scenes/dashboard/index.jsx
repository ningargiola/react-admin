import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Typography, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../theme";
import { formatDate } from "@fullcalendar/core";
import Header from "../../components/Header";
import ProgressCircle from "../../components/ProgressCircle";
import TodoList from "../../components/ToDoList";
import TeamGrid from "../../components/TeamGrid";
import JokeOfTheDay from "../../components/JokeOfTheDay";

// Firestore imports
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure Firestore is correctly initialized

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true); // Loading state for events
  const [loadingTodos, setLoadingTodos] = useState(true);   // Loading state for todos

  // Firestore collection references
  const eventsCollectionRef = collection(db, "calendar");
  const todosCollectionRef = collection(db, "todo");

  // Fetch events and todos from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const eventDocs = await getDocs(eventsCollectionRef);
      const events = eventDocs.docs.map((doc) => ({
        id: doc.id, // Use Firestore doc ID as event ID
        ...doc.data(),
      }));
      setCurrentEvents(events);
      setLoadingEvents(false); // Events fetched, stop showing skeleton
    };

    const fetchTodos = async () => {
      const todoDocs = await getDocs(todosCollectionRef);
      const todoItems = todoDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todoItems);
      setLoadingTodos(false); // Todos fetched, stop showing skeleton
    };

    fetchEvents();
    fetchTodos();
  }, []);

  // Add new event to Firestore
  const handleDateClick = async (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect(); // Clear the selection after the prompt

    if (title) {
      const newEvent = {
        title,
        start: selected.startStr,
        end: selected.endStr || selected.startStr,
        allDay: selected.allDay,
      };

      // Add the event to Firestore
      const docRef = await addDoc(eventsCollectionRef, newEvent);
      setCurrentEvents((prevEvents) => [
        ...prevEvents,
        { id: docRef.id, ...newEvent }, // Use Firestore doc ID as event ID
      ]);
    }
  };

  // Handle event click to remove an event from Firestore
  const handleEventClick = async (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      const eventId = selected.event.id;

      // Delete the event from Firestore
      await deleteDoc(doc(db, "calendarEvents", eventId));

      // Remove the event from the state
      setCurrentEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="SURF EL GULF" subtitle="Fuck Surfline" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >

        {/* ROW 2: Deadlines */}
        <Box
          gridColumn={{ xs: "span 12", lg: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          p="10px"
          sx={{
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: colors.greenAccent[500], borderRadius: '10px' },
            '&::-webkit-scrollbar-track': { backgroundColor: colors.grey[700] },
            scrollbarWidth: 'thin',
            scrollbarColor: `${colors.greenAccent[500]} ${colors.grey[700]}`,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Deadlines
            </Typography>
          </Box>
          <List>
            {loadingEvents
              ? Array(5).fill().map((_, index) => (
                  <ListItem key={index}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </ListItem>
                ))
              : currentEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      margin: "10px 0px",
                      borderRadius: "5px",
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Typography>
                          {formatDate(event.start, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
          </List>
        </Box>

        {/* ROW 3: Development Progress */}
        <Box
          gridColumn={{ xs: "span 12", lg: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          p="10px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography variant="h5" fontWeight="600">
              Development Progress
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            {loadingEvents ? (
              <Skeleton variant="circular" width={125} height={125} />
            ) : (
              <ProgressCircle size="125" progress=".20" />
            )}
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              Phase 1/5
            </Typography>
            <Typography>App Dev!</Typography>
          </Box>
        </Box>

        {/* ROW 3: To-Do List */}
        <Box
          gridColumn={{ xs: "span 12", lg: "span 4" }}
          gridRow={{ xs: "span 2", lg: "span 4" }}
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          {loadingTodos ? (
            <Box p="15px">
              <Skeleton variant="rectangular" width="100%" height={300} />
            </Box>
          ) : (
            <TodoList todos={todos} setTodos={setTodos} />
          )}
        </Box>

        {/* ROW 4: Team Members */}
        <Box
          gridColumn={{ xs: "span 12", lg: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="10px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Team Members
            </Typography>
          </Box>
          <Box marginTop="25px">
            {loadingTodos ? (
              <Skeleton variant="rectangular" width="100%" height={100} />
            ) : (
              <TeamGrid />
            )}
          </Box>
        </Box>

        <JokeOfTheDay />
      </Box>
    </Box>
  );
};

export default Dashboard;

