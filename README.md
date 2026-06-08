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
| `npm run android:prebuild` | Генерирует каталог [`android/`](https://docs.expo.dev/workflow/prebuild/). |
| `npm run android:assembleRelease` | Локально собирает **release APK** с вшитым бандлом (после prebuild см. Gradle). |

После `npm start` в терминале появится QR-код и меню: можно открыть приложение в **Expo Go** на телефоне (камера / приложение Expo) или выбрать платформу в меню.

При конфликте порта или после обновлений кэш Metro можно очистить так:

```bash
npx expo start --port 8082 --clear
```

---

## Разработка

Проект на **Expo SDK 54**, **React Native** и **expo-router**. Точка входа: `expo-router/entry` (см. `package.json`).

---

## Сборка Android (APK и AAB, EAS Build)

Облачная сборка через [EAS Build](https://docs.expo.dev/build/introduction/).

**Один раз:** установите [EAS CLI](https://docs.expo.dev/build/setup/), войдите в аккаунт Expo и свяжите проект:

```bash
npm i -g eas-cli
eas login
eas init
```

При необходимости обновите `android.package` в [`app.json`](app.json) и `ios.bundleIdentifier` под вашу организацию (сейчас задан префикс `ru.perco.c01manager`).

| Артефакт | Профиль EAS | Команда |
|----------|-------------|---------|
| **APK** (ручная установка, внутренние тесты без Play) | `apk` или `preview` | `npm run eas:build:android:apk` |
| **AAB** (загрузка в Google Play) | `production` | `npm run eas:build:android:aab` |

Профили в [`eas.json`](eas.json): `apk` наследует `preview` (`android.buildType: "apk"`), `production` — `app-bundle`.

Загрузка AAB в консоль: [EAS Submit](https://docs.expo.dev/submit/introduction/) (`eas submit --platform android` после успешной сборки).

### Локальная сборка APK без EAS (офлайн / без аккаунта Expo)

Нужны **JDK 17+** (`JAVA_HOME`) и **Android SDK** (`ANDROID_HOME`, например `C:\Users\<вы>\AppData\Local\Android\Sdk` или отдельно установленный `C:\Android\Sdk` с `platform-tools`, `platforms;android-*`, `build-tools`, при необходимости NDK подтянет Gradle).

**Важно:** если репозиторий лежит в пути с **кириллицей**, Node при резолве пакетов отдаёт реальный путь на диске, и **Gradle не находит** `node_modules` (`includeBuild` для `@react-native/gradle-plugin`). Надёжный обход — **полная копия проекта в каталог только с ASCII** (без копирования старого `node_modules`), затем чистая установка зависимостей:

```powershell
# пример: C:\dev\C01Manager — копия исходников (robocopy / git clone), без node_modules
cd C:\dev\C01Manager
npm install
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "C:\Android\Sdk"
npx expo prebuild --platform android --clean
cd android
# Debug ниже — только с Metro или отдельно соберите release (см. ниже).
.\gradlew.bat assembleDebug
```

Готовый **debug**-APK: `android\app\build\outputs\apk\debug\app-debug.apk`.

#### Сообщение «Unable to load script» на устройстве

**Причина:** `assembleDebug` **не упаковывает** JS в APK. Приложение ожидает **Metro** (как в разработке). Чтобы файл APK открывался **без компьютера**, нужна **release**-сборка (бандл вшивается при `assembleRelease`). Либо оставаться на debug и **запускать Metro** как ниже.

**Вариант A — оставить debug APK и включить Metro**

1. На ПК из корня проекта: `npm start` (у вас Metro на порту **8082** по [`package.json`](package.json)).
2. Телефон по **USB** с включённой отладкой; на ПК:
   - многие шаблоны React Native по умолчанию стучатся на порт устройства **8081**. Тогда переадресуйте его на ваш Metro на **8082**:
     ```powershell
     adb reverse tcp:8081 tcp:8082
     ```
     либо запустите бандлер на стандартном порту:
     ```bash
     npx expo start --port 8081
     ```
     и выполните `adb reverse tcp:8081 tcp:8081`.
3. Если без USB — один Wi‑Fi и в меню разработчика React Native указать хост/IP ПК и порт Metro (как в сообщении об ошибке).

**Вариант B — release APK без Metro (вшитый бандл)**

В шаблоне Expo SDK 54 для `release` уже задан `signingConfig signingConfigs.debug` (подпись **debug-keystore** тем же ключом, что и debug-сборки). Такой APK удобно ставить себе или тестировщикам без Metro; **для загрузки в Google Play нужен свой upload-keystore**, см. [локальный production-билд](https://docs.expo.dev/guides/local-app-production/) и блок про `MYAPP_UPLOAD_*`.

После `expo prebuild` (или один раз **`npm run android:assembleRelease`**, см. ниже):

```powershell
cd C:\dev\C01Manager\android   # см. ограничение по пути ниже
.\gradlew.bat assembleRelease   # Unix/macOS: ./gradlew assembleRelease
```

Из корня репозитория (Cross-platform после появления `android/` или автоматический prebuild, если каталога ещё нет):

```bash
npm run android:assembleRelease
```

Артефакт по умолчанию: **`android/app/build/outputs/apk/release/app-release.apk`**.

Подпись **upload** через `gradle.properties` и свой `.keystore`: пошагово в [официальной инструкции Expo](https://docs.expo.dev/guides/local-app-production/#android).

Через **EAS** (профиль `preview` в [`eas.json`](eas.json)) бандл тоже собирается внутри облачной сборки — удобно, если локальный release-сетап не хотите поднимать.

Отдельно: только **junction** на ASCII-путь помогает для `expo prebuild`, но для **Gradle** часто всё равно нужна **копия проекта + `npm install` на ASCII-пути**, иначе `require.resolve` остаётся на исходной букве диска с кириллицей в пути.

Папка `android/` при необходимости генерируется prebuild и по умолчанию указана в `.gitignore`. Локальные копии APK можно складывать в `build-outputs/` (каталог в `.gitignore`).

### Если сборка (EAS или Gradle) не стартует

1. **EAS:** без входа сборка не идёт — выполните `eas login` (или задайте `EXPO_TOKEN` для CI).
2. **`expo prebuild` с ошибкой MainApplication** — см. пути с не-ASCII выше и раздел «Локальная сборка APK без EAS».

---

## Лицензия

См. поле `license` в `package.json`.
