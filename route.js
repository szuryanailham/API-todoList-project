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
  const { title, description, status, dueDate } = req.body;
  const newTask = mongoose.model("Task", taskSchemavalidation);
  try {
    const task = await newTask.create({
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
    const deletedTask = await Tasks.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

// Updating new data with "PUT"
app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title: newTitle, description: newDescription, status: newStatus, dueDate: newDueDate } = req.body;
  // filtering request
  const updateFields = {};
  if (newTitle) updateFields.title = newTitle;
  if (newDescription) updateFields.description = newDescription;
  if (newStatus) updateFields.status = newStatus;
  if (newDueDate) updateFields.dueDate = newDueDate;
  try {
    const updatedTask = await Tasks.findByIdAndUpdate(taskId, { $set: updateFields }, { new: false, runValidators: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Failed to update task", error });
  }
});

// fetching detail data  with "GET"
app.get("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Tasks.findById(taskId).exec();
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve task", details: err.message });
  }
});

// fetching update complated task
app.patch("/tasks/:id/done", async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Tasks.findById(taskId);
    if (task && task.status === "in-progress") {
      const DoneTask = mongoose.model("DoneTasks", taskSchemavalidation);
      const newDoneTask = await DoneTask.create({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        completed_at: Date.now(),
      });
      await task.deleteOne();
      res.status(200).json({
        message: "Task status updated to completed",
        newDoneTask,
      });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
    task.status = "completed";
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      message: "Error making task done",
      error: error.message,
    });
  }
});
