import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/data", (req, res) => {
	res.status(200).json({ message: "API is working" });
});

apiRouter.get("/firstLoad", (req, res) => {
	if (req.cookies.firstLoad) {
		res.status(200).json({ firstLoad: false });
	} else {
		res.cookie("firstLoad", "true", {
			maxAge: 2 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "lax"
		});
		res.status(200).json({ firstLoad: true });
	}
});

apiRouter.get("/forceUnload", (req, res) => {
	if (req.cookies.firstLoad) {
		res.clearCookie("firstLoad");
		res.status(200).json({ status: true });
	} else {
		res.status(200).json({ status: false });
	}
});

export default apiRouter;
