#!/bin/bash

# Проверяем, передан ли хотя бы один аргумент (сообщение коммита)
if [ $# -eq 0 ]; then
  echo "Ошибка: Не указано сообщение коммита."
  echo "Использование: $0 \"Сообщение коммита\" [\"Описание коммита\"]"
  exit 1
fi

# Сообщение коммита (первый аргумент)
commit_message="$1"

# Описание коммита (второй аргумент, необязательный)
commit_description="$2"

# Формируем полное сообщение коммита
if [ -n "$commit_description" ]; then
  full_message="${commit_message}\n${commit_description}"
else
  full_message="$commit_message"
fi

# Git операции
git add -A
git commit -m "$(echo -e "$full_message")"
git push origin main 

# Запускаем dev-сервер
npm run dev