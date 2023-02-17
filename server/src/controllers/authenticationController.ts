import { Controller, Get, Middlewares, Post, Response, Route, Security, Tags } from "tsoa";
import { LoggedInErrResponse, loggedInMiddleware, LoggedOutErrResponse, loggedOutMiddleware } from "../util/authMiddleware";

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
    public async logout() {

    }

    /**
     * Gets information about the current session, returning a unauthorized response if no session exists.
     */
    @Tags("Authentication")
    @Security("sessionToken")
    @Get("/session")
    @Response<LoggedOutErrResponse>(401)
    @Middlewares(loggedInMiddleware)
    public async getSessionInfo() {

    }
}