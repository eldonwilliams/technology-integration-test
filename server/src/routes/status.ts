let statusHandler: RouteSubscriber = ({ express, }) => {
    express.get("/status", (req, res) => {
        res.status(200).cookie("auth", "true").send({
            okay: true,
            authenticated: req.cookies.auth === "true"
        });
    });
}

export default statusHandler;