/* Single source of truth for the app's version + identity, derived from the
   files Capacitor already treats as canonical. Required by the ci/ patch
   scripts (Android today; iOS iphone-only.js can adopt it next).

   - marketing version  -> package.json "version"
   - bundle / package id -> capacitor.config.json "appId"
   - build number        -> Codemagic's monotonic $BUILD_NUMBER (0 locally)  */

const pkg = require("../package.json");
const cap = require("../capacitor.config.json");

module.exports = {
  version: pkg.version,
  appId: cap.appId,
  build: process.env.BUILD_NUMBER || "0",
};
