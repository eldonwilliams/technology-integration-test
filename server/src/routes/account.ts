import { Handler } from "express";
import { sign } from "jsonwebtoken";
import { JWT_KEY } from "../util/authMiddleware";

/**
 * Some middleware that will send an error code and stop the request if an account is logged in
 */
let loggedOutMiddleware: Handler = (req, res, next) => {
    if (req.authed) return res.status(400).send("You already are logged in. Please log out first.");
    next();
}

let authenticationManagement: RouteSubscriber = ({ express, redis, }) => {
    express.use('/auth', (req, res, next) => {
        if (!redis.isReady) return res.status(425).send("Redis is not up yet, come back soon.");
        next();
    });

    express.post("/auth/signup", loggedOutMiddleware, async (req, res) => {
        const username = req.body.username;
        if (typeof username !== "string") return res.status(400).send("Please include a username.");
        const sessionToken = sign({ user: username, }, JWT_KEY);
        await redis.set(username, sessionToken).catch(() => res.status(500).send("Redis Error."));
        res.status(200).send("Account created. Please login.");
    });

    express.post("/auth/login", loggedOutMiddleware, async (req, res) => {
        const username = req.body.username;
        if (typeof username !== "string") return res.status(400).send("Please include a username.");
        let token = await redis.get(username);
        if (token === null) return res.status(500).send("Couldn't find that account. Try again.");
        res.cookie('sessionToken', token).status(200).send(`Authenticated as ${username}.`);
    });

    express.get("/auth/logout", async (req, res) => {
        res.clearCookie('sessionToken').status(200).send("Logged out.");
    });

    express.get("/auth/whoami", (req, res) => {
        res.status(200).send(`You are logged in as ${req.auth}`);
    });
}

export default [
    authenticationManagement,
];