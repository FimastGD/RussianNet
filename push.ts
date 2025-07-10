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
			rl.question(question, answer => {
				if (validator) {
					const validation = validator(answer);
					if (validation !== true) {
						console.log(validation);
						return ask();
					}
				}
				resolve(answer);
			});
		};
		ask();
	});
}

function checkGitRepo(): void {
	try {
		execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
	} catch {
		console.error("❌ Это не Git-репозиторий. Сначала запустите init-repo.sh");
		process.exit(1);
	}
}

function getChangedFiles(): string[] {
	const output = execSync("git status --porcelain", { encoding: "utf-8" });
	return output
		.split("\n")
		.filter(line => line.trim() && !line.includes("node_modules/"))
		.map(line => line.substring(3).trim());
}

async function main() {
	checkGitRepo();

	try {
		if (!existsSync(".gitignore")) {
			console.log("⚠️ Файл .gitignore не найден. Создаю...");
			execSync('echo "node_modules/" >> .gitignore');
		}

		const commitName = await askQuestion("Название коммита: ", val => val.trim().length > 0 || "Введите название");

		const commitDesc = await askQuestion("Описание (необязательно): ");

		const prefix = await askQuestion(
			"Префикс коммита ([dev]/[prod]/[fix]/пусто): ",
			val => !val || ["dev", "prod", "fix"].includes(val) || "Используйте dev, prod, fix или оставьте пустым"
		);

		const prefixStr = prefix ? `[${prefix}] ` : "";
		const fullMessage = `${prefixStr}${commitName}${commitDesc ? "\n\n" + commitDesc : ""}`;

		const changedFiles = getChangedFiles();
		if (changedFiles.length === 0) {
			console.log("ℹ️ Нет измененных файлов для коммита.");
			process.exit(0);
		}

		console.log("\nИзмененные файлы:");
		changedFiles.forEach(file => console.log(`- ${file}`));

		const confirm = await askQuestion("\nПодтвердить коммит? (y/n): ");
		if (confirm.toLowerCase() !== "y") {
			console.log("❌ Отменено пользователем");
			process.exit(0);
		}

		console.log("\n🔄 Добавляем изменения...");
		execSync("git add .", { stdio: "inherit" });

		console.log("💾 Создаем коммит...");
		execSync(`git commit -m "${fullMessage.replace(/"/g, '\\"')}"`, { stdio: "inherit" });

		console.log("🚀 Отправляем изменения...");
		try {
			execSync("git push", { stdio: "inherit" });
		} catch (pushError) {
			if (pushError instanceof Error && pushError.message.includes("no upstream branch")) {
				console.log("⏳ Настраиваем upstream для ветки...");
				try {
					execSync("git push --set-upstream origin main", { stdio: "inherit" });
				} catch (upstreamError) {
					console.error("❌ Ошибка при настройке upstream:");
					if (upstreamError instanceof Error) {
						console.error(upstreamError.message);
					}
					process.exit(1);
				}
			} else {
				throw pushError;
			}
		}

		console.log("\n✅ Успешно обновлено!");
	} catch (error) {
		console.error("❌ Ошибка:");
		if (error instanceof Error) {
			console.error(error.message);
		}
		process.exit(1);
	} finally {
		rl.close();
	}
}

main();
