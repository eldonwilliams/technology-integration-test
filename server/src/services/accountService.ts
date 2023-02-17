import { redisClient, RedisError } from "../redisClient";
import { LoggedInErrResponse } from "../util/authMiddleware";

interface SuccessfulSignupResponse {
    success: true,
}

export interface SignupAlreadyExistsErr {
    err: "Already Exists",
}

export type SignupResponse = SuccessfulSignupResponse | SignupAlreadyExistsErr | LoggedInErrResponse | RedisError;

export interface SignupBody {
    username: string,
    password: string,
}

export interface Account {
    username: string,
    password: string
}

function isAccount(acc: any): acc is Account {
    return (
        typeof acc.username === "string" &&
        typeof acc.password === "string" &&
        Object.keys(acc).length === 2
    );
}

export const getAccountByUsername = (username: string): Promise<Account | undefined> => new Promise((resolve, reject) => {
    redisClient.json.get(username)
        .then((found) => {
            if (!isAccount(found)) return resolve(undefined);
            resolve({
                username: found.username,
                password: found.password,
            })
        })
        .catch(() => resolve(undefined));
});

export const setAccountByName = (username: string, newAccData: Account): Promise<boolean> => new Promise((resolve, reject) => {
    redisClient.json.set(username, "$", JSON.stringify(newAccData))
        .then((ok) => resolve(ok === "OK"))
        .catch(() => resolve(false));
});

export const updateAccountByName = (username: string, path: keyof Account & string, newData: string): Promise<boolean> => new Promise((resolve, reject) => {
    redisClient.json.set(username, path, JSON.stringify(newData))
        .then((ok) => resolve(ok === "OK"))
        .catch(() => resolve(false));
});