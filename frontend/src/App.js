import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert
} from "@mui/material";

const API_URL = "http://localhost:5000/tasks";

function App() {
  // State
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error(error);
      showSnackbar("Error fetching tasks", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Snackbar helpers
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add a new task
  const addTask = async () => {
    if (!title || !description) {
      showSnackbar("Title and description are required", "warning");
      return;
    }
    try {
      await axios.post(API_URL, { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
      showSnackbar("Task added successfully");
    } catch (err) {
      console.error(err);
      showSnackbar("Error adding task", "error");
    }
  };

  // Mark a task as complete
  const completeTask = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/complete`);
      fetchTasks();
      showSnackbar("Task marked as complete");
    } catch (err) {
      console.error(err);
      showSnackbar("Error marking task as complete", "error");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        
        {/* Left Column - Form */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" mb={2}>
              Add a Task
            </Typography>
            
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button variant="contained" onClick={addTask} fullWidth>
              Add
            </Button>
          </Box>
        </Grid>
        
        {/* Right Column - Task List */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" mb={2}>
              Tasks
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  variant="outlined"
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => completeTask(task.id)}
                    >
                      Done
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;