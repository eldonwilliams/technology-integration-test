import { sign } from "jsonwebtoken";
import { JWT_KEY } from "../util/authMiddleware";

let authenticationManagement: RouteSubscriber = ({ express, }) => {
    express.post("/signup", (req, res) => {
        if (req.authed) return res.status(400).send("You already are logged in. Please log out first.");
        const username = req.body.username;
        if (typeof username !== "string") return res.status(400).send("Please include a username.");
        sign({ user: username, }, JWT_KEY)
    });
}

export default [
    authenticationManagement,
];