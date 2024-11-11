import mongoose from "mongoose";
import { taskSchemavalidation } from "./dbscema.js";
// const urlMonggoDB = "mongodb://127.0.0.1:27017/todo-list";
const urlMonggoDB = "mongodb+srv://ilhamSuryana:szuryanailham@cluster0.pe9hw.mongodb.net/todo-list";

// connecting monggodb
export async function connectMonggoDB() {
  try {
    await mongoose.connect(urlMonggoDB);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export const Tasks = mongoose.model("Task", taskSchemavalidation);
