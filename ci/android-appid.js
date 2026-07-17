/* CI helper: set the Android applicationId to the Play Console package name.

   iOS and Android use DIFFERENT store identifiers here, on purpose:
     iOS bundle id (capacitor.config.json appId): com.mschaefer20.tidal
     Android applicationId (Play Console):        io.github.mschaefer20.tidal

   Capacitor's single appId generates both native projects as
   com.mschaefer20.tidal, so we rewrite ONLY the Android applicationId after
   `cap sync`. We deliberately leave the Gradle `namespace` (the code package,
   where Capacitor generates MainActivity) as com.mschaefer20.tidal — namespace
   need not match applicationId, and leaving it untouched keeps the regenerated
   MainActivity/manifest resolving correctly (android:name=".MainActivity"
   resolves against namespace, not applicationId).

   Idempotent; throws if applicationId isn't found. */

const fs = require("fs");

const ANDROID_APP_ID = "io.github.mschaefer20.tidal";
const GRADLE = "android/app/build.gradle";

let src = fs.readFileSync(GRADLE, "utf8");

if (src.includes(`applicationId "${ANDROID_APP_ID}"`)) {
  console.log(`android-appid: already ${ANDROID_APP_ID} — skipping`);
  process.exit(0);
}
if (!/applicationId\s+"[^"]*"/.test(src)) {
  throw new Error(`android-appid: 'applicationId "..."' not found in ${GRADLE}`);
}

src = src.replace(/applicationId\s+"[^"]*"/, `applicationId "${ANDROID_APP_ID}"`);
fs.writeFileSync(GRADLE, src);
console.log(`android-appid: applicationId -> ${ANDROID_APP_ID}`);
