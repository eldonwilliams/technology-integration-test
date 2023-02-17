import { RedisError } from "../redisClient";

export interface SessionInfo {
    user: string,
}

export type SessionInfoResponse = SessionInfo | RedisError;

export interface LoginReqBody {
    username: string,
    password: string
}