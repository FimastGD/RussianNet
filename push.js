"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var readline = require("readline");
var fs_1 = require("fs");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(question, validator) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var ask = function () {
                        rl.question("\n".concat(question, " "), function (answer) {
                            if (validator) {
                                var validation = validator(answer);
                                if (validation !== true) {
                                    console.log("\n".concat(validation));
                                    return ask();
                                }
                            }
                            resolve(answer);
                        });
                    };
                    ask();
                })];
        });
    });
}
function checkGitSetup() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, repoUrl, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 7, , 8]);
                    // Проверяем инициализацию Git
                    (0, child_process_1.execSync)("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 2, , 6]);
                    (0, child_process_1.execSync)("git remote get-url origin", { stdio: "ignore" });
                    return [3 /*break*/, 6];
                case 2:
                    _a = _c.sent();
                    console.log("\n⚠️ Удалённый репозиторий не настроен");
                    url = (0, child_process_1.execSync)("gh repo view --json url --jq .url", { encoding: "utf-8" }).trim();
                    if (!url) return [3 /*break*/, 3];
                    (0, child_process_1.execSync)("git remote add origin ".concat(url), { stdio: "inherit" });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, askQuestion("Введите URL удалённого репозитория (git@github.com:user/repo.git):")];
                case 4:
                    repoUrl = _c.sent();
                    (0, child_process_1.execSync)("git remote add origin ".concat(repoUrl), { stdio: "inherit" });
                    _c.label = 5;
                case 5: return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    _b = _c.sent();
                    console.error("\n❌ Это не Git-репозиторий. Сначала выполните:");
                    console.log("git init");
                    console.log("git remote add origin URL_РЕПОЗИТОРИЯ");
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function pushChanges() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // Пытаемся сделать обычный push
                (0, child_process_1.execSync)("git push", { stdio: "inherit" });
            }
            catch (error) {
                if (error instanceof Error && error.message.includes("no upstream branch")) {
                    console.log("\n🔧 Настраиваем upstream для ветки...");
                    (0, child_process_1.execSync)("git push --set-upstream origin main", { stdio: "inherit" });
                }
                else {
                    throw error;
                }
            }
            return [2 /*return*/];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var commitName, commitDesc, prefix, prefixStr, commitMessage, confirm_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.clear();
                    console.log("=== Git Push Helper ===\n");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    return [4 /*yield*/, checkGitSetup()];
                case 2:
                    _a.sent();
                    if (!(0, fs_1.existsSync)(".gitignore")) {
                        console.log("\n📝 Создаём .gitignore...");
                        (0, child_process_1.execSync)('echo "node_modules/\n.env\n*.log\n.DS_Store" > .gitignore', { stdio: "inherit" });
                    }
                    return [4 /*yield*/, askQuestion("Введите название коммита:", function (val) { return val.trim().length > 0 || "Название не может быть пустым"; })];
                case 3:
                    commitName = _a.sent();
                    return [4 /*yield*/, askQuestion("Введите описание (необязательно):")];
                case 4:
                    commitDesc = _a.sent();
                    return [4 /*yield*/, askQuestion("Выберите префикс ([dev]/[prod]/[fix]/[none]):", function (val) { return ["dev", "prod", "fix", "none"].includes(val) || "Используйте: dev, prod, fix или none"; })];
                case 5:
                    prefix = _a.sent();
                    prefixStr = prefix !== "none" ? "[".concat(prefix, "] ") : "";
                    commitMessage = "".concat(prefixStr).concat(commitName).concat(commitDesc ? "\n\n" + commitDesc : "");
                    console.log("\n📋 Измененные файлы:");
                    (0, child_process_1.execSync)("git status --porcelain", { stdio: "inherit" });
                    return [4 /*yield*/, askQuestion("\nПодтвердить коммит? (y/n):")];
                case 6:
                    confirm_1 = _a.sent();
                    if (confirm_1.toLowerCase() !== "y") {
                        console.log("\n❌ Отменено пользователем");
                        process.exit(0);
                    }
                    console.log("\n🔄 Добавляем изменения...");
                    (0, child_process_1.execSync)("git add .", { stdio: "inherit" });
                    console.log("\n💾 Создаём коммит...");
                    (0, child_process_1.execSync)("git commit -m \"".concat(commitMessage.replace(/"/g, '\\"'), "\""), { stdio: "inherit" });
                    console.log("\n🚀 Отправляем изменения...");
                    return [4 /*yield*/, pushChanges()];
                case 7:
                    _a.sent();
                    console.log("\n✅ Успешно! Все изменения отправлены в репозиторий.");
                    return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error("\n❌ Критическая ошибка:");
                    if (error_1 instanceof Error) {
                        console.error(error_1.message);
                    }
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 9:
                    rl.close();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main();
