const express = require("express");
const cors = require("cors");
const taskRouter = require("./controllers/task.controller");

require("dotenv").config();
require("./config/db");
require("./config/redis");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/start", (req, res) => {
  res.send("welcome to the auth server");
});

// Tasks Routes
app.post("/add", taskRouter.CreateTask);
app.get("/fetchAllTasks", taskRouter.GetAllTasks);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
