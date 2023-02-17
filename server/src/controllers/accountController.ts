import { LoggedInErrResponse, loggedOutMiddleware } from "../util/authMiddleware";
import { Body, Controller, Middlewares, Post, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { AccDetailInvalidErr, accountPasswordSchema, accountUsernameSchema, getAccountByUsername, setAccountByName, SignupAlreadyExistsErr, SignupBody, SignupResponse } from "../services/accountService";
import bcrypt from "bcrypt";
import { redisClient, RedisError } from "../redisClient";

// /**
//  * Some middleware that will send an error code and stop the request if an account is logged in
//  */


// /**
//  * Assures the req.body contains ALL of what is in the contains array.
//  * Will reject if not with
//  * 
//  * {
//  *      err: "BodyIncomplete",
//  *      what: [
//  *          "username",
//  *          "password"
//  *      ]
//  * }
//  * 
//  * { err: "BodyIncomplete". what: String[], }
//  * 
//  * @param contains What the body should contain
//  * @returns A Express.Handler function
//  */
// let assureBody = (contains: string[]): express.Handler => {
//     return (req, res, next) => {
//         let body = req.body;
//         let nullKeys: string[] = [];
//         contains.forEach(key => {
//             if (body[key] === undefined) nullKeys.push(key);
//         });
//         if (nullKeys.length === 0) return next();
//         res.status(400).send({
//             err: "BodyIncomplete",
//             what: nullKeys,
//         })
//     }
// }

// let authenticationManagement: RouteSubscriber = ({ express, redis, }) => {
//     express.use('/auth', (req, res, next) => {
//         if (!redis.isReady) return res.status(425).send({ err: "NotReady", });
//         next();
//     });

//     express.post("/auth/signup", loggedOutMiddleware, assureBody(["username","password"]), async (req, res) => {
//         const username = req.body.username;
//         const password = await bcrypt.hash(req.body.password, 3);
//         if (await redis.json.get(username) != null) return res.status(409).send({ err: "AlreadyExists", });
//         let v = await redis.json.set(username, "$", { username: username, password: password, });
//         if (v == "OK") res.status(200).send({ success: "Created", });
//         else res.status(500).send({ err: "Server", });
//     });

//     express.post("/auth/login", loggedOutMiddleware, assureBody(["username","password"]), async (req, res) => {
//         const username = req.body.username;
//         const accountData = await redis.json.get(username) as RedisUserData | null;
//         if (accountData == null) return res.status(404).send({ err: "NotFound", });
//         const password = req.body.password;
//         if (!await bcrypt.compare(password, accountData.password)) return res.status(401).send({ err: "BadCredentials", });
//         const token = await sign({ user: accountData.username, }, JWT_KEY);
//         res.cookie('sessionToken', token).status(200).send({ success: "LoggedIn", });
//     });

//     express.get("/auth/logout", async (req, res) => {
//         res.clearCookie('sessionToken').status(200).send({ success: "LoggedOut", });
//     });

//     express.get("/auth/whoami", (req, res) => {
//         res.status(200).send({ success: req.auth, });
//     });
// }

@Route("/account")
export class AccountController extends Controller {
    @Post("/signup")
    @Tags("Account")
    @Security("sessionToken")
    @Response<LoggedInErrResponse>(403)
    @Response<SignupAlreadyExistsErr>(409)
    @Response<AccDetailInvalidErr>(400)
    @Response<RedisError>(500)
    @SuccessResponse(201, "Account Created")
    @Middlewares(loggedOutMiddleware)
    public async createAccount(@Body() request: SignupBody): Promise<SignupResponse> {
        const { username, password } = request;
        const passwordValidation = accountPasswordSchema.validate(password, { details: true, });
        const usernameValidation = accountUsernameSchema.validate(username, { details: true, });
        if (!passwordValidation || !usernameValidation) {
            this.setStatus(400);
            return ({
                err: "Validation Err",
                details: [...passwordValidation as any[], ...usernameValidation as any[]]
            })
        }
        if (await getAccountByUsername(username) !== undefined) {
            this.setStatus(409)
            return ({ err: "Already Exists", });
        }
        const encryptedPassword = await bcrypt.hash(password, 4);
        const success = await setAccountByName(username, ({ username, password: encryptedPassword, }));
        if (success) {
            this.setStatus(201);
            return ({ success: true, })
        } else {
            this.setStatus(500);
            return RedisError;
        }
    }
}