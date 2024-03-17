const express = require("express");
const { connection } = require("./config/db.connection");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { UserRouter } = require("./routes/user.roeut");
const { TaskRouter } = require("./routes/kanban.route");
app.use(cors());
app.use(express.json());
const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Team Management System',
      version: '1.0.0',
    },
    servers:[
      {
        url:"http://localhost:2424"
      }
    ]
  },
  apis: ["./routes/*.js"], // Note the corrected path here
};

const openapiSpecification = swaggerJsdoc(options);

// Define the route for Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));



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
