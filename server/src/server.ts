import express from "express";
import { getEnvString } from "./util/getEnv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./tsoa/routes";

const app = express();

app.use(cors({
    credentials: true,
    origin: getEnvString("CORS_ORIGINS", "localhost")?.split(" "),
}));
app.use(express.json());
app.use(cookieParser());

RegisterRoutes(app);

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ValidateError) {
        return res.status(422).send({
            message: "Validation Failed",
            details: err?.fields ?? [],
        });
    }

    if (err instanceof Error) {
        return res.status(500).send({
            message: "Internal Server Error",
        });
    }

    next();
})

export default app;