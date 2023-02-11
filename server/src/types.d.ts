import { Application } from "express";
import { createClient } from "redis";

declare global {
    /**
     * This is the event information passed to the RouteSubscriber function when called on startup.
     */
    export interface RouteSubscriberEvent {
        /**
         * The express server object as created in index
         */
        express: Application,
        /**
         * The port express is connected to and should be in process.env
         */
        REST_PORT: number,
        /**
         * The port socket.io is connected to and should be in process.env
         */
        SOCKET_PORT: number,
        /**
         * The redis client object
         */
        redis: ReturnType<typeof createClient>,
        /**
         * The REDIS_URL environment variable
         */
        REDIS_URL: string,
    }

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
        export interface Request extends Request {
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