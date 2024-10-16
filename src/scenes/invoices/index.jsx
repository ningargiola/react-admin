import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase"; 

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [invoices, setInvoices] = useState([]); // State to store invoices from Firebase
  const [open, setOpen] = useState(false); // For opening the dialog
  const [newInvoice, setNewInvoice] = useState({
    name: "",
    description: "",
    cost: "",
    date: "",
  });

  // Fetch invoices from Firebase on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const invoiceList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(invoiceList);
    };

    fetchInvoices();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "description",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "delete",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteInvoice(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Open the add invoice form
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the add invoice form
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setNewInvoice({ ...newInvoice, [e.target.name]: e.target.value });
  };

  // Handle adding a new invoice to Firebase
  const handleAddInvoice = async () => {
    try {
      const docRef = await addDoc(collection(db, "expenses"), newInvoice);
      setInvoices((prevInvoices) => [...prevInvoices, { id: docRef.id, ...newInvoice }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setNewInvoice({
      name: "",
      description: "",
      cost: "",
      date: "",
    });
    setOpen(false); // Close the form after submission
  };

  // Handle deleting an invoice from Firebase
  const handleDeleteInvoice = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="EXPENSES"/>

      {/* Add Invoice Button */}
      <Box display="flex" justifyContent="flex-end" m="20px 0">
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          sx={{ backgroundColor: colors.blueAccent[600] }}
        >
          Add Invoice
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
        }}
      >
        <DataGrid checkboxSelection rows={invoices} columns={columns} />
      </Box>

      {/* Add Invoice Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Invoice</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newInvoice.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newInvoice.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="cost"
            label="Cost"
            type="number"
            fullWidth
            variant="outlined"
            value={newInvoice.cost}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="text"
            fullWidth
            variant="outlined"
            value={newInvoice.date}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="white">
            Cancel
          </Button>
          <Button onClick={handleAddInvoice} color="white">
            Add Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
