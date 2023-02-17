import { LoggedInErrResponse, loggedOutMiddleware } from "../util/authMiddleware";
import { Body, Controller, Middlewares, Post, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { AccDetailInvalidErr, accountPasswordSchema, accountUsernameSchema, getAccountByUsername, setAccountByName, SignupAlreadyExistsErr, SignupBody, SignupResponse } from "../services/accountService";
import bcrypt from "bcrypt";
import { RedisError } from "../redisClient";

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
        const passwordValidation = accountPasswordSchema.validate(password, { details: true, }) as any[];
        const usernameValidation = accountUsernameSchema.validate(username, { details: true, }) as any[];
        if (passwordValidation.length > 0 || usernameValidation.length > 0) {
            this.setStatus(400);
            return ({
                err: "Validation Err",
                details: {
                    password: passwordValidation,
                    username: usernameValidation,
                },
            });
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