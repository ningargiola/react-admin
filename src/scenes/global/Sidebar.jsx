import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { auth, db, storage } from "../../firebase"; // Ensure proper Firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // State to store user nickname and position
  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("");
  const [devTagLight, setDevTagLight] = useState("");
  const [devTagDark, setDevTagDark] = useState("");
  const [userId, setUserId] = useState(null);

  const sidebarWidth = isCollapsed ? "80px" : "250px"; // Width of the sidebar when collapsed or expanded

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, get the user ID
        const uid = user.uid;
        setUserId(uid);

        // Fetch user data from Firestore
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setNickname(userData.nickname || "User"); // Set nickname
          setPosition(userData.position || "Position"); // Set position
         
        if (userData.devTagLight) {
          setDevTagLight(userData.devTagLight); // From Firestore if URL is saved
        } else {
          // If no URL in Firestore, try getting it from Firebase Storage
          const devTagLightRef = ref(storage, `devtags/${uid}-light`);
          const devTagLightURL = await getDownloadURL(devTagLightRef);
          setDevTagLight(devTagLightURL);
        }
        if (userData.devTagDark) {
          setDevTagDark(userData.devTagDark); // From Firestore if URL is saved
        } else {
          // If no URL in Firestore, try getting it from Firebase Storage
          const devTagDarkRef = ref(storage, `devtags/${uid}-dark`);
          const devTagDarkURL = await getDownloadURL(devTagDarkRef);
          setDevTagDark(devTagDarkURL);
        }
          console.log("No such document!");
        }
      } else {
        console.log("User is not logged in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",           // Fix sidebar on the left
          top: 0,                      // Stick to the top
          left: 0,                     // Stick to the left
          height: "100vh",             // Full height of the viewport
          width: sidebarWidth,         // Dynamic width based on collapse state
          zIndex: 1200,                // High zIndex to stay above content
          backgroundColor: `${colors.primary[400]} !important`,
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
            height: "100%",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMINS
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={theme.palette.mode === "light" ? devTagDark : devTagLight}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {nickname}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]} fontWeight="bold">
                    {position}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Directory
              </Typography>
              <Item
                title="Manage Team"
                to="/team"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Contacts Information"
                to="/contacts"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Expenses"
                to="/invoices"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Profile Form"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Data"
                to="/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          marginLeft: sidebarWidth, // Adds space on the right based on sidebar width
          width: "100%",            // Take the remaining width
          padding: "10px",          // Add some padding for the content
        }}
      >
      </Box>
    </Box>
  );
};

export default Sidebar;
