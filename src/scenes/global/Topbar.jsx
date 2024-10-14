import React, { useState, useEffect, useContext } from "react";
import { Box, IconButton, Badge, Typography, List, ListItem, ListItemText, Popover, Button, useTheme } from "@mui/material";
import { useAuth } from "../../authprovider"; // Ensure the correct path to your auth provider
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

// Firestore imports
import { db } from "../../firebase"; // Ensure this is the correct path to your Firebase configuration
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { logout } = useAuth(); // Get the logout function from useAuth
  const [newNotifications, setNewNotifications] = useState(false); // Track if there's a new notification
  const [notifications, setNotifications] = useState([]); // Store the list of notifications
  const [anchorEl, setAnchorEl] = useState(null); // For the notifications popover
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // For the profile popover (logout)

  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings"); // Navigate to the settings page
  };

  // Firestore collection references
  const eventsCollectionRef = collection(db, "calendarEvents");
  const todosCollectionRef = collection(db, "todo");

  // Listen for new events or todos in real-time
  useEffect(() => {
    const unsubscribeEvents = onSnapshot(eventsCollectionRef, (snapshot) => {
      if (!snapshot.empty) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const eventData = change.doc.data(); // Get the data of the new event
            setNewNotifications(true);
            setNotifications((prev) => [
              ...prev,
              {
                message: `New calendar event added: ${eventData.title}`,
                id: change.doc.id,
                type: "event",
              },
            ]);
          }
        });
      }
    });

    const unsubscribeTodos = onSnapshot(todosCollectionRef, (snapshot) => {
      if (!snapshot.empty) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const todoData = change.doc.data(); // Get the data of the new to-do item
            setNewNotifications(true);
            setNotifications((prev) => [
              ...prev,
              {
                message: `New to-do item added: ${todoData.text}`,
                id: change.doc.id,
                type: "todo",
              },
            ]);
          }
        });
      }
    });

    // Cleanup Firestore listeners on component unmount
    return () => {
      unsubscribeEvents();
      unsubscribeTodos();
    };
  }, []);

  // Handle click on the notification bell
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the popover
    setNewNotifications(false); // Clear the notification dot when opened
  };

  // Handle closing the notification popover
  const handleCloseNotification = () => {
    setAnchorEl(null);
    setNotifications([]); // Reset the notification list after viewing
  };

  // Handle click on the profile icon to show logout popover
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget); // Open the profile popover
  };

  // Handle closing the logout popover
  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
  };

  const openNotification = Boolean(anchorEl);
  const notificationId = openNotification ? "notifications-popover" : undefined;

  const openProfile = Boolean(profileAnchorEl);
  const profileId = openProfile ? "profile-popover" : undefined;

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="5px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>

        {/* Notification Bell Icon with Red Circle Badge */}
        <IconButton onClick={handleNotificationClick}>
          <Badge color="error" variant="dot" invisible={!newNotifications}>
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon onClick={handleSettingsClick} />
        </IconButton>

        {/* Profile Icon for Logout */}
        <IconButton onClick={handleProfileClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Notifications Popover */}
      <Popover
        id={notificationId}
        open={openNotification}
        anchorEl={anchorEl}
        onClose={handleCloseNotification}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, width: "250px" }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.length === 0 ? (
              <Typography>No new notifications</Typography>
            ) : (
              notifications.map((notification, index) => (
                <ListItem key={index}>
                  <ListItemText primary={notification.message} />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>

      {/* Profile Popover for Logout */}
      <Popover
        id={profileId}
        open={openProfile}
        anchorEl={profileAnchorEl}
        onClose={handleCloseProfile}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" gutterBottom>
            Account
          </Typography>
          <Button variant="contained" color="primary" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default Topbar;
