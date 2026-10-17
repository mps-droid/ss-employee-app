# First Android run: log review

Recorded 17 October 2026 on a debug build (React Native 0.77.2, New Architecture, Hermes) running on the Android 17 emulator (API 37). The session covered login, Leaves, My Attendance, a job's details and Add Images, including one photo upload.

**Result:** the app did not crash. It wrote 576 log lines. Most are normal debug-build noise; five items need work.

## Needs fixing

| # | Message | Where | Cause | Fix | Audit |
|---|---|---|---|---|---|
| 1 | `FirebaseApp: Default FirebaseApp failed to initialize because no default options were found. This usually means that com.google.gms:google-services was not applied to your gradle project.` | App start | The Google Services Gradle plugin is never applied, so `google-services.json` is ignored. Firebase only starts because `src/utils/firebase.js` initialises it from the web config. | Apply `com.google.gms.google-services` in `android/app/build.gradle` and remove the JS `initializeApp` call. | BLD-12 |
| 2 | ``'`m` unknown or invalid utility'`` (twrnc) | Job Details screens | `text-m` is not a Tailwind class, so no font size is applied. | Use a real size class such as `text-base`. | ARC-07 |
| 3 | Debug output of personal and API data: login roles, full leave records (user ID, reasons, dates), job IDs, photo file paths | Login, Leaves, job screens, Add Images | `console.log` calls left in the code; nothing removes them from release builds. | Delete the logs and strip `console.*` in release builds. | SEC-08 |
| 4 | `Warning: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.` | My Attendance | A third-party component (most likely the date picker, `react-native-modal-datetime-picker`) still uses `defaultProps`. | Upgrade the date picker library (18.x). | DEP-08 |
| 5 | `[RNScreens] largeTitleHideShadow prop is not available on Android` (also `backTitleVisible`, `disableBackButtonMenu`), 8 times each | Every stack screen | React Navigation 6's native stack passes iOS-only props to react-native-screens 4.10. Harmless, but it buries real warnings. | Goes away with the React Navigation 7 upgrade. | DEP-06 |

## Development environment only (no action needed)

| Message | Why it appears |
|---|---|
| `Unable to load script`, `Cannot connect to Metro`, `Couldn't connect to packager, will silently retry`, `Software caused connection abort` | The first launch checked for Metro before the freshly booted emulator could reach it, and the connection dropped while the camera app was in front. Debug builds only. Reload with R, R if it shows. |
| `ReactNoCrashSoftException: Tried to access onWindowFocusChange while context is not ready` | React Native 0.77 New Architecture startup message. It is logged, not thrown. |
| `ViewManagerPropertyUpdater: Could not find generated setter for class …` (about 30) | Normal in debug builds while older view managers run through the New Architecture interop layer. |
| `BridgelessReact: ReactHost{0}…`, `SoLoader: …` | Lifecycle trace messages logged at warning level. |
| `FATAL EXCEPTION … Process: com.google.android.gms` | Google Play services on the emulator crashed. This is not the app. |
| `Verification of … took …ms`, `Unexpected CPU variant for x86: x86_64` | Android runtime notes from the emulator. |

## Reading the logs

- **Android Studio:** Logcat, filtered with `package:com.socialemployee`. The unfiltered view mixes in the whole system's logs.
- **Terminal (PowerShell):** `adb logcat --pid=$(adb shell pidof com.socialemployee)`
- **JavaScript `console.log`:** since React Native 0.77, Metro no longer prints app logs. Press `j` in the Metro terminal to open React Native DevTools.
