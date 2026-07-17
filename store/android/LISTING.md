# Google Play listing — Tidal Orbit

Paste-ready copy + the compliance answers for the Play Console store listing.
Assets in this folder are **drafts** generated from the game's own brand/visuals —
review before publishing. Specs verified against Play Console Help (2026-07-16).

---

## Identity
- **App title** (≤30): `Tidal Orbit`
- **Package name**: `io.github.mschaefer20.tidal` (Play — permanent, never reusable).
  Note this **differs from the iOS bundle id** `com.mschaefer20.tidal` — that's fine and
  intentional; the stores use independent identifiers. Set on Android only by
  `ci/android-appid.js`; `capacitor.config.json` appId stays the iOS value.
- **Category**: Games → Arcade
- **Contact email**: consider a dedicated alias — Play displays this publicly on the listing.

## Short description (≤80 chars)
```
One-tap gravity arcade: flip, swing through the gaps, and break into 3D.
```
(72 characters.)

## Full description (≤4000 chars)
```
Tidal is a one-button arcade game about momentum.

Your orb is pulled between two planets — tap to flip which one has you. That's
the whole control scheme. But the orb swings like a pendulum, so every tap is a
commitment. Weave through the gaps, grab gold coins, and don't get pulled into a
wall.

Survive long enough and Tidal does something you won't expect: at 100 points the
flat world tears open and you drop into a fully 3D space tunnel — same one-tap
rule, whole new dimension.

• One-button, pick-up-and-play controls
• A pendulum you have to feel, not just react to
• A genuine 2D → 3D transformation at 100 points
• Hand-built space backdrop: starfield, nebula, and a black hole
• Sound, music, and haptics — with a Reduce Motion option
• Plays offline. No ads. No accounts.

Simple to learn. Hard to put down.
```
Note vs. iOS copy: dropped "no tracking" — the app transmits purchase history to
RevenueCat, so that claim would contradict the Data Safety form below.

## What's New (first Android release)
```
First Android release. Tap to flip gravity, survive, and break into 3D at 100.
```

---

## Assets in this folder
| File | Spec | Status |
|---|---|---|
| `icon-512.png` | 512×512, 32-bit PNG + alpha, 136 KB (≤1 MB) | ✅ ready (from resources/icon.png) |
| `feature-graphic-1024x500.png` | 1024×500, 24-bit PNG, no alpha | ✅ draft — brand wordmark + orbital motif |
| `screenshots/shot-1..5.png` | 1080×2160, exactly 2:1 | ✅ compliant drafts (real game renders) |

**Screenshots**: these are captured from the actual web build at a Play-compliant
2:1 ratio (your iOS 1290×2796 shots are 2.167:1 and Play **rejects** them). They
are genuine game frames and are usable as-is. If you want device-authentic shots,
re-grab on the physical Android device via `?shot=1..5` — the posed-scene mode is
built in (see game.js `setupShot`). Play needs 2–8; five are provided.

**Still needed (not generatable here):**
- Optional YouTube preview video (recommended for games; not required).
- Tablet screenshots — skip (excluding tablets is fine; only 2 phone shots gate publishing).

---

## Content rating (IARC questionnaire) — mandatory before publishing
Answer honestly; these give **Everyone / PEGI 3 / IARC 3+** with an "In-app purchases" label:
- Violence / sexual content / language / controlled substances / horror / gambling → **None / No**
- **Does the app contain ads?** → **No** (currently true; flip to Yes when AdMob lands)
- **Digital purchases?** → **Yes** (skins + coin packs)
- **Randomized purchases / paid loot boxes / "mystery" items?** → **No** — skins are
  deterministic fixed-price buys (store.js `buySkin`, no randomness). This keeps the
  rating low and avoids Play's loot-box odds-disclosure obligation.
- User-generated content / in-app user communication → **No** (no chat; Android v1 has
  no leaderboard — see below).

## Target audience & content
- **Target age: 13+** (13–15, 16–17, 18+). Do **not** select any under-13 bracket:
  that triggers Play's **Families** policy, which restricts ad SDKs and bans the
  advertising ID — closing the AdMob path you may want later. (This is independent of
  the Everyone/PEGI 3 content rating.)
- Ads declaration (App content → Ads): **No** now → drives the absence of the "Contains
  ads" badge. Flip to Yes with AdMob.

## Data safety form — mandatory; you may NOT select "No data collected"
Android v1 excludes Game Center/Play Games (game-connect is not in the Android build),
so the **only** off-device data egress is RevenueCat during a purchase:
- **Financial info → Purchase history**
  - Collected: **Yes** · Shared: **No** (RevenueCat is a service provider processing on
    your behalf) · Purpose: **App functionality** · Optional: users can play free without
    it, but it's required to make a purchase.
- Encrypted in transit: **Yes**. Account/data deletion: handled via RevenueCat / the store.
- **No** advertising ID today (no AdMob) — when AdMob ships, add **Device or other IDs →
  Advertising ID**, Collected **and Shared**, purpose **Advertising**.
- Privacy policy URL: the hosted `docs/privacy.html` (already accurate as of the Phase 0 fix).

> When Play Games leaderboards are added on Android later (delete the
> `android.includePlugins` allowlist to re-enable game-connect), add **App activity →
> other user activity** for the score submission.

---

## Publishing-gate checklist
- [ ] App icon 512² uploaded · [ ] Feature graphic 1024×500 uploaded · [ ] ≥2 phone screenshots
- [ ] Short + full description · [ ] Content rating questionnaire submitted
- [ ] Target audience 13+ · [ ] Ads declaration (No) · [ ] Data safety form + privacy URL
- [ ] **First .aab uploaded by hand** (the Play API can't publish the very first build)
- [ ] Closed-testing track with ≥12 testers (the 14-day production-access gate)
