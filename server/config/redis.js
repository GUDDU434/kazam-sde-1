const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined, // Use if authentication is required
});

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;
