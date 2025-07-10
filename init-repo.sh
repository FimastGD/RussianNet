#!/bin/bash

# Установка идентификации пользователя (если ещё не настроено)
if [ -z "$(git config --global user.email)" ] || [ -z "$(git config --global user.name)" ]; then
    echo "⚠️ Настройка идентификации Git"
    git config --global user.email "daniil.port135@gmail.com"
    git config --global user.name "FimastGD"
fi

# Инициализация репозитория
if [ ! -d .git ]; then
    echo "🔄 Инициализация Git-репозитория..."
    git init
fi

# Обход ошибки dubious ownership
git config --global --add safe.directory $(pwd)

# Создание .gitignore (если отсутствует)
if [ ! -f .gitignore ]; then
    echo "📝 Создание .gitignore..."
    cat > .gitignore <<EOL
node_modules/
.env
*.log
.DS_Store
EOL
fi

# Проверка/создание удалённого репозитория
if ! git remote | grep -q "origin"; then
    echo "🔗 Привязка к удалённому репозиторию..."
    if command -v gh &> /dev/null; then
        gh repo create $(basename $(pwd)) --public --source=. --remote=origin
    else
        echo "❌ GitHub CLI не установлен"
        echo "Вручную создайте репозиторий на GitHub и выполните:"
        echo "git remote add origin URL_ВАШЕГО_РЕПОЗИТОРИЯ"
    fi
fi

# Первый коммит
if [ -z "$(git log --oneline -n 1 2>/dev/null)" ]; then
    echo "💾 Создание первого коммита..."
    git add .
    git commit -m "Initial commit"
    git branch -M main 2>/dev/null || true
fi

echo "✅ Репозиторий готов! Текущая ветка: $(git branch --show-current)"