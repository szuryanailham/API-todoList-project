import mongoose from "mongoose";
export const taskSchemavalidation = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [5, "Title should be at least 5 characters long"],
    maxlength: [100, "Title should not exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description should be at least 10 characters long"],
    maxlength: [500, "Description should not exceed 500 characters"],
  },
  status: {
    type: String,
    enum: {
      values: ["in-progress", "completed"],
      message: 'Status must be either "in-progress" or "completed"',
    },
    required: [true, "Status is required"],
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
    validate: {
      validator: function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dateValue = new Date(value);
        return dateValue >= today && dateValue < tomorrow.setDate(tomorrow.getDate() + 1);
      },
      message: "The date must be today or tomorrow.",
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
