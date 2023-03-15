import { createClient } from "redis";
import getValueFromConfig from "./util/configReader";

/**
 * A Error that occurs because of Redis, should have status of 500.
 * Also see the RedisError constant.
 */
export interface RedisError {
    err: "Redis Failure"
}

export const RedisError: RedisError = { err: "Redis Failure", }

const REDIS_URL = getValueFromConfig("REDIS_URL", "redis://redis:6379");

export const redisClient = createClient({ url: REDIS_URL, });
redisClient.connect().catch((reason) => console.error(reason));