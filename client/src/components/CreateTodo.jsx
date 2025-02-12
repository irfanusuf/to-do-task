import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CreateTask = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(dayjs().add(12, "hour"));


  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required!");
      return;
    }



    const taskData = {
      title,
      description,
      dueDate: dueDate.toISOString(),
    };

    try {
      const response = await axiosInstance.post(
        "/api/v1/Task/CreateTask",
        taskData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Task created successfully!");
      setTitle("");
      setDescription("");
      setDueDate(dayjs().add(12, "hour"));

      setTimeout(() => {
        navigate("/todos")
      }, 2000);

      if (onTaskCreated) onTaskCreated(response.data.Task);
    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.response?.data?.Message || "Failed to create task");
    }
  };

  return (
    <Container maxWidth="md" sx={{marginTop : 4}}>
      <Typography variant="h5" gutterBottom>Create Task</Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DatePicker
        label="Due Date"
        value={dueDate}
        onChange={(newDate) => setDueDate(newDate)}
        disablePast
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        style={{ marginTop: 16 }}
      >
        Create Task
      </Button>
    </Container>
  );
};

export default CreateTask;
