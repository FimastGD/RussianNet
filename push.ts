import { exec } from "child_process";
import { promisify } from "util";
import ColorSide, { ANSI } from "colorside";
import { ANSI256 } from "colorside/ansi256";

const cs = new ColorSide("en");
cs.use(cs.console);
cs.use(cs.input);

const execAsync = promisify(exec);

cs.console.clear();

const COMMIT_NAME_ONLY: unknown = (await cs.input.readtext({
	message: "Enter commit name:",
	messageColor: ANSI.format.bold + ANSI.fg.bright.cyan,
	prefix: cs.fg.bright.blue(">"),
	answerColor: ANSI.fg.white
})) as string;

const COMMIT_PREFIX: unknown = (await cs.input.readlist({
	message: "Enter commit prefix:",
	answerColor: ANSI.fg.bright.white,
	prefix: cs.fg.bright.blue(">"),
	messageColor: ANSI.format.bold + ANSI.fg.bright.cyan,
	choices: [
		{ name: "[dev]", value: "[dev]" },
		{ name: "[prod]", value: "[prod]" },
		{ name: "[fix]", value: "[fix]" },
		{ name: "[test]", value: "[test]" },
		{ name: "Without prefix", value: "no" }
	],
	selectColors: [{ keys: ["Without prefix"], color: ANSI256.get.fg("#ff7878") }]
})) as string;

const COMMIT_NAME: string = String(COMMIT_PREFIX !== "no" ? COMMIT_PREFIX : "") + " " + String(COMMIT_NAME_ONLY);
// Константы для коммита
// const COMMIT_NAME = "Fix user authentication bug";
/*const COMMIT_DESC: string | null = `- Fixed login validation logic
- Added proper error handling for invalid credentials
- Updated user session management
- Added unit tests for auth service`;*/
const COMMIT_DESC: string | null = null;

// Альтернативный пример с null описанием
// const COMMIT_NAME = "Update README";
// const COMMIT_DESC: string | null = null;

interface GitPushResult {
	success: boolean;
	message: string;
	stdout?: string;
	stderr?: string;
}

class GitAutoPush {
	private projectPath: string;
	private branch: string;

	constructor(projectPath: string = process.cwd(), branch: string = "main") {
		this.projectPath = projectPath;
		this.branch = branch;
	}

	/**
	 * Выполняет команду git в указанной директории
	 */
	private async executeGitCommand(command: string): Promise<{ stdout: string; stderr: string }> {
		try {
			const { stdout, stderr } = await execAsync(command, {
				cwd: this.projectPath,
				maxBuffer: 1024 * 1024 // 1MB buffer
			});
			return { stdout, stderr };
		} catch (error: any) {
			throw new Error(`Git command failed: ${error.message}`);
		}
	}

	/**
	 * Формирует commit message с описанием или без
	 */
	private buildCommitMessage(title: string, description: string | null): string {
		if (description) {
			// Экранируем кавычки в описании
			const escapedDesc = description.replace(/"/g, '\\"');
			return `"${title}" -m "${escapedDesc}"`;
		}
		return `"${title}"`;
	}

	/**
	 * Проверяет статус репозитория
	 */
	async checkStatus(): Promise<string> {
		const { stdout } = await this.executeGitCommand("git status --porcelain");
		return stdout.trim();
	}

	/**
	 * Добавляет все изменения в staging
	 */
	async addChanges(): Promise<void> {
		await this.executeGitCommand("git add -A");
		console.log("✓ Changes added to staging");
	}

	/**
	 * Создает коммит
	 */
	async createCommit(title: string, description: string | null): Promise<void> {
		const commitMessage = this.buildCommitMessage(title, description);
		const command = `git commit -m ${commitMessage}`;

		await this.executeGitCommand(command);
		console.log(`✓ Commit created: ${title}`);
	}

	/**
	 * Пушит изменения в remote репозиторий
	 */
	async pushToRemote(): Promise<void> {
		const command = `git push origin ${this.branch}`;
		const { stdout, stderr } = await this.executeGitCommand(command);

		if (stderr && !stderr.includes("up-to-date")) {
			console.log("Push output:", stderr);
		}
		console.log("✓ Changes pushed to remote repository");
	}

	/**
	 * Основная функция для автоматического пуша
	 */
	async autoPush(commitName: string, commitDesc: string | null): Promise<GitPushResult> {
		try {
			console.log("🚀 Starting auto push process...");

			// Проверяем есть ли изменения
			const status = await this.checkStatus();
			if (!status) {
				return {
					success: false,
					message: "No changes detected to commit"
				};
			}

			console.log("📝 Changes detected:");
			console.log(status);

			// Добавляем все изменения
			await this.addChanges();

			// Создаем коммит
			await this.createCommit(commitName, commitDesc);

			// Пушим в remote
			await this.pushToRemote();

			return {
				success: true,
				message: "Successfully pushed changes to remote repository"
			};
		} catch (error: any) {
			return {
				success: false,
				message: `Error during git operations: ${error.message}`,
				stderr: error.message
			};
		}
	}

	/**
	 * Показывает последние коммиты
	 */
	async showRecentCommits(count: number = 5): Promise<void> {
		try {
			const { stdout } = await this.executeGitCommand(`git log --oneline -${count}`);
			console.log("\n📋 Recent commits:");
			console.log(stdout);
		} catch (error) {
			console.error("Error showing commits:", error);
		}
	}
}

// Использование
async function main() {
	const gitPush = new GitAutoPush("/path/to/your/project", "main");

	try {
		// Выполняем автоматический пуш
		const result = await gitPush.autoPush(COMMIT_NAME, COMMIT_DESC);

		if (result.success) {
			console.log("✅", result.message);

			// Показываем последние коммиты
			await gitPush.showRecentCommits();
		} else {
			console.error("❌", result.message);
		}
	} catch (error) {
		console.error("💥 Unexpected error:", error);
	}
}

// Экспорт для использования как модуль
export { GitAutoPush, COMMIT_NAME, COMMIT_DESC };

// Запуск если файл выполняется напрямую
if (require.main === module) {
	main();
}
