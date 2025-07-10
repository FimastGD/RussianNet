// В server.ts перед всеми импортами
require('tsconfig-paths/register');
import express, { Express, Request, Response } from "express";
import next from "next";
import cors from "cors";
import apiRouter from "./routes/api";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3016", 10);

const nextApp = next({
	dev,
	customServer: true
});
const handle = nextApp.getRequestHandler();

async function startServer() {
	await nextApp.prepare();

	const expressApp: Express = express();

	// Безопасные CORS настройки
	expressApp.use(
		cors({
			origin: process.env.CORS_ORIGIN || "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true
		})
	);

	// Middleware цепочка
	expressApp.use(bodyParser.json()); // Парсинг JSON
	expressApp.use(bodyParser.urlencoded({ extended: true })); // Парсинг URL-encoded
	expressApp.use(cookieParser()); // Парсинг куков
	expressApp.use(express.json()); // Дублирующий парсер для Express

	// API роутер
	expressApp.use("/api", apiRouter);

	// Обработка Next.js
	expressApp.all(/(.*)/, (req: Request, res: Response) => {
		return handle(req, res);
	});

	// Обработчик ошибок
	expressApp.use((err: Error, req: Request, res: Response) => {
		console.error(err.stack);
		res.status(500).send("Internal Server Error");
	});

	// Запуск сервера
	expressApp.listen(port, () => {
		console.log(`> Production server running on http://localhost:${port}`);
	});
}

startServer().catch(err => {
	console.error("Server startup error:", err);
	process.exit(1);
});
