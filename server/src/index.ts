console.time("startup");
console.timeLog("startup", "Server is now starting...");

import express from "express";

const app = express();
const REST_PORT: number = parseInt(process.env.REST_PORT ?? "8000");
const SOCKET_PORT: number = parseInt(process.env.SOCKET_PORT ?? "7979");
console.timeLog("startup", `Socketio unimplemented yet, port would be: ${SOCKET_PORT}`)

console.timeLog("startup", `Rest server is trying to listen on port: ${REST_PORT}`);
app.listen(REST_PORT ?? 8000, () => {

});