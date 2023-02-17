import { Controller, Get, Middlewares, Post, Request, Response, Route, Security, Tags } from "tsoa";
import { LoggedInErrResponse, loggedInMiddleware, LoggedOutErrResponse, loggedOutMiddleware } from "../util/authMiddleware";
import express from "express";
import cookieParser from "cookie-parser";
import { SessionInfo, SessionInfoResponse } from "../services/authenticationService";

@Route("/authentication")
export class AuthenticationController extends Controller {
    /**
     * Allows a client to login provided a username and password, required they are not currently logged in
     */
    @Tags("Authentication", "Account")
    @Security("sessionToken")
    @Post("/login")
    @Response<LoggedInErrResponse>(403)
    @Middlewares(loggedOutMiddleware)
    public async login() {

    }

    /**
     * Logs the client out using clear cookie, returning an error if no sessionToken exists.
     */
    @Tags("Authentication", "Account")
    @Security("sessionToken")
    @Get("/logout")
    @Response<LoggedInErrResponse>(403)
    @Middlewares(loggedOutMiddleware)
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
    @Middlewares(loggedInMiddleware)
    public async getSessionInfo(@Request() request: express.Request): Promise<SessionInfoResponse> {
        
    }
}