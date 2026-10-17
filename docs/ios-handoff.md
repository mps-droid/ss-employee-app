# iOS handoff: build Social Sanitation Employee and ship it to the App Store

Written on 17 October 2026 on the Windows PC, for the Claude Code session that builds the iOS app on a Mac. Read all of it before running anything.

## Where things stand

- React Native 0.88.0 with React 19.3.0, Hermes and the New Architecture.
- The JavaScript app and Android are done. They're tested on the Android 17 emulator, and Android 1.1.0 (code 6) was submitted to Google Play for review on 17 October 2026.
- iOS was migrated to 0.88 on Windows (Podfile, AppDelegate, Info.plist, iOS 15.1) but has **never been built**. Expect a few fixes on the first build.
- Repository: github.com/mps-droid/ss-employee-app, branch `main`.

## Rules from the owner

- **Never change the bundle ID** `com.sanitationEmployee` (or Android's `com.socialemployee`). A new ID would create a new store app.
- **Never commit** `.env`, `GoogleService-Info.plist`, `google-services.json`, keystores, certificates, `.p8`, `.p12` or `.mobileprovision` files, `signing.properties` or `local.properties`.
- **Commit only when the owner asks, and never push.** The owner pushes.
- The owner runs the business and isn't a mobile developer. Give short, plain answers and short commands.
- **The app talks to the live server; there's no staging server.** On a real account, only browse. Never clock in or out, upload photos, complete jobs, tick checklist items or apply for leave.
- **Keep the audit up to date:** https://claude.ai/artifact/KJM8dpzgPEs5R6GyMov8bR. Read it with the Artifact tool. After each change set, update the statuses of the iOS findings below and add a work-log entry.

## Files to copy from the Windows PC

They're git-ignored, so a clone won't have them. Copy them privately (AirDrop or USB), never through git or chat.

| File                           | Purpose                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env` (repo root)             | `API_BASE_URL`, the REST API address. `.env.example` documents it.                                                                          |
| `ios/GoogleService-Info.plist` | Firebase config. Xcode uses this copy. `ios/SocialSanitationEmployee/GoogleService-Info.plist` on the PC is an identical, unused duplicate. |

## Tools

- Xcode: the current release from the Mac App Store. App Store Connect rejects builds made with an older SDK.
- Node.js 22.13 or later (`package.json` accepts `^22.13.0 || ^24.3.0 || >= 26.0.0`).
- Ruby with Bundler. The `Gemfile` pins CocoaPods.
- An Apple ID in team `DSJB4W4QVD` (the project's `DEVELOPMENT_TEAM`) with access to the app in App Store Connect. Signing is automatic.

## First build

```sh
npm ci
cd ios
bundle install
bundle exec pod install
open SocialSanitationEmployee.xcworkspace
```

1. Run the `SocialSanitationEmployee` scheme on a simulator with `npm start` running in the repo root, then on a real iPhone.
2. If Xcode can't find Node, create `ios/.xcode.env.local` containing `export NODE_BINARY=$(command -v node)`. It's git-ignored.
3. `pod install` rewrites `ios/Podfile.lock`, which is still the 0.77 one. Commit the new lock file when the owner asks (BLD-16).
4. Check the result:
   - Text is set in Manrope (body) and Sora (headings).
   - Icons show.
   - Login works.
   - No red errors in Metro.

## Known iOS changes to make and verify on the Mac

1. **`Info.plist`:** change `UIRequiredDeviceCapabilities` from `armv7` to `arm64`, as in the 0.88 template (STR-06).
2. **`Info.plist`:** add `ITSAppUsesNonExemptEncryption` = `false`. The app's only encryption is HTTPS, which is exempt, so App Store Connect stops asking the export-compliance question on every upload (STR-06). Confirm with the owner first, since it's a legal declaration.
3. **`SocialSanitationEmployee.entitlements`:** it has `aps-environment`, but the app has no push notifications (LOG-05). If signing fails because the App ID lacks Push Notifications, remove the entitlement rather than enabling push.
4. **`AppDelegate.mm`:** it's Objective-C on `RCTAppDelegate` with `RCTAppDependencyProvider`, which is deprecated in 0.88 but still present.
   - If the build fails there, move to the 0.88 template's Swift AppDelegate (`RCTReactNativeFactory`). The React Native Upgrade Helper shows the template files: https://react-native-community.github.io/upgrade-helper/
   - Keep the Firebase setup (`[FIRApp configure]`, or `FirebaseApp.configure()` in Swift).
   - Keep the module name `SocialSanitationEmployee`.
5. **No Analytics:** after `pod install`, confirm that no Firebase Analytics pod is linked: `grep -i analytics ios/Podfile.lock` (STR-04).
6. **Podfile:**
   - It follows the 0.88 template.
   - It uses `use_frameworks! :linkage => :static` and `$RNFirebaseAsStaticFramework = true`, as React Native Firebase requires.
   - It calls `setup_permissions(['Camera', 'PhotoLibrary'])` for react-native-permissions.
   - Location goes through `@react-native-community/geolocation`, which asks for permission itself.

## Version and build number

- The iOS version is still the inherited **8.0.1 (build 1)**. The App Store won't accept a version lower than the one already live, so it can't simply follow Android's 1.1.0.
- Check the latest version and build in App Store Connect, then **ask the owner** which to use, such as 8.1.0 (1). The mismatch with Android is BRD-04.
- Set the numbers in Xcode under target › General › Identity. They're stored as `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in `project.pbxproj`.

## Upload

1. Set the destination to **Any iOS Device (arm64)**, then **Product › Archive**.
2. In the Organizer, choose **Distribute App › App Store Connect › Upload**.
3. Test through TestFlight (internal testing), then submit for review in App Store Connect.

## App Review watch-outs

- **Sign-in:** the app is staff-only and needs a login. App Review needs a demo account in App Review Information. Ask the owner for one.
- **Privacy policy:** App Store Connect needs a privacy policy URL, and the app needs a link to it (STR-05). The owner still has to provide the URL.
- **App Privacy answers:**
  - Collected: name, email, phone, precise location when clocking in and out, photos, and the user ID linked to the account.
  - No tracking and no ads.
- **Account deletion:** it exists under Profile › Delete account (Guideline 5.1.1(v)).
- **Chat:** the group chat list never loads, because the backend doesn't answer `GET /firebase/myGroups` for a signed-in user (BUG-20). A reviewer may hit it, so tell the owner before submitting.
- **Home-screen name:** "Social Sanitation Employee" gets cut short under the icon (BRD-10). If the owner picks a short name, such as "SS Employee", set `CFBundleDisplayName`.
- **`NSLocalNetworkUsageDescription`:** it's only for reaching Metro in debug builds and can stay.

## Audit findings that involve iOS

| ID             | Status on 17 Oct 2026  | What to do                                                                                  |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| BLD-28         | Open                   | Build iOS on a Mac. This whole note.                                                        |
| BLD-03, BLD-15 | Fixed in code, not run | Confirm the Podfile works.                                                                  |
| BLD-14         | Fixed in code, not run | Confirm Hermes and the New Architecture run on iOS.                                         |
| BLD-16         | Partly                 | Commit the regenerated `Podfile.lock`.                                                      |
| STR-04         | Partly                 | Confirm there's no Analytics pod.                                                           |
| STR-06         | Partly                 | Make the `arm64` and encryption-key changes. The Firebase plist question is answered above. |
| BRD-04, BRD-10 | Open                   | Agree the version and home-screen name with the owner.                                      |
| STR-05         | Open                   | Privacy policy URL and in-app link.                                                         |

## Useful facts about the code

- `android/app/build.gradle` sends the C++ build to `%USERPROFILE%\.cxx` on Windows only, because of Windows' 260-character path limit. It doesn't affect the Mac.
- Import icons only from `src/components/icons.js`. Each icon there comes from its own Lucide file; importing from `lucide-react-native` itself bundles all ~1,900 icons.
- The theme in `src/theme` follows the client's website: colours, Manrope and Sora, near-square corners. Screens use the shared components in `src/components` and have no colours of their own.
- The API base URL comes from `API_BASE_URL` in `.env`, through react-native-config and `src/config/env.js`. Some list endpoints answer an empty list with a "No … found" error, which `isEmptyListError` in `src/api/client.js` handles.
- Checks: `npm test` (22 tests), `npm run lint` and `npx prettier --check .`.
