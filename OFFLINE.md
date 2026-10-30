# Building Photo360 on an offline Windows machine

This repository contains everything needed to build the Android app without internet access:

| What | Where |
|---|---|
| App source | `src/`, `android/`, `ios/` |
| JS dependencies (installed) | `node_modules/` |
| Every Gradle/Maven dependency (incl. Windows `aapt2`) | `offline/gradle-cache/modules-2/` (Gradle read-only dependency cache) |
| Gradle 7.5.1 distribution | `android/gradle/wrapper/gradle-7.5.1-all.zip` (joined by setup) |
| JDK 17 for Windows x64 (Temurin 17.0.20.1) | `offline/jdk/` (extracted by setup) |

Files over GitHub's 100 MB limit are stored as `*.partNN` pieces and listed with their SHA-256 in
`offline/large-files.txt`. `offline/setup.ps1` joins and verifies them.

AWS S3 upload/download has been removed from the app (`src/shared/utils/s3.ts` is a stub that always fails),
so photospheres are only stored on the device.

## 1. Get the repo (on a machine with internet)

```
git clone -c core.longpaths=true -c core.autocrlf=false https://github.com/<owner>/<repo>.git
```

Run `offline\setup.ps1` only after cloning (it needs the `.partNN` files). Copy the whole cloned folder to the offline machine (USB drive etc.). Put it at a short path such as
`C:\src\photo360`. Some files in `node_modules` have long paths, so also enable long paths on the offline
machine if Windows complains: `git config --global core.longpaths true` and/or the
"Enable Win32 long paths" group policy.

## 2. One-time setup (offline machine)

Requires: Node.js (16–20 recommended), Android SDK with **build-tools 34.0.0**, **platform android-34**,
**NDK 23.1.7779620**, and **CMake 3.22.1** (SDK Manager → SDK Tools; these must already be installed since
the SDK cannot be downloaded offline).

From the repo root in PowerShell:

```
powershell -ExecutionPolicy Bypass -File offline\setup.ps1
```

This:
1. joins and checksum-verifies the split large files,
2. extracts JDK 17 into `offline\jdk\`,
3. sets the user environment variable `GRADLE_RO_DEP_CACHE` to `offline\gradle-cache`, so Gradle takes
   every dependency from the bundled cache (restart Android Studio after this),
4. writes `android\local.properties` with your Android SDK path (from `ANDROID_HOME`, `ANDROID_SDK_ROOT`
   or `%LOCALAPPDATA%\Android\Sdk`).

## 3. Build

```
powershell -ExecutionPolicy Bypass -File offline\build.ps1 assembleDebug
powershell -ExecutionPolicy Bypass -File offline\build.ps1 assembleRelease
```

APKs end up in `android\app\build\outputs\apk\`.

### Android Studio

Open the `android` folder, then:
- **Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**: choose
  `offline\jdk\jdk-17.0.20.1+1` (the JBR 21 bundled with newer Android Studio cannot run Gradle 7.5.1).
- Turn on **offline mode** (Gradle tool window → "Toggle Offline Mode").
- Do **not** accept prompts to upgrade Gradle or the Android Gradle Plugin.

## 4. Run / develop

`node_modules/.bin` shortcuts are Unix symlinks and don't work on Windows, so call the CLI through Node:

```
node node_modules\react-native\cli.js start                 # Metro bundler (was: yarn start)
node node_modules\react-native\cli.js run-android           # build + install on device/emulator
adb reverse tcp:8081 tcp:8081                               # if the device can't reach Metro
```

Optionally, recreate the Windows `.bin` shims once with `npm rebuild --ignore-scripts` (works offline).
After that `npx react-native start` / `yarn start` work as usual.

## Updating the code

- Edit JS/TS in `src/`, Java/Kotlin in `android/` — no internet needed.
- Always build with `--offline` (`build.ps1` does this; in Android Studio use offline mode).
- You **cannot add new npm or Gradle dependencies offline**. To add one, on a machine with internet:
  install it, run a build with `GRADLE_USER_HOME` set to an empty folder, copy that folder's
  `caches/modules-2` over `offline/gradle-cache/modules-2` (skip `*.lock` and `gc.properties`), and commit
  `node_modules` + `offline/gradle-cache`.
