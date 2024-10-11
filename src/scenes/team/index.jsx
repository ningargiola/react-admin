import React, { useState, useEffect } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Firebase Firestore functions
import { getAuth, deleteUser } from "firebase/auth";
import { db } from "../../firebase"; 
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { IconButton } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Assuming Firestore document ID as the ID for the user
          name: `${data.firstName} ${data.lastName}`, // Combine firstName and lastName
          position: data.position, // Other fields remain the same
          phone: data.contact,
          email: data.email,
          access: data.accesslevel,
        };
      });
      setUsers(usersData);
    };
  
    fetchData();
  }, []);

  const auth = getAuth();

  const handleDeleteUser = async (id, email) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "users", id));

      // For deleting the user from Firebase Auth, you would typically use the Firebase Admin SDK.
      // Assuming you have a backend that handles this:
      // You might need to trigger a backend API call that handles the user deletion via Firebase Admin SDK.
      console.log(`Deleted user ${email} from Firestore.`);

      // You can optionally refresh the data after deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "position",
      headerName: "Position",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDeleteUser(params.row.id, params.row.email)}
        >
          <DeleteOutlineOutlinedIcon sx={{ color: colors.redAccent[600] }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={users} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;