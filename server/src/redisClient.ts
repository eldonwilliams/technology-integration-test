import { createClient } from "redis";
import { getEnvString } from "./util/getEnv";

const REDIS_URL = getEnvString("REDIS_URL", "redis://redis:6379") as string;

export const redisClient = createClient({ url: REDIS_URL, });
redisClient.connect().catch((reason) => console.error(reason));