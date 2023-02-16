import { Application } from "express";
import { createClient } from "redis";

declare global {
    /**
     * A RouteSubscriber is a function which is in src/routes and is called once upon start.
     * All modules in src/routes must look like either of these
     * 
     * { default: RouteSubscriber, }
     * { default: RouteSubscriber[], }
     */
    export type RouteSubscriber = (event: RouteSubscriberEvent) => void;

    /**
     * Extended express request object
     */
    namespace Express {
        // ty
        export interface Request extends Express.Request {
            /**
             * Is this client authenticated
             */
            authed: boolean,
            /**
             * Who is this client authenticated as
             */
            auth: string,
        }
    }
}