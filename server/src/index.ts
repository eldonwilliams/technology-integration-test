console.time("startup");
console.timeLog("startup", "Server is now starting...");

import express from "express";
import { getEnvNumber } from "./util/getEnv";

const app = express();
const REST_PORT = getEnvNumber("REST_PORT", 8000);
const SOCKET_PORT = getEnvNumber("SOCKET_PORT", 7979);
console.timeLog("startup", `Socketio unimplemented yet, port would be: ${SOCKET_PORT}`)

console.timeLog("startup", `Rest server is trying to listen on port: ${REST_PORT}`);
app.listen(REST_PORT, () => {
    console.timeEnd("startup")
});