import { execSync } from "child_process";
import * as readline from "readline";
import { existsSync } from "fs";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function askQuestion(question: string, validator?: (input: string) => string | true): Promise<string> {
	return new Promise(resolve => {
		const ask = () => {
			rl.question(`\n${question} `, answer => {
				if (validator) {
					const validation = validator(answer);
					if (validation !== true) {
						console.log(`\n${validation}`);
						return ask();
					}
				}
				resolve(answer);
			});
		};
		ask();
	});
}

async function checkGitSetup() {
	try {
		// Проверяем инициализацию Git
		execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });

		// Проверяем наличие origin
		try {
			execSync("git remote get-url origin", { stdio: "ignore" });
		} catch {
			console.log("\n⚠️ Удалённый репозиторий не настроен");
			const url = execSync("gh repo view --json url --jq .url", { encoding: "utf-8" }).trim();
			if (url) {
				execSync(`git remote add origin ${url}`, { stdio: "inherit" });
			} else {
				const repoUrl = await askQuestion("Введите URL удалённого репозитория (git@github.com:user/repo.git):");
				execSync(`git remote add origin ${repoUrl}`, { stdio: "inherit" });
			}
		}
	} catch {
		console.error("\n❌ Это не Git-репозиторий. Сначала выполните:");
		console.log("git init");
		console.log("git remote add origin URL_РЕПОЗИТОРИЯ");
		process.exit(1);
	}
}

async function pushChanges() {
	try {
		// Пытаемся сделать обычный push
		execSync("git push --set-upstream origin main", { stdio: "inherit" });
	} catch (error) {
		if (error instanceof Error && error.message.includes("no upstream branch")) {
			console.log("\n🔧 Настраиваем upstream для ветки...");
			execSync("git push --set-upstream origin main", { stdio: "inherit" });
		} else {
			throw error;
		}
	}
}

async function main() {
	console.clear();
	console.log("=== Git Push Helper ===\n");

	try {
		await checkGitSetup();

		if (!existsSync(".gitignore")) {
			console.log("\n📝 Создаём .gitignore...");
			execSync('echo "node_modules/\n.env\n*.log\n.DS_Store" > .gitignore', { stdio: "inherit" });
		}

		const commitName = await askQuestion("Введите название коммита:", val => val.trim().length > 0 || "Название не может быть пустым");

		const commitDesc = await askQuestion("Введите описание (необязательно):");
		const prefix = await askQuestion(
			"Выберите префикс ([dev]/[prod]/[fix]/[none]):",
			val => ["dev", "prod", "fix", "none"].includes(val) || "Используйте: dev, prod, fix или none"
		);

		const prefixStr = prefix !== "none" ? `[${prefix}] ` : "";
		const commitMessage = `${prefixStr}${commitName}${commitDesc ? "\n\n" + commitDesc : ""}`;

		console.log("\n📋 Измененные файлы:");
		execSync("git status --porcelain", { stdio: "inherit" });

		const confirm = await askQuestion("\nПодтвердить коммит? (y/n):");
		if (confirm.toLowerCase() !== "y") {
			console.log("\n❌ Отменено пользователем");
			process.exit(0);
		}

		console.log("\n🔄 Добавляем изменения...");
		execSync("git add .", { stdio: "inherit" });

		console.log("\n💾 Создаём коммит...");
		execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: "inherit" });

		console.log("\n🚀 Отправляем изменения...");
		await pushChanges();

		console.log("\n✅ Успешно! Все изменения отправлены в репозиторий.");
	} catch (error) {
		console.error("\n❌ Критическая ошибка:");
		if (error instanceof Error) {
			console.error(error.message);
		}
		process.exit(1);
	} finally {
		rl.close();
	}
}

main();
