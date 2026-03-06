/* eslint-disable no-console */
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        reconnectStrategy: (retries) => {
          if (retries >= 3) {
            return new Error("Failed to connect to Redis");
          }
          return Math.min(retries * 50, 2000);
        },
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Connected to Redis");
    });

    redisClient.on("ready", () => console.log("Redis Client Ready"));
    redisClient.on("reconnecting", () =>
      console.log("Redis Client Reconnecting"),
    );
    redisClient.on("end", () => console.log("Redis Client Ended"));

    await redisClient.connect();
  }

  return redisClient;
};
