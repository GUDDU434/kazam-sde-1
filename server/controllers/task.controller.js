const Task = require("../models/task.model.js");
const redisClient = require("../config/redis");

// Create Task
module.exports.CreateTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Fetch existing tasks from Redis
    let tasks = await redisClient.get(process.env.REDIS_KEY);
    tasks = tasks ? JSON.parse(tasks) : [];

    // Add new task to the array
    tasks.unshift(newTask);

    await newTask.save();

    // Update Redis cache with new tasks
    await redisClient.set(
      process.env.REDIS_KEY,
      JSON.stringify(tasks.slice(0, 50))
    );

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Tasks
module.exports.GetAllTasks = async (req, res) => {
  try {
    // TODO: implement pagination

    let tasks = [];
    tasks = await redisClient.get(process.env.REDIS_KEY);
    tasks = tasks ? JSON.parse(tasks) : [];

    if (tasks.length === 0) {
      tasks = await Task.find();
    }

    total = tasks.length;

    tasks = tasks.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ tasks, total: total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
