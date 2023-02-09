import { Application } from "express";

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
}

/**
 * A RouteSubscriber is a function which is in src/routes and is called once upon start.
 * All modules in src/routes must look like either of these
 * 
 * { default: RouteSubscriber, }
 * { default: RouteSubscriber[], }
 */
export type RouteSubscriber = (event: RouteSubscriberEvent) => void;