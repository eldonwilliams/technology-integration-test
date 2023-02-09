console.time("startup");
console.timeLog("startup", "Server is now starting...");

import express from "express";
import { getEnvNumber, getEnvString } from "./util/getEnv";
import { copyFile, rm as deleteFile } from "fs";
import { join } from "path";
import glob from "glob";
import { RouteSubscriber, RouteSubscriberEvent } from "./route";

const app = express();
const REST_PORT = getEnvNumber("REST_PORT", 8000) as number;
const SOCKET_PORT = getEnvNumber("SOCKET_PORT", 7979) as number;
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
    REST_PORT: REST_PORT,
    SOCKET_PORT: SOCKET_PORT,
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

console.timeLog("startup", `Rest server is trying to listen on port: ${REST_PORT}`);
app.listen(REST_PORT, () => {
    console.timeEnd("startup")
});