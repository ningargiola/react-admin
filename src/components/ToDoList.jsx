import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Checkbox,
  Icon,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme"; // Assuming you have a custom theme for colors
import DeleteIcon from "@mui/icons-material/Delete";

const TodoList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");

  // Retrieve To-Do List from localStorage when the component mounts
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todoList")) || [];
    setTodos(savedTodos);
  }, []);

  // Save To-Do List to localStorage whenever todos changes
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todos));
  }, [todos]);

  // Function to add a new to-do item
  const handleAddTodo = () => {
    if (todoText.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTodoText(""); // Clear input after adding
  };

  // Function to delete a to-do item
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Function to toggle completion of a to-do item
  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <Box backgroundColor={colors.primary[400]} borderRadius="5px" p="10px">
      {/* To-Do List Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        colors={colors.grey[100]}
        p="15px"
      >
        <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
          To-Do List
        </Typography>
      </Box>

      {/* Input and Add Button */}
      <Box display="flex" alignItems="center" mb="10px" mt="15px">
        <TextField
          fullWidth
          variant="outlined"
          label="Add a new task"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          sx={{ mr: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTodo}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
          }}
        >
          Add
        </Button>
      </Box>

      {/* To-Do List Items */}
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              backgroundColor: todo.completed ? colors.greenAccent[500] : colors.primary[700],
              margin: "10px 0",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
              sx={{
                color: colors.greenAccent[600],
                '&.Mui-checked': {
                  color: colors.greenAccent[600],
                },
              }}
            />
            <ListItemText
              primary={
                <Typography
                  sx={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: colors.grey[100],
                  }}
                >
                  {todo.text}
                </Typography>
              }
            />
            <IconButton onClick={() => handleDeleteTodo(todo.id)} sx={{ marginRight: "10px" }}>
            <DeleteIcon sx={{ color: colors.redAccent[500], fontSize: "30px" }} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TodoList;
