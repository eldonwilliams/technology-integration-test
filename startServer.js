/**
 * The list of keys from config.jsonc to include in env
 */
const ENVIRONMENT_WHITELIST = [ "API_URL", "OPEN_API_SPEC", "CORS_ORIGINS", "REST_PORT", "SOCKET_PORT", ]

import { spawn } from "child_process";
import { readFileSync } from "fs";
import JSONC from "jsonc-simple-parser";

const configRaw = readFileSync("./config.jsonc").toString("utf-8");
const config = JSONC.parse(configRaw);

let environment = { ...process.env, ...config, };

Object.keys(config).forEach(key => {
    if (!ENVIRONMENT_WHITELIST.includes(key))
        delete environment[key];
});

const dockerProcess = spawn("docker", ["compose", "up", "--build"], {
    env: environment,
    stdio: "inherit",
});

process.on('SIGINT', () => {
    if (dockerProcess.exitCode === null)
        return console.log("[StartServer.JS] Interrupt Ignored Until Docker Stops...");
});