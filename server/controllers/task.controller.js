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

    if (tasks.length > 5) {
      // Store tasks in MongoDB
      await Task.insertMany(tasks);

      // Clear Redis cache
      await redisClient.del(process.env.REDIS_KEY);
    } else {
      // Update Redis cache with new tasks
      await redisClient.set(process.env.REDIS_KEY, JSON.stringify(tasks));
    }

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

// Get Single Task
module.exports.GetTaskById = async (req, res) => {
  try {
    let tasks = [];
    tasks = await redisClient.get(process.env.REDIS_KEY);
    tasks = tasks ? JSON.parse(tasks) : [];

    const task = tasks.find((task) => task._id.toString() === req.params.id);

    if (!task) {
      tasks = await Task.findById(req.params.id);
    }

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Task
module.exports.UpdateTask = async (req, res) => {
  try {
    let tasks;
    tasks = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tasks) {
      tasks = await redisClient.get(process.env.REDIS_KEY);
      tasks = tasks ? JSON.parse(tasks) : [];

      tasks = tasks.map((task) =>
        task._id === req.params.id ? { ...task, ...req.body } : task
      );

      if (tasks.length > 0) {
        await redisClient.set(process.env.REDIS_KEY, JSON.stringify(tasks));
      } else {
        return res.status(404).json({ message: "Task not found" });
      }
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Task
module.exports.DeleteTask = async (req, res) => {
  try {
    let tasks;
    tasks = await Task.findByIdAndDelete(req.params.id);
    if (!tasks) {
      tasks = await redisClient.get(process.env.REDIS_KEY);
      tasks = tasks ? JSON.parse(tasks) : [];

      tasks = tasks.filter((task) => task._id !== req.params.id);

      await redisClient.set(process.env.REDIS_KEY, JSON.stringify(tasks));
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
