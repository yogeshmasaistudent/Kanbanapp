const express = require("express");
const { TaskModel } = require("../models/kanban.models");
const { auth } = require("../middlwares/auth.middleware");
const TaskRouter = express.Router();
const {access} =  require("../middlwares/accese.middleware")

// 1. Create Task Route
TaskRouter.post("/Create",auth,async(req,res)=>{
    const {title, description,status} = req.body;
    try {
        const Taks = new TaskModel({title,description,status});
        await Taks.save();
        res.status(200).json({msg:"Task has been created Now"});
    } catch (error) {
        res.status(400).json({msg:"Due to some error now able to create. "})
    }
})



// 2. Read Taks Route => 
TaskRouter.get("/read",auth,async(req,res)=>{
    try {
        const Task = await TaskModel.find();
        res.status(200).json({msg:"This all You data",Task})
    } catch (error){
        res.status(400).json({msg:"Due to network issue Not able to Get Data"})
    }
})



// 3. Update Task Route => 

TaskRouter.patch("/update/:taskId",auth,  async (req, res) => {
    const { title, description, status } = req.body;
    const taskId = req.params.taskId;
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { title, description, status });
        if (!updatedTask) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.status(200).json({ msg: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(400).json({ msg: "Failed to update task" });
    }
});



// Delete Task Route
TaskRouter.delete("/delete/:taskId", auth, access("admin"), async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.status(200).json({ msg: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        res.status(400).json({ msg: "Failed to delete task" });
    }
});










//  Finishing Step Here we done with all CRUD Operation Here => 
module.exports = {
    TaskRouter
}