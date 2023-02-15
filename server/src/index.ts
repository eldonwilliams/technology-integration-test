console.time("startup");
console.timeLog("startup", "Server is now starting...");

import express from "express";
import { getEnvNumber, getEnvString } from "./util/getEnv";
import { copyFile, rm as deleteFile, writeFile } from "fs";
import { join } from "path";
import glob from "glob";
import cookieParser from "cookie-parser";
import authMiddleware from "./util/authMiddleware";
import { createClient as createRedisClient } from "redis";
import cors from "cors";
import swaggerjsdoc from "swagger-jsdoc";

const app = express();

app.use(cors({
    credentials: true,
    origin: getEnvString("CORS_ORIGINS", "localhost")?.split(" "),
}));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

const REST_PORT = getEnvNumber("REST_PORT", 8000) as number;
const SOCKET_PORT = getEnvNumber("SOCKET_PORT", 7979) as number;
const REDIS_URL = getEnvString("REDIS_URL", "redis://redis:6379") as string;

const redisClient = createRedisClient({ url: REDIS_URL, });
redisClient.connect().catch((reason) => console.error(reason))

console.timeLog("startup", `Socketio unimplemented yet, port would be: ${SOCKET_PORT}`)

let shouldGen = getEnvString("GEN_TEST_REPORTS", "true")?.toLowerCase() === "true";
if (shouldGen) {
    let reportSrc = join(__dirname, "../jest.report.txt")
    let reportDest = join(__dirname, "../jest-reports/jest.report.txt")
    console.log("GEN_TEST_REPORTS was true")
    copyFile(reportSrc, reportDest, (err) => {
        if (err) return console.log(`${err} <- Something went wrong whilst saving`);
        deleteFile(reportSrc, ()=>{});
    });
}

const EventObject: RouteSubscriberEvent = {
    express: app,
    redis: redisClient,
    REST_PORT: REST_PORT,
    SOCKET_PORT: SOCKET_PORT,
    REDIS_URL: REDIS_URL,
}
const routesMatcher = "**/dist/routes/*.+(js|ts)";
glob(routesMatcher, (err, matches) => {
    if (err) return console.timeLog("startup", `${err}\nFailed to find any files using the '${routesMatcher}' matcher.`);
    console.log(`Found ${matches.length} routeFiles to add.\n`);
    
    matches.forEach((routeFile) => {
        let route = require("../" + routeFile).default;
        if (typeof route == "function") {
            (route as RouteSubscriber)(EventObject);
        } else if (route instanceof Array) {
            route.forEach(handle => handle(EventObject));
        } else {
            console.warn(`  - Route '${routeFile}' exported neither a func nor Array.`);
        }
    });

    console.log(`\nDone.\n`);
})

const swaggerSpec = JSON.stringify(swaggerjsdoc({
    apis: ["/dist/routes/*.js"],
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Farm IDLE – Backend API',
            version: '1.0.0',
            contact: {
                name: "Eldon W.",
                url: "https://github.com/eldonwilliams/",
            },
        },
    },
}));

app.get('/oa-spec.json', (req, res) => {
    res.send(swaggerSpec);
});

console.timeLog("startup", `Rest server is trying to listen on port: ${REST_PORT}`);
app.listen(REST_PORT, () => {
    console.timeEnd("startup")
});