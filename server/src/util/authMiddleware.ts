import { Handler } from "express";
import { getEnvString } from "./getEnv";
import { randomBytes } from "crypto";
import { verify } from "jsonwebtoken";
import * as express from "express";

const randBytes = randomBytes(128).toString("hex");
const JWT_KEY = getEnvString("JWT_KEY", randBytes) as string;
if (JWT_KEY === randBytes) console.warn("JWT_KEY is unset! All and data encrypted with the randBytes will be unrecoverable once restarted.")

export function expressAuthentication(request: express.Request, securityName: string, scopes: string[]): Promise<any> {
    if (securityName !== "sessionToken") return Promise.reject({});
    const sessionToken = request.cookies.sessionToken;
    if (sessionToken === undefined) return Promise.resolve({
        authed: false,
        auth: undefined,
    });
    return new Promise((resolve, reject) => {
        verify(sessionToken, JWT_KEY, {}, (err, decoded) => {
            if (err !== null || decoded === undefined || typeof decoded === "string") return reject({});
            resolve({
                authed: true,
                auth: decoded.user,
            });
        });
    });
}

export interface LoggedInErrResponse {
    err: "Loggedin",
}

/**
 * A middleware that makes sure the client is NOT logged in.
 */
export const loggedOutMiddleware: Handler = (req, res, next) => {
    if (req.authed) return res.status(400).send({ err: "LoggedIn", });
    next();
}

export default expressAuthentication;
export { JWT_KEY, }