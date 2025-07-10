import { execSync } from 'child_process';
import * as readline from 'readline';
import { existsSync } from 'fs';

// Настройка интерфейса для ввода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Асинхронный вопрос с валидацией
async function askQuestion(question: string, validator?: (input: string) => string | true): Promise<string> {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(question, (answer) => {
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

// Проверка Git-репозитория
function checkGitRepo(): void {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.error('❌ Это не Git-репозиторий. Сначала запустите init-repo.sh');
    process.exit(1);
  }
}

// Получение измененных файлов (исключая node_modules)
function getChangedFiles(): string[] {
  const output = execSync('git status --porcelain', { encoding: 'utf-8' });
  return output
    .split('\n')
    .filter(line => line.trim() && !line.includes('node_modules/'))
    .map(line => line.substring(3).trim());
}

async function main() {
  checkGitRepo();

  try {
    // Проверка .gitignore
    if (!existsSync('.gitignore')) {
      console.log('⚠️ Файл .gitignore не найден. Создаю...');
      execSync('echo "node_modules/" >> .gitignore');
    }

    // Получаем данные коммита
    const commitName = await askQuestion(
      'Название коммита: ',
      (val) => val.trim().length > 0 || 'Введите название'
    );

    const commitDesc = await askQuestion('Описание (необязательно): ');

    const prefix = await askQuestion(
      'Префикс коммита ([dev]/[prod]/[fix]/пусто): ',
      (val) => !val || ['dev', 'prod', 'fix'].includes(val) || 'Используйте dev, prod, fix или оставьте пустым'
    );

    // Формируем сообщение
    const prefixStr = prefix ? `[${prefix}] ` : '';
    const fullMessage = `${prefixStr}${commitName}${commitDesc ? '\n\n' + commitDesc : ''}`;

    // Проверяем изменения
    const changedFiles = getChangedFiles();
    if (changedFiles.length === 0) {
      console.log('ℹ️ Нет измененных файлов для коммита.');
      process.exit(0);
    }

    // Показываем изменения
    console.log('\nИзмененные файлы:');
    changedFiles.forEach(file => console.log(`- ${file}`));

    // Подтверждение
    const confirm = await askQuestion('\nПодтвердить коммит? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ Отменено пользователем');
      process.exit(0);
    }

    // Выполняем коммит и пуш
    console.log('\n🔄 Добавляем изменения...');
    execSync('git add .', { stdio: 'inherit' });

    console.log('💾 Создаем коммит...');
    execSync(`git commit -m "${fullMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

    console.log('🚀 Отправляем изменения...');
    execSync('git push', { stdio: 'inherit' });

    console.log('\n✅ Успешно обновлено!');
  } catch (error) {
    console.error('❌ Ошибка:');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();