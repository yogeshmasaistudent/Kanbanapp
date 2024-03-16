const mongoose = require("mongoose");
// Task Model for kanban app 
const TaskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Progress", "Completed"],
    default: "Pending",
  },
});

const TaskModel = mongoose.model("task", TaskSchema);

module.exports = {
  TaskModel,
};
