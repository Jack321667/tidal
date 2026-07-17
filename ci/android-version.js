/* CI helper: stamp the Android versionCode + versionName.

   Capacitor generates app/build.gradle with a hardcoded `versionCode 1` /
   `versionName "1.0"` and does NOT sync them from package.json. Google Play
   rejects any build whose versionCode duplicates a previous upload, so without
   this every build after the first is rejected. Codemagic's documented
   -PversionCode= does nothing unless build.gradle reads that Gradle property,
   which the generated file doesn't — so we rewrite the literals.

   The android/ project is regenerated each build, so we re-apply after
   `cap sync`. Throws (does not warn) if the literals aren't found: a silently
   unstamped versionCode is exactly the failure we're preventing. */

const fs = require("fs");
const { version, build } = require("./version");

const GRADLE = "android/app/build.gradle";
const src = fs.readFileSync(GRADLE, "utf8");

if (!/versionCode\s+\d+/.test(src)) throw new Error(`android-version: 'versionCode <n>' not found in ${GRADLE}`);
if (!/versionName\s+"[^"]*"/.test(src)) throw new Error(`android-version: 'versionName "..."' not found in ${GRADLE}`);

const out = src
  .replace(/versionCode\s+\d+/, `versionCode ${build}`)
  .replace(/versionName\s+"[^"]*"/, `versionName "${version}"`);

fs.writeFileSync(GRADLE, out);
console.log(`android-version: versionCode ${build}, versionName ${version}`);
