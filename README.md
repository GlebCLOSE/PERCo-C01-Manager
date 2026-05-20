# C01 Manager

Мобильное приложение для управления контроллером PERCo C01 через открытый API.

**Основные возможности:**

1. Подключение к контроллеру C01 по WebSocket.
2. Отправка базовых команд контроллеру.
3. Настройка сетевых параметров контроллера.
4. Получение событий от контроллера.

---

## Требования

- **Node.js** — рекомендуется LTS (например, 20.x или новее).
- **npm** — зависимости фиксируются в `package-lock.json`.
- Для запуска на устройстве:
  - **Android** — Android Studio / эмулятор или физическое устройство с [Expo Go](https://expo.dev/go) либо собранная dev-сборка;
  - **iOS** — только на **macOS** (Xcode, симулятор или устройство с Expo Go / dev-сборкой).

---

## Установка

1. Клонируйте репозиторий и перейдите в каталог проекта:

   ```bash
   git clone https://github.com/GlebCLOSE/PERCo-C01-Manager.git
   cd PERCo-C01-Manager
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

---

## Запуск

Из корня проекта:

| Команда | Описание |
|--------|----------|
| `npm start` | Запускает Metro и [Expo Dev Server](https://docs.expo.dev/get-started/start-developing/) на порту **8082** (аналог `expo start --port 8082`). |
| `npm run android` | Запуск с таргетом Android (`expo start --android`). |
| `npm run ios` | Запуск с таргетом iOS (`expo start --ios`, только на macOS). |
| `npm run web` | Веб-режим (`expo start --web`). |

После `npm start` в терминале появится QR-код и меню: можно открыть приложение в **Expo Go** на телефоне (камера / приложение Expo) или выбрать платформу в меню.

При конфликте порта или после обновлений кэш Metro можно очистить так:

```bash
npx expo start --port 8082 --clear
```

---

## Разработка

Проект на **Expo SDK 54**, **React Native** и **expo-router**. Точка входа: `expo-router/entry` (см. `package.json`).

---

## Лицензия

См. поле `license` в `package.json`.
