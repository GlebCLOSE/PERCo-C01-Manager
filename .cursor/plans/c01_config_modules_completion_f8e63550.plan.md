---
name: C01 config modules completion
overview: "Унифицировать и довести до полного цикла (get→display→set→ack/error) все экраны `app/controller/config/*` и связанные модальные окна `components/modal-content/*` для контроллера C01, включая `cross` (внутренние реакции). Итог: в каждом модуле корректное получение/отображение конфигурации и отправка с обязательной модалкой результата."
todos:
  - id: inventory-gap-matrix
    content: Зафиксировать матрицу готовности по модулям (fetch/render/send/ack+modal) и выбрать эталон UX на основе `PadDetails`.
    status: pending
  - id: hook-complete-config-apis
    content: "Доработать `useControllerConfig`: добавить `setReaderConfig` и `setCrossConfig`, усилить `sendSetCommand` (split склеенных JSON), сохранить единый контракт возврата."
    status: pending
  - id: ui-modal-ack-unify
    content: "Привести `ExdevDetails`, `ReaderDetails`, network-модалки к единому паттерну: try/catch + проверка `answer.<type>` + `ModalText`."
    status: pending
  - id: screens-error-handling
    content: На экранах списков и network добавить пользовательскую обработку ошибок получения/отправки (ErrorModal), убрать заглушки кнопок.
    status: pending
  - id: cross-full-cycle
    content: "Реализовать `cross`: экран списка + модалка деталей/редактирования + отправка `setCrossConfig` + модалка результата."
    status: pending
isProject: false
---

## Цель и критерии готовности
- **Единый критерий “модуль реализован”**: на экране/в модалке есть
  - **получение** данных из контроллера (`get`) и **корректный рендер**
  - **отправка** изменений (`set`)
  - **обработка ack/error** с **пользовательским модальным ответом** (успех/ошибка) — как в `PadDetails`.

## Текущая инвентаризация (что есть сейчас)
- **Транспорт и ack/timeout на уровне хука уже есть** в `[d:/проекты/new/PERCo-C01-Manager/hooks/useControllerConfig.ts](d:/проекты/new/PERCo-C01-Manager/hooks/useControllerConfig.ts)`:
  - `getInfo(type,'all'|number)` → `getDataFromController(...)` (умеет split склеенных JSON и collectAll по “тишине 500мс”).
  - `setNetworkSettings`, `setDefaultNetwork`, `setExdevConfig`, `setPadConfig` → `sendSetCommand(...)`.
  - **Важно**: `sendSetCommand` сейчас парсит `event.data` как один JSON и может не выдержать “склеенные JSON” (в отличие от get).
- **Полный цикл (UI+set+ack modal)**: `PadDetails` `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/padDetails.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/padDetails.tsx)`.
- **Частично**:
  - `ExdevDetails` отправляет `setExdevConfig`, но **нет пользовательской модалки результата** и нет try/catch `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/exdevDetails.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/exdevDetails.tsx)`.
  - Списочные экраны (`pads.tsx`, `readers.tsx`, `exdev.tsx`) делают `getInfo(...,'all')`, но ошибки только в `console.error`.
- **Не реализовано/заглушки**:
  - `ReaderDetails` кнопка “Сохранить” пустая `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/readerDetails.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/readerDetails.tsx)`.
  - `network.tsx` и модалки `ServerModal`/`PasswordModal`/`FactoryModal` — отправка не подключена `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/network.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/network.tsx)`.
  - `crefs.tsx` — экран-плейсхолдер без get/set `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/crefs.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/crefs.tsx)`.

## Предлагаемая архитектура доработки
### 1) Укрепить контракт `useControllerConfig` под единый UX
- **Добавить set-функции для недостающих типов**:
  - `setReaderConfig(readerParams: Partial<ReaderParams>)` → `sendSetCommand('reader', payload)`
  - `setCrossConfig(crossParams: Partial<CrossParams>)` → `sendSetCommand('cross', payload)`
- **Сделать парсинг в `sendSetCommand` устойчивым к “склеенным JSON”** так же, как в `getDataFromController` (split `}{` и цикл по объектам). Это критично для корректного ack.
- **Нормализовать возвращаемое значение**: все `set*` возвращают полный `data` (как сейчас), а UI решает текст сообщения.

### 2) Унифицировать UI-обработку результата отправки
- Принять единый паттерн как в `PadDetails`: локальные `resultMessage` + `ModalText`.
- В `ExdevDetails`, `ReaderDetails`, сетевых модалках — добавить:
  - сбор `payload`
  - `try/catch` вокруг `await set...`
  - проверку `data?.answer?.<type> === 'ok'`
  - показ `ModalText` (успех/ошибка/таймаут/нет подключения).

### 3) Довести экраны `app/controller/config/*` до “корректного отображения”
- **Списочные экраны** (`pads.tsx`, `readers.tsx`, `exdev.tsx`):
  - при ошибке `getInfo` показывать `ErrorModal` (а не только `console.error`)
  - оставить `ActivityIndicator` как есть.
- **Network** (`network.tsx`):
  - подключить кнопку “Отправить” к `setNetworkSettings({ip,mask,gateway})` (через `useControllerConfig`, не `useControllerCommands`).
  - модалки:
    - `ServerModal` → `setNetworkSettings({server})`
    - `PasswordModal` → валидация совпадения паролей → `setNetworkSettings({password})`
    - `FactoryModal` → `setDefaultNetwork()` + показ результата + (опционально) инициировать `disconnect()` или показать предупреждение о разрыве связи.
- **Crefs/Cross**:
  - создать экран списка `cross` (по аналогии с `pads/readers/exdev`): `getInfo('cross','all')`, сортировка по `number`.
  - сделать модалку `CrossDetails` в `components/modal-content/`:
    - отображение текущих полей
    - редактирование (минимум: source/destination/time_criteria/time_reaction)
    - `setCrossConfig` + `ModalText`.
  - если нужен красивый list-item, добавить простой UI-блок (аналог `PadLine/ReaderLine/ExdevLine`).

### 4) Разграничить `useControllerCommands` vs `useControllerConfig`
- В config-экранах использовать **только** `useControllerConfig`.
- При необходимости — убрать лишние импорты (например, `useControllerCommands` в `network.tsx`, если не используется).

## Проверка готовности (ручной чеклист)
- Подключение к контроллеру проходит, сокет активен.
- Для каждого раздела (`pads`, `exdev`, `readers`, `network`, `cross`):
  - список грузится (`getInfo(...,'all')`) и корректно отображается
  - открывается модалка деталей
  - “Сохранить/Отправить” вызывает `set*`
  - после ответа контроллера показывается `ModalText` с успехом или понятной ошибкой
  - при потере связи/таймауте сообщение тоже отображается.

## Основные файлы, которые будут затронуты
- Хук: `[d:/проекты/new/PERCo-C01-Manager/hooks/useControllerConfig.ts](d:/проекты/new/PERCo-C01-Manager/hooks/useControllerConfig.ts)`
- Экраны: 
  - `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/readers.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/readers.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/pads.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/pads.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/exdev.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/exdev.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/network.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/network.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/app/controller/config/crefs.tsx](d:/проекты/new/PERCo-C01-Manager/app/controller/config/crefs.tsx)`
- Модалки:
  - `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/padDetails.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/padDetails.tsx)` (как эталон)
  - `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/exdevDetails.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/exdevDetails.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/readerDetails.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/readerDetails.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/serverModal.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/serverModal.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/passwordModal.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/passwordModal.tsx)`
  - `[d:/проекты/new/PERCo-C01-Manager/components/modal-content/factoryModal.tsx](d:/проекты/new/PERCo-C01-Manager/components/modal-content/factoryModal.tsx)`
  - новый: `components/modal-content/crossDetails.tsx` (и при необходимости UI-строка для списка)
