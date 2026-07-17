/* CI helper: lock the Android app to portrait.

   Capacitor has no config option for orientation, so we patch the generated
   AndroidManifest.xml after `cap sync`:

   1. android:screenOrientation="portrait" on MainActivity — the portrait lock
      itself (the analog of the iOS UISupportedInterfaceOrientations plist edit).
   2. PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY on <application> — under
      targetSdk 36, Android IGNORES screenOrientation on large screens (>=600dp)
      unless this compat property is set. NOTE: this opt-out is temporary and is
      removed at API 37 (~2027), after which portrait is best-effort on tablets.

   Idempotent: re-running (or running on an already-patched manifest) is a no-op.
   Throws if the anchor elements are missing rather than silently shipping an
   unlocked, freely-rotatable build. */

const fs = require("fs");

const MANIFEST = "android/app/src/main/AndroidManifest.xml";
let src = fs.readFileSync(MANIFEST, "utf8");

if (!/android:name="\.MainActivity"/.test(src)) {
  throw new Error(`android-manifest: MainActivity not found in ${MANIFEST}`);
}
if (!/<application[\s\S]*?>/.test(src)) {
  throw new Error(`android-manifest: <application> not found in ${MANIFEST}`);
}

// 1. Portrait lock on MainActivity.
if (!/android:screenOrientation/.test(src)) {
  src = src.replace(
    /(android:name="\.MainActivity")/,
    'android:screenOrientation="portrait"\n            $1'
  );
}

// 2. Large-screen compat opt-out (temporary; gone at API 37).
if (!/PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY/.test(src)) {
  src = src.replace(
    /(<application[\s\S]*?>)/,
    '$1\n        <property\n            android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY"\n            android:value="true" />'
  );
}

fs.writeFileSync(MANIFEST, src);
console.log("android-manifest: portrait lock + large-screen compat applied");
