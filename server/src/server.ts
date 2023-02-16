import express from "express";
import { getEnvString } from "./util/getEnv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    credentials: true,
    origin: getEnvString("CORS_ORIGINS", "localhost")?.split(" "),
}));
app.use(express.json());
app.use(cookieParser());

export default app;