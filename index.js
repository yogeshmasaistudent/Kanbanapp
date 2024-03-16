const express = require("express");
const { connection } = require("./config/db.connection");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { UserRouter } = require("./routes/user.roeut");
const { TaskRouter } = require("./routes/kanban.route");
app.use(cors());
app.use(express.json());

app.use("/user",UserRouter)

app.use("/Task",TaskRouter);


const PORT = process.env.PORT;
app.listen(PORT,async()=>{
    try {
        await connection
        console.log(`Server is Running PORT at ${PORT}`)
    } catch (error) {
        console.log("Here some error in server")
    }
})
