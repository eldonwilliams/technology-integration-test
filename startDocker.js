/**
 * The list of keys from config.jsonc to include in env
 */
const ENVIRONMENT_WHITELIST = [ "API_URL", "OPEN_API_SPEC", "CORS_ORIGINS", "REST_PORT", "SOCKET_PORT", ]

/**
 * The output when help is requested
 */
const HELP_TEXT = `
    Farm IDLE | startDocker.js Help Documentation
    Command Line Options.
    --test -t | Run docker in test mode
    --help -h | Get this screen, excludes all other options
`;

const { spawn } = require('child_process');
const { readFileSync } = require('fs');
const { jsonc } = require('jsonc');

const testMode = process.argv.filter((v) => v == "--test" || v == "-t").length > 0;
const helpMode = process.argv.filter((v) => v == "--help" || v == "-h").length > 0;

if (process.argv.length > 2 && !testMode && !helpMode) {
    console.log("That option is not valid...");
}

// Help
if (helpMode) {
    console.log(HELP_TEXT);
    process.exit(0);
}
//

const configRaw = readFileSync("./config.jsonc").toString("utf-8");
const config = jsonc.parse(configRaw);

let testEnvironment = {
    BACKEND_TARGET: "test",
}

let environment = { ...process.env, ...config, ...(testMode ? testEnvironment : {}) };

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
        return console.log("[StartDocker.JS] Interrupt Ignored Until Docker Stops...");
});