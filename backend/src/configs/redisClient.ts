import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redisConnection: Redis;

if (process.env.NODE_ENV === "production") {
  if (!process.env.REDIS_URL) {
    throw new Error("Missing REDIS_URL in production environment");
  }

  redisConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });
} else {
  redisConnection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  });
}

let connection: string;

if (process.env.NODE_ENV === "production") {
  connection = "At Production";
} else {
  connection = "At localhost";
}
redisConnection.on("connect", () => {
  console.log(`Redis connected successfully ${connection}`);
});

redisConnection.on("ready", () => {
  console.log(`Redis ready ${connection}`);
});

redisConnection.on("error", (err) => {
  console.error("Redis error:", err);
});

export { redisConnection };
