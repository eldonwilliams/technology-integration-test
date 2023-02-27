import { getEnvNumber } from "./util/getEnv";
import app from "./server";

const REST_PORT = getEnvNumber("REST_PORT", 8000) as number;
const SOCKET_PORT = getEnvNumber("SOCKET_PORT", 7979) as number;

app.listen(REST_PORT, () => {
    console.log(`Ready on port: ${REST_PORT}`);
});