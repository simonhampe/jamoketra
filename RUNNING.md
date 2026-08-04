# Running Jamoketra

## Setup

```
npm install
```

Node note: your local Node is `v20.13.1`, and some deps (react-native 0.86.2,
metro) declare a minimum of `20.19.4`. It's a warning during install/start, not
a hard failure -- `npx expo export` bundles the whole app fine on this
version. If something does break in a way that looks Node-related, upgrading
Node is the first thing to try.

## Option A: physical Android phone (recommended)

This is the only path that actually exercises what this app is built to test
-- a real Japanese IME.

1. Install **Expo Go** from the Play Store on the phone.
2. Install **Gboard**, add Japanese as an input language, and switch it to
   **kana/flick input** (not romaji) before opening the app.
3. On this machine, run:
   ```
   npx expo start
   ```
4. Scan the QR code shown in the terminal with the Expo Go app (or the
   phone's camera app, which will offer to open it in Expo Go).

Phone and computer need to be on the same Wi-Fi network. If the QR scan
doesn't connect, run `npx expo start --tunnel` instead (slower, but works
across networks/firewalls).

## Option B: Android emulator on this machine

Fallback only -- emulator IME behavior can diverge from a real device, which
matters a lot for this app.

1. Install Android Studio, create an AVD using a **Play Store** system image
   (needed so you can install Gboard from the Play Store inside the
   emulator).
2. Boot the AVD, install Gboard inside it, add Japanese kana input.
3. Run:
   ```
   npx expo start
   ```
   then press `a` in the terminal, or run `npx expo run:android` directly for
   a full dev build.

## Running the domain tests (no device needed)

```
npm test
```

Runs the Vitest suite against `src/domain/**` -- the pure-TS kana logic
(normalization, hiragana/katakana conversion, mora tokenizing, comparison,
word generation, scoring). No emulator or IME required.

## In-app debug overlay

On the play screen (dev builds only), there's a collapsible bar at the
bottom of the screen logging every `onChangeText` event with a timestamp and
buffer length. Useful for checking IME behavior directly: does it fire per
kana or in batches, does anything odd happen after ~40 uninterrupted
characters, etc.

## Troubleshooting

- **Metro acting up / stale bundle**: `npx expo start -c` (clears the Metro
  cache).
- **Console logs from the device**: they show up in the terminal running
  `expo start`; shake the device (or press `m` in Expo Go's dev menu on
  Android) for the in-app dev menu.
- **Nothing shows up in Gboard's suggestion bar even though it's a JP IME**:
  expected -- the app never reads the candidate/suggestion bar, only the
  composing text, by design (see the tech stack doc).
