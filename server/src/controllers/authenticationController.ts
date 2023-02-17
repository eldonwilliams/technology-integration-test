import { Body, Controller, Get, Middlewares, Post, Request, Response, Route, Security, Tags } from "tsoa";
import { LoggedInErrResponse, loggedInMiddleware, LoggedOutErrResponse, loggedOutMiddleware } from "../util/authMiddleware";
import express from "express";
import { LoginReqBody, SessionInfoResponse } from "../services/authenticationService";
import { genJWTForAccount, getAccountByUsername, getAccountFromToken } from "../services/accountService";
import { RedisError } from "../redisClient";
import bcrypt from "bcrypt";

@Route("/authentication")
export class AuthenticationController extends Controller {
    /**
     * Allows a client to login provided a username and password, required they are not currently logged in
     */
    @Tags("Authentication", "Account")
    @Security("sessionToken")
    @Post("/login")
    @Response<LoggedInErrResponse>(403)
    @Response(404, "Account Doesn't Exist")
    @Response(401, "The Password Is Wrong")
    @Middlewares(loggedOutMiddleware)
    public async login(@Body() body: LoginReqBody, @Request() request: express.Request) {
        const { username, password } = body;
        const account = await getAccountByUsername(username);
        if (account === undefined) {
            this.setStatus(404);
            return;
        }
        if (!(await bcrypt.compare(password, account.password))) {
            this.setStatus(401);
            return;
        }
        request.res?.cookie('sessionToken', genJWTForAccount(account));
    }

    /**
     * Logs the client out using clear cookie, returning an error if no sessionToken exists.
     */
    @Tags("Authentication", "Account")
    @Security("sessionToken")
    @Get("/logout")
    @Response<LoggedOutErrResponse>(401)
    @Middlewares(loggedInMiddleware)
    public async logout(@Request() request: express.Request) {
        request.res?.clearCookie("sessionToken");
        return ({ success: true, });
    }

    /**
     * Gets information about the current session, returning a unauthorized response if no session exists.
     */
    @Tags("Authentication")
    @Security("sessionToken")
    @Get("/session")
    @Response<LoggedOutErrResponse>(401)
    @Response<RedisError>(500)
    @Middlewares(loggedInMiddleware)
    public async getSessionInfo(@Request() request: express.Request): Promise<SessionInfoResponse> {
        const account = await getAccountFromToken(request.cookies.sessionToken);
        if (account === undefined) {
            this.setStatus(500);
            return RedisError;
        }
        return ({
            user: account.username,
        });
    }
}