import { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useTheme, IconButton } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import { db } from "../../firebase"; // Make sure to import the Firebase setup
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';


const Cam = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ideas, setIdeas] = useState([]);
  const [open, setOpen] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");

  // Fetch ideas from Firestore
  useEffect(() => {
    const fetchIdeas = async () => {
      const querySnapshot = await getDocs(collection(db, "camideas"));
      const ideasData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setIdeas(ideasData);
    };
    fetchIdeas();
  }, []);

  // Add new idea to Firestore
  const handleAddIdea = async () => {
    if (newIdeaTitle.trim() !== "" && newIdeaDescription.trim() !== "") {
      await addDoc(collection(db, "camideas"), { 
        title: newIdeaTitle, 
        description: newIdeaDescription 
      });
      setNewIdeaTitle("");
      setNewIdeaDescription("");
      setOpen(false);
      
      // Refetch ideas after adding new one
      const querySnapshot = await getDocs(collection(db, "camideas"));
      setIdeas(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  // Delete an idea from Firestore
  const handleDeleteIdea = async (id) => {
    await deleteDoc(doc(db, "camideas", id));
    
    // Refetch ideas after deleting one
    const querySnapshot = await getDocs(collection(db, "camideas"));
    setIdeas(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Open and close dialog for adding new idea
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box m="20px" sx={{ backgroundColor: "#fdd3e8", padding: '20px', borderRadius: '8px' }}>
      <Header 
        title={<span style={{ color: "white"}}><LocalFloristIcon fontSize="large" /></span>} 
        subtitle={<span style={{ color: "#fa7aba" }}>Cam's ideas and suggestions</span>} 
      />

      {ideas.map((idea) => (
        <Accordion key={idea.id} defaultExpanded sx={{ backgroundColor: "white" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.pink[500]} variant="h5">
              {idea.title}
            </Typography>
            {/* Delete Button */}
            <IconButton 
              aria-label="delete" 
              onClick={() => handleDeleteIdea(idea.id)}
              sx={{ marginLeft: 'auto' }} // Push delete button to the right
            >
              <DeleteIcon color="error" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="black">
              {idea.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* "+" Button to Add New Idea */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ marginTop: "20px", backgroundColor: colors.pink[500], color: "white" }}
      >
        Add Idea
      </Button>

      {/* Dialog to Add New Idea */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Idea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newIdeaTitle}
            onChange={(e) => setNewIdeaTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            maxRows={6}
            variant="outlined"
            value={newIdeaDescription}
            onChange={(e) => setNewIdeaDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddIdea} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cam;



