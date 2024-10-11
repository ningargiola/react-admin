import { Box, Button, IconButton, Typography, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar for event management
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDate } from "@fullcalendar/core";
import { useState, useEffect } from "react";
import TodoList from "../../components/ToDoList";
import userImage from '/Users/nickingargiola/react-admin/src/assets/user.png';
import TeamGrid from "../../components/TeamGrid";
import JokeOfTheDay from "../../components/JokeOfTheDay";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");

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

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect(); // Clear the selection after the prompt

    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr || selected.startStr,
        allDay: selected.allDay,
      };

      setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

    // Retrieve To-Do List from localStorage when the component mounts
    useEffect(() => {
      const savedTodos = JSON.parse(localStorage.getItem("todoList")) || [];
      setTodos(savedTodos);
    }, []);
  
    // Save To-Do List to localStorage whenever todos changes
    useEffect(() => {
      localStorage.setItem("todoList", JSON.stringify(todos));
    }, [todos]);

  const handleEventClick = (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      const updatedEvents = currentEvents.filter(
        (event) => event.id !== selected.event.id
      );
      setCurrentEvents(updatedEvents);
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


        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
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
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Deadlines
            </Typography>
          </Box>
          <List>
            {currentEvents.map((event) => (
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

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
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
            Devlopment Progress
          </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" progress=".20" />
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
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <TodoList />
        </Box>
        <Box
          gridColumn="span 6"
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
              <TeamGrid />
          </Box>
        </Box>
        <JokeOfTheDay/>
      </Box>
    </Box>
  );
};

export default Dashboard;
