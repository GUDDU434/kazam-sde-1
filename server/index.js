const express = require("express");
const cors = require("cors");
const taskRouter = require("./controllers/task.controller");

const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  RefreshToken,
  GetUser,
  UpdateUserDetails,
} = require("./controllers/user.controller");
const { authenticate } = require("./middleware/auth_middleware");
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

// Auth Routes
app.post("/auth/signup", RegisterUser);
app.post("/auth/login", LoginUser);
app.post("/auth/refresh", RefreshToken);
app.get("/auth/logout", authenticate, LogoutUser);
app.get("/auth/user", authenticate, GetUser);
app.put("/auth/user", authenticate, UpdateUserDetails);

// Tasks Routes
app.post("/add", taskRouter.CreateTask);
app.get("/fetchAllTasks", taskRouter.GetAllTasks);
app.get("/fetchTaskById/:id", taskRouter.GetTaskById);
app.put("/updateTaskById/:id", taskRouter.UpdateTask);
app.delete("/deleteTaskById/:id", taskRouter.DeleteTask);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
