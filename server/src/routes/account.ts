import { Handler } from "express";
import { sign } from "jsonwebtoken";
import { JWT_KEY } from "../util/authMiddleware";
import * as bcrypt from "bcrypt";

/**
 * Some middleware that will send an error code and stop the request if an account is logged in
 */
let loggedOutMiddleware: Handler = (req, res, next) => {
    if (req.authed) return res.status(400).send({ err: "LoggedIn", });
    next();
}

/**
 * Assures the req.body contains ALL of what is in the contains array.
 * Will reject if not with
 * 
 * {
 *      err: "BodyIncomplete",
 *      what: [
 *          "username",
 *          "password"
 *      ]
 * }
 * 
 * { err: "BodyIncomplete". what: String[], }
 * 
 * @param contains What the body should contain
 * @returns A Express.Handler function
 */
let assureBody = (contains: string[]): Handler => {
    return (req, res, next) => {
        let body = req.body;
        let nullKeys: string[] = [];
        contains.forEach(key => {
            if (body[key] === undefined) nullKeys.push(key);
        });
        if (nullKeys.length === 0) return next();
        res.status(400).send({
            err: "BodyIncomplete",
            what: nullKeys,
        })
    }
}

let authenticationManagement: RouteSubscriber = ({ express, redis, }) => {
    express.use('/auth', (req, res, next) => {
        if (!redis.isReady) return res.status(425).send({ err: "NotReady", });
        next();
    });

    express.post("/auth/signup", loggedOutMiddleware, assureBody(["username","password"]), async (req, res) => {
        const username = req.body.username;
        const password = await bcrypt.hash(req.body.password, 3);
        if (await redis.json.get(username) != null) return res.status(409).send({ err: "AlreadyExists", });
        let v = await redis.json.set(username, "$", { username: username, password: password, });
        if (v == "OK") res.status(200).send({ success: "Created", });
        else res.status(500).send({ err: "Server", });
    });

    express.post("/auth/login", loggedOutMiddleware, assureBody(["username","password"]), async (req, res) => {
        const username = req.body.username;
        const accountData = await redis.json.get(username) as RedisUserData | null;
        if (accountData == null) return res.status(404).send({ err: "NotFound", });
        const password = req.body.password;
        if (!await bcrypt.compare(password, accountData.password)) return res.status(401).send({ err: "BadCredentials", });
        const token = await sign({ user: accountData.username, }, JWT_KEY);
        res.cookie('sessionToken', token).status(200).send({ success: "LoggedIn", });
    });

    express.get("/auth/logout", async (req, res) => {
        res.clearCookie('sessionToken').status(200).send({ success: "LoggedOut", });
    });

    express.get("/auth/whoami", (req, res) => {
        res.status(200).send({ success: req.auth, });
    });
}

export default [
    authenticationManagement,
];