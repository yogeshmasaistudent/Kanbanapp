const express = require("express");
const { TaskModel } = require("../models/kanban.models");
const { auth } = require("../middlwares/auth.middleware");
const TaskRouter = express.Router();
const {access} =  require("../middlwares/accese.middleware")


// Here i am writing documatation for making is useful for frontend Developer can understand it beeter way. 

// Here is doucumation comment for swagger we are usign Here . 

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The task ID.
 *           example: 622ba2c61c0e701f7b43837d
 *         title:
 *           type: string
 *           description: The task's title.
 *           example: Task 1
 *         description:
 *           type: string
 *           description: The task's description.
 *           example: This is task 1 description.
 *         status:
 *           type: string
 *           description: The task's status.
 *           example: In Progress
 */

/**
 * @swagger
 * /tasks/create:
 *   post:
 *     summary: Create a new task.
 *     tags: [Task]
 *     description: Create a new task and save it to the database.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Creation success message.
 *                   example: Task has been created.
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error.
 */


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


// Now Here swagerr documation Here 

/**
 * @swagger
 * /tasks/read:
 *   get:
 *     summary: Retrieve all tasks.
 *     tags: [Task]
 *     description: Retrieve all tasks from the database.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message.
 *                   example: Here are all your tasks.
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error.
 */



// 2. Read Taks Route => 
TaskRouter.get("/read",auth,async(req,res)=>{
    try {
        const Task = await TaskModel.find();
        res.status(200).json({msg:"This all You data",Task})
    } catch (error){
        res.status(400).json({msg:"Due to network issue Not able to Get Data"})
    }
})


// Swagger documation for Update task comment Here . => 

/**
 * @swagger
 * /tasks/update/{taskId}:
 *   patch:
 *     summary: Update an existing task.
 *     tags: [Task]
 *     description: Update an existing task's information.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       '200':
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Update success message.
 *                   example: Task updated successfully.
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '404':
 *         description: Task not found.
 *       '500':
 *         description: Internal server error.
 */



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



// Here i am writing doc for Delete task we writing swagger comment here for that .

/**
 * @swagger
 * /tasks/delete/{taskId}:
 *   delete:
 *     summary: Delete an existing task.
 *     tags: [Task]
 *     description: Delete an existing task from the database.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID.
 *     responses:
 *       '200':
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Delete success message.
 *                   example: Task deleted successfully.
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '404':
 *         description: Task not found.
 *       '500':
 *         description: Internal server error.
 */


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