/* CI helper: give the Android release build a signing config.

   Capacitor's generated app/build.gradle has no release signingConfig, so a
   release build is unsigned and Play rejects it. We inject one that reads the
   keystore Codemagic materializes from its `android_signing` block via these
   exact env vars (NOT a base64 CM_KEYSTORE blob — CM_KEYSTORE_PATH is a real
   filesystem path Codemagic writes the keystore to):

     CM_KEYSTORE_PATH, CM_KEYSTORE_PASSWORD, CM_KEY_ALIAS, CM_KEY_PASSWORD

   The block is guarded on CM_KEYSTORE_PATH so local/debug builds (where it is
   unset) still evaluate cleanly — debug uses its own keystore and never touches
   signingConfigs.release.

   Re-applied after `cap sync` (the android/ project is regenerated each build).
   Idempotent; throws if the anchor points are missing. */

const fs = require("fs");

const GRADLE = "android/app/build.gradle";
let src = fs.readFileSync(GRADLE, "utf8");

if (/signingConfigs\s*\{/.test(src)) {
  console.log("android-signing: signingConfigs already present — skipping");
  process.exit(0);
}

const btMatch = src.match(/\n([ \t]*)buildTypes\s*\{/);
if (!btMatch) throw new Error(`android-signing: 'buildTypes {' not found in ${GRADLE}`);
if (!/buildTypes\s*\{\s*release\s*\{/.test(src)) {
  throw new Error(`android-signing: 'buildTypes { release {' not found in ${GRADLE}`);
}

const ind = btMatch[1];                       // indentation of the buildTypes block
const block =
  `\n${ind}signingConfigs {\n` +
  `${ind}    release {\n` +
  `${ind}        def ksPath = System.getenv("CM_KEYSTORE_PATH")\n` +
  `${ind}        if (ksPath) {\n` +
  `${ind}            storeFile file(ksPath)\n` +
  `${ind}            storePassword System.getenv("CM_KEYSTORE_PASSWORD")\n` +
  `${ind}            keyAlias System.getenv("CM_KEY_ALIAS")\n` +
  `${ind}            keyPassword System.getenv("CM_KEY_PASSWORD")\n` +
  `${ind}        }\n` +
  `${ind}    }\n` +
  `${ind}}\n`;

// Insert the signingConfigs block immediately before buildTypes, and point the
// release build type at it.
src = src.replace(/(\n[ \t]*buildTypes\s*\{)/, block + "$1");
src = src.replace(/(buildTypes\s*\{\s*release\s*\{)/, `$1\n${ind}        signingConfig signingConfigs.release`);

fs.writeFileSync(GRADLE, src);
console.log("android-signing: release signingConfig injected (reads CM_KEYSTORE_* env)");
