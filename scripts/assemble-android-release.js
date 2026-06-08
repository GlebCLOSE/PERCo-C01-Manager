/**
 * Генерирует android/ (prebuild при необходимости) и собирает release APK с вшитым JS-бандлом.
 * На Windows нужен JAVA_HOME и ANDROID_HOME; путь проекта желательно без не-ASCII (см. README).
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const androidDir = path.join(root, "android");

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

if (!fs.existsSync(androidDir)) {
  console.log("[assemble-android-release] android/ отсутствует — выполняю expo prebuild…");
  const pre = spawnSync(npx, ["expo", "prebuild", "--platform", "android"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (pre.status !== 0) process.exit(pre.status ?? 1);
}

if (!fs.existsSync(androidDir)) {
  console.error("[assemble-android-release] после prebuild каталог android/ не найден.");
  process.exit(1);
}

const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const build = spawnSync(gradlew, ["assembleRelease"], {
  cwd: androidDir,
  stdio: "inherit",
  shell: true,
});
process.exit(build.status ?? 1);
