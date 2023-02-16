import * as express from "express";
import { Controller, Get, Request, Route, Security, Tags, } from "tsoa";
import { GetStatusResponse } from "../services/statusService";

@Route("/status")
export class StatusController extends Controller {
    @Security('sessionToken', ["optional?"])
    @Get()
    @Tags("Status")
    public async get(@Request() request: express.Request): Promise<GetStatusResponse> {
        return {
            okay: true,
            authenticated: !!request.authed,
        }
    }
}