import { redisClient, RedisError } from "../redisClient";
import { JWT_KEY, LoggedInErrResponse } from "../util/authMiddleware";
import passwordValidator from "password-validator";
import jwt from "jsonwebtoken";

interface SuccessfulSignupResponse {
    success: true,
}

export interface SignupAlreadyExistsErr {
    err: "Already Exists",
}

export type SignupResponse = SuccessfulSignupResponse | SignupAlreadyExistsErr | AccDetailInvalidErr | LoggedInErrResponse | RedisError;

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

export const getAccountByUsername = (username: string): Promise<Account | undefined> => new Promise((resolve, _reject) => {
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

export const getAccountFromToken = (token: string): Promise<Account | undefined> => new Promise((resolve, _reject) => {
    jwt.verify(token, JWT_KEY, {}, async (err, decoded) => {
        if (err !== null || decoded === undefined || typeof decoded === "string") return resolve(undefined);
        resolve(await getAccountByUsername(decoded.user))
    });
});

export const setAccountByName = (username: string, newAccData: Account): Promise<boolean> => new Promise((resolve, _reject) => {
    redisClient.json.set(username, "$", JSON.stringify(newAccData))
        .then((ok) => resolve(ok === "OK"))
        .catch(() => resolve(false));
});

export const updateAccountByName = (username: string, path: keyof Account & string, newData: string): Promise<boolean> => new Promise((resolve, _reject) => {
    redisClient.json.set(username, path, JSON.stringify(newData))
        .then((ok) => resolve(ok === "OK"))
        .catch(() => resolve(false));
});

export const genJWTForAccount = (account: Account): string => jwt.sign({ user: account.username, }, JWT_KEY);

/**
 * AccDetailInvalidErr and give status code 400
 */
export interface AccDetailInvalidErr {
    err: "Validation Err",
    details: { validation: string, message: string, argument?: number, }[],
}

/**
 * Validates that a username follows the schema.
 * If not it should throw AccDetailInvalidErr and give status code 400
 */
export const accountPasswordSchema = new passwordValidator()
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().not().spaces();

/**
 * Validates that a username follows the schema.
 * If not it should throw AccDetailInvalidErr and give status code 400
 */
export const accountUsernameSchema = new passwordValidator()
.is().min(4)
.is().max(15)
.has().not().uppercase()
.has().not().symbols()
.has().not().spaces();