# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# Jamoketra — agent notes

Practice app for typing Japanese kana on mobile keyboards. Full product spec,
architecture rationale, and roadmap: [`jamoketra-tech-stack-en.md`](jamoketra-tech-stack-en.md)
— read that first, this file is operational notes on top of it.

## Current state

Phases 0–3 of the roadmap are done: domain core, input layer, game loop. Not
done yet: SQLite persistence, difficulty-config UI, EAS build/deploy,
Supabase leaderboards, dictionary words, kanji, iOS. See "What's still
missing" below for the concrete next slice.

### Layout

```
src/domain/    pure TS, zero RN imports, fully unit-tested (Vitest)
  kanaTables.ts   flat data tables (seion/dakuten/handakuten/youon/sokuon/chouon) --
                  everything else picks from these instead of hand-constructing
                  mora, which is what keeps invalid combos structurally impossible
  normalizer.ts   NFC + manual dakuten/handakuten fallback (Hermes safety net)
  converter.ts    hiragana<->katakana (codepoint offset) + halfwidth katakana fold
  mora.ts         tokenizer: youon = 1 mora/2 chars, everything else 1 mora/1 char
  comparator.ts   mora-based, type-through diff (target vs typed), never blocks input
  generator.ts    seeded (mulberry32) constraint-based word generator
  scoring.ts      morae/sec, accuracy from word results
  session.ts      SessionRunner -- mode-agnostic (time | wordCount), reproducible
                  word sequence for a given seed regardless of mode

src/state/sessionStore.ts   Zustand store bridging SessionRunner to the UI:
                             raw buffer -> committedOffset slicing -> comparator ->
                             haptics -> auto-advance -> summary

src/ui/input/
  HiddenKanaInput.tsx   the one real TextInput. Uncontrolled (no `value` prop --
                        setting it from state desyncs an active IME composition).
                        Buffer grows for the whole session; only ever cleared via
                        blurAndClear(), only between sessions.
  KanaDisplay.tsx       per-mora colored rendering of the comparator output
  DebugOverlay.tsx      dev-only onChangeText event log (this IS the phase-0 spike,
                        built into the real input layer instead of a throwaway app)

app/   expo-router screens: index (onboarding) -> play (session) -> results
```

### Locked decisions (don't relitigate without asking)

- **Error model**: type-through. Wrong mora is counted, never blocks further typing.
- **Advance rule**: auto-advance the instant typed morae fully match the target.
- **Romaji IME mode**: ruled out via onboarding copy, not handled in the domain layer.
- **Session mode**: `time` (60s) is the default/only mode wired into the UI;
  `wordCount` exists in `SessionMode` but isn't exposed yet. Keep `session.ts`
  mode-agnostic -- don't let `time` assumptions leak into it.

## Problems hit while bootstrapping (so you don't repeat them)

- **Never `cp -r` a fresh scaffold's `.git` into an existing repo's `.git`.**
  `create-expo-app` runs its own `git init` in the temp scaffold dir. Copying
  `scaffold/.` over the real repo merges the scaffold's `.git` into the real
  one and overwrites `refs/heads/master` + `.git/config` (remote gone). It's
  recoverable (`refs/remotes/origin/*` survives since cp doesn't delete
  files only present in the destination) via
  `git reset --soft refs/remotes/origin/master` + re-adding the remote, but
  just don't do it -- scaffold into a temp dir and `cp` everything **except**
  `.git`, or scaffold directly into a clean directory.
- **`npm install` fails on Windows/npm 10 with expo-router 57**: expo-router
  pulls in radix-ui-based web devtools that conflict on `react`/`react-dom`
  peer versions, unrelated to anything we actually use on-device. Fixed with
  a project-level `.npmrc` (`legacy-peer-deps=true`). Keep that file.
- **Vitest 4 / vite 8 (rolldown-vite) fails to start on Windows**: `Cannot
  find module '@rolldown/binding-wasm32-wasi'` -- optional native binding
  doesn't resolve for this platform/Node combo. Pinned `vitest` to `^3` in
  `package.json`, which uses the stable esbuild-based Vite. If bumping
  Vitest, check this doesn't come back before assuming it's fixed upstream.
- **NativeWind 4.2.6 + Tailwind v4**: `expo install nativewind tailwindcss`
  grabs Tailwind v4 by default, but NativeWind 4's documented setup
  (`tailwind.config.js` + PostCSS pipeline) targets Tailwind v3. Pinned
  `tailwindcss` to `^3.4.x` in devDependencies to match.
- **`expo-router` needs `expo-linking` and `expo-constants`** as real deps,
  not just transitive -- `expo install expo-router` alone doesn't pull them
  in on this version; `npx expo export` fails with "Unable to resolve module
  expo-linking" until they're installed explicitly.
- **Node is 20.13.1, react-native 0.86.2 / metro want >=20.19.4.** It's a
  warning during install/bundle, not currently a hard failure --
  `npx expo export --platform android` bundles clean on this version. If
  something breaks in a way that smells Node-related, upgrading Node is the
  first thing to try, not a rabbit hole to debug around.
- **JS class field initializers run before constructor-parameter-property
  assignment.** `SessionRunner` originally had
  `private readonly rng = mulberry32(this.config.seed)` as a field
  initializer alongside `constructor(private readonly config: SessionConfig)`
  -- the field initializer ran first, `this.config` was still `undefined`.
  Fixed by assigning `this.config` explicitly as the first line of the
  constructor body before anything that depends on it. Watch for this
  pattern anywhere a field initializer depends on a constructor param.

## What's still missing

Straight from the roadmap in `jamoketra-tech-stack-en.md`, next slice up:

- **Persistence (phase 5)**: SQLite schema via Drizzle (already installed,
  unused), `ScoreRepository` interface (local impl. first), session history,
  personal bests.
- **Difficulty config UI (phase 4)**: `DEFAULT_WORD_CONSTRAINTS` in
  `sessionStore.ts` is currently hardcoded (3 morae, all features on,
  hiragana). Needs a config screen wired to `WordConstraints`.
- **Session mode exposed in UI**: `wordCount` mode already exists in the
  domain layer, just needs a UI toggle.
- **Polish/release (phase 6)**: onboarding is minimal placeholder copy, no
  real EAS build config yet, app icons are template defaults (`assets/*` are
  still the default Expo-generated ones -- swap before shipping).
- **Not yet validated on a real device.** Everything here passed a
  typecheck + `npx expo export` bundle check, but nobody has actually typed
  on this with Gboard yet. That's the real test of pitfalls #1-3 in the tech
  doc (composition buffer behavior, opacity:0 focus stability, IME sync on
  long uninterrupted input) -- see `RUNNING.md` for how to do that. If it
  breaks, the fallback described in the tech doc is a small native Kotlin
  module calling `InputConnection.finishComposingText()` -- not built, only
  needed if the JS-only buffer/offset approach turns out to desync in
  practice.
- **Android `package` identifier reuses the old razed Flutter project's**
  (`sibby.puns.de.jamoketra`) for continuity with any existing Play Console
  listing -- confirm that's actually still wanted before an EAS build.
