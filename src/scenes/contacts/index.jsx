import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase"; 

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contacts, setContacts] = useState([]); // State to store contacts from Firebase
  const [open, setOpen] = useState(false); // For opening the dialog
  const [newContact, setNewContact] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // Fetch contacts from Firebase
  useEffect(() => {
    const fetchContacts = async () => {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      const contactList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactList);
    };

    fetchContacts();
  }, []);

  const columns = [
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
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
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      flex: 1,
    },
    {
      field: "delete",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteContact(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Open the add contact form
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the add contact form
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  // Handle adding a new contact to Firebase
  const handleAddContact = async () => {
    const registrarId = `R${Math.floor(Math.random() * 10000)}`;
    const contactToAdd = {
      registrarId,
      ...newContact,
    };

    try {
      // Add new contact to Firestore
      const docRef = await addDoc(collection(db, "contacts"), contactToAdd);
      setContacts((prevContacts) => [...prevContacts, { id: docRef.id, ...contactToAdd }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setNewContact({
      name: "",
      age: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
    });
    setOpen(false); // Close the form after submission
  };

  // Handle deleting a contact from Firebase
  const handleDeleteContact = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="CONTACTS" />

      {/* Add Contact Button */}
      <Box display="flex" justifyContent="flex-end" m="20px 0">
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          sx={{ backgroundColor: colors.blueAccent[600] }}
        >
          Add Contact
        </Button>
      </Box>

      <Box
        m="0px 0 0 0"
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={contacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Add Contact Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newContact.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Age"
            type="number"
            fullWidth
            variant="outlined"
            value={newContact.age}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={newContact.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newContact.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={newContact.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={newContact.city}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="zipCode"
            label="Zip Code"
            type="text"
            fullWidth
            variant="outlined"
            value={newContact.zipCode}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="white">
            Cancel
          </Button>
          <Button onClick={handleAddContact} color="white">
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contacts;
