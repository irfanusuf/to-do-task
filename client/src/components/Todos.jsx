import React, { useEffect, useState } from "react";
import { Container, List, ListItem, ListItemText, Checkbox, IconButton, Typography, CircularProgress, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {axiosInstance} from "../utils/axiosInstance"

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
            await axiosInstance.put(`/api/v1/task/UpdateTaskStatus/${id}`, { status: "Completed" });
            setTodos(todos.map(todo => todo.Id === id ? { ...todo, Status: "Completed" } : todo));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/v1/task/DeleteTask/${id}`);
            setTodos(todos.filter(todo => todo.Id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ textAlign: "center", mt: 3, mb: 2 }}>Todo List</Typography>
            <List>
                {todos.length === 0 ? (
                    <Typography color="textSecondary">No tasks available</Typography>
                ) : (
                    todos.map(todo => (
                        <ListItem key={todo.Id} divider>
                            <Checkbox
                                checked={todo.Status === "Completed"}
                                onChange={() => handleComplete(todo.id)}
                            />
                            <ListItemText
                                primary={todo.title}
                                secondary={todo.description}
                                sx={{ textDecoration: todo.Status === "Completed" ? "line-through" : "none" }}
                            />
                            {todo.Status === "Completed" && (
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.Id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            )}
                        </ListItem>
                    ))
                )}
            </List>
        </Container>
    );
};

export default Todos;
