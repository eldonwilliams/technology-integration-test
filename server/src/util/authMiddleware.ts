import { Handler } from "express";
import { getEnvString } from "./getEnv";
import { randomBytes } from "crypto";
import { verify } from "jsonwebtoken";

const randBytes = randomBytes(128).toString("hex");
const JWT_KEY = getEnvString("JWT_KEY", randBytes) as string;
if (JWT_KEY === randBytes) console.warn("JWT_KEY is unset! All and data encrypted with the randBytes will be unrecoverable once restarted.")

let authMiddleware: Handler = (req, res, next) => {
    if (req.auth) return next();
    const sessionToken = req.cookies.sessionToken;
    if (sessionToken === undefined) return next();
    verify(sessionToken, JWT_KEY, {}, (err, decoded) => {
        if (err !== null || decoded === undefined || typeof decoded === "string") return next();
        req.authed = true;
        req.auth = decoded.user;
        next();
    });
};

export default authMiddleware;
export { JWT_KEY, }