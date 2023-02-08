console.time("startup");
console.timeLog("startup", "Server is now starting...");

import express from "express";
import { getEnvNumber, getEnvString } from "./util/getEnv";
import {copyFile, rm as deleteFile} from "fs";
import {join} from "path";

const app = express();
const REST_PORT = getEnvNumber("REST_PORT", 8000);
const SOCKET_PORT = getEnvNumber("SOCKET_PORT", 7979);
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

console.timeLog("startup", `Rest server is trying to listen on port: ${REST_PORT}`);
app.listen(REST_PORT, () => {
    console.timeEnd("startup")
});