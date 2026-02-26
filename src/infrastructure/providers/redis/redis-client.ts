import Redis from "ioredis";
import { logger } from "../logs/logger";


export const redisClient = new Redis({
    host: "localhost",
    port: 6379
});

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error("Redis error:", err));
