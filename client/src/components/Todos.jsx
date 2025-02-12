import React, { useEffect, useState } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PendingIcon from "@mui/icons-material/HourglassEmpty"; 
import InProgressIcon from "@mui/icons-material/Autorenew"; 
import CompletedIcon from "@mui/icons-material/CheckCircle"; 
import { axiosInstance } from "../utils/axiosInstance";
import dayjs from "dayjs";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/task/getAlltasks");
      setTodos(response.data.tasks);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axiosInstance.put(`/api/v1/task/UpdateTaskStatus/${id}`, {
        status: "Completed",
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, status: "Completed" } : todo
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/task/DeleteTask/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 3 }} />;

  const getStatusChip = (status) => {
    switch (status) {
      case "Pending":
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case "In Progress":
        return <Chip icon={<InProgressIcon />} label="In Progress" color="primary" size="small" />;
      case "Completed":
        return <Chip icon={<CompletedIcon />} label="Completed" color="success" size="small" />;
      default:
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ textAlign: "center", mt: 3, mb: 2 }}>
        Todo List
      </Typography>
      <List>
        {todos.length === 0 ? (
          <Typography color="textSecondary">No tasks available</Typography>
        ) : (
          todos.map((todo) => {
            const isCompleted = todo.status === "Completed";
            const remainingTime = dayjs(todo.dueDate).diff(dayjs(), "hour");

            return (
              <ListItem key={todo.id} divider alignItems="flex-start">
                <Checkbox
                  checked={isCompleted}
                  onChange={() => handleComplete(todo.id)}
                />
                <ListItemText
                  primary={
                    <Box>
                      {getStatusChip(todo.status)} 
                      <Typography variant="h6" sx={{ mt: 0.5 }}>
                        {todo.title}
                      </Typography>
                    </Box>
                  }
                  secondary={`${todo.description} - ${
                    remainingTime > 0 ? `Due in ${remainingTime} hours` : "Overdue!"
                  }`}
                  sx={{ textDecoration: isCompleted ? "line-through" : "none" }}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(todo.id)}
                  disabled={!isCompleted} 
                >
                  <DeleteIcon color={isCompleted ? "error" : "disabled"} />
                </IconButton>
              </ListItem>
            );
          })
        )}
      </List>
    </Container>
  );
};

export default Todos;
