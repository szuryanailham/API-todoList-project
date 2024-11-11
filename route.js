import express from "express";
import { connectMonggoDB, Tasks } from "./src/model/dbconnect.js";
import cors from "cors";
import { taskSchemavalidation } from "./src/model/dbscema.js";
import mongoose from "mongoose";

// intialization of call express js
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());
await connectMonggoDB();

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});

// Fetching data with "GET"
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find().sort({ created_at: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Creating new data with "POST"
app.post("/tasks/create", async (req, res) => {
  const { id, title, description, status, dueDate } = req.body;
  const newTask = mongoose.model("Task", taskSchemavalidation);
  try {
    const task = await newTask.create({
      id,
      title,
      description,
      status,
      dueDate,
    });
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
});

// Deleting new data with "Delete"
app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Tasks.findOneAndDelete({ id: taskId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});
