# Jamoketra — Tech Stack & Architecture

Practice app for typing Japanese kana on mobile keyboards.
Target audience: non-native speakers. MVP: hiragana + katakana, randomly generated words.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo (React Native), managed workflow |
| Language | TypeScript |
| Navigation | expo-router (file-based) |
| State | Zustand |
| Persistence | expo-sqlite + Drizzle ORM |
| Styling | NativeWind (Tailwind) |
| Tests | Vitest (domain layer only, no emulator) |
| Haptics | expo-haptics |
| Build/Deploy | EAS Build → Google Play Internal Testing |
| Backend | none in MVP (fully local) |

**Later (leaderboards):** Supabase (Postgres, RLS, anonymous auth with upgrade path).

**Rationale for Expo:** React/TS is familiar ground → the code stays readable and LLM output remains reviewable. Performance is not a criterion for a text-based app. iOS stays optionally open.

---

## 2. High-Level App Architecture

### Core idea of input handling

The user types **hiragana** via the system IME. The app reads the composing buffer live and renders the display itself — including conversion to katakana where the exercise calls for it. The IME is used purely as a character source; its conversion feature (candidate bar) is deliberately not used.

```
[ System IME (Gboard JP) ]
            │
            ▼
[ TextInput, opacity: 0, permanently focused ]   ← pure IME attachment point
            │  onChangeText
            ▼
[ Domain Layer (pure TS) ]
   ├─ Normalizer   (NFC, halfwidth → fullwidth)
   ├─ Converter    (hiragana → katakana, codepoint offset)
   ├─ Comparator   (target vs. input, mora-based)
   ├─ Generator    (seeded random words, constraint-based)
   └─ Scoring
            │
            ▼
[ UI Layer (React) ]   ← target word, typed text, colouring, timer
            │
            ▼
[ SQLite ]   ← session history (seed + config, not the words)
```

### Layers

- **`src/domain/`** — pure TypeScript, **no** React Native imports. Fully unit-testable.
- **`src/ui/`** — screens, components, rendering of the input field.
- **`src/data/`** — SQLite access, `ScoreRepository` interface (local impl. now, remote later).

### Difficulty model

Configurable via orthogonal features rather than fixed levels:
`kana_length` (in **morae**), `has_dakuten`, `has_handakuten`, `has_youon` (きゃ), `has_sokuon` (っ), `has_chouon` (ー), `script` (hira/kata).

The generator produces words satisfying these constraints. Seed + config are stored → rounds are reproducible, which is the basis for fair leaderboards.

---

## 3. Key Technical Pitfalls

1. **IME internals are invisible.** No flick gestures, no key presses, no swipe direction — regardless of platform or framework. Only measurable: time, text-change events, corrections. Define metrics accordingly.

2. **Suggestions cannot be turned off.** `autoCorrect={false}` is ignored by Japanese IMEs. The defence against predictive input is **random pseudo-words** — no IME can predict those. (This resurfaces when the dictionary is added later.)

3. **Clearing the TextInput during an active composition breaks IME sync.** Causes ghost text and a jumping cursor. Solution: let the buffer grow across word boundaries and only track an offset. Clear exclusively between sessions.
   *Fallbacks:* `blur()`/`focus()` forces the composition to end; the cleanest option is a small Expo native module (~50 lines of Kotlin) calling `InputConnection.finishComposingText()`.

4. **Dakuten decomposition.** IMEs may deliver が as U+304B + U+3099 instead of precomposed U+304C. `normalize('NFC')` solves this — verify availability in Hermes. Fallback: lookup table (25 dakuten + 5 handakuten pairs).

5. **Halfwidth katakana** (ｶ) can appear. Fold to fullwidth in the comparator, not in the stored text.

6. **Morae ≠ characters.** きゃ is one mora made of two characters. Length, progress and speed must count morae, otherwise difficulty is wrong.

7. **LLM-generated kana code is reliably wrong on edge cases** while still looking plausible (invalid youon such as さゃ, っ at word end, ー at word start). The domain layer is the one part that needs tests and should not be generated blindly.

---

## 4. Spike Scope

**Goal:** verify the input concept holds up on a real Android device with Japanese Gboard.
**Effort:** ~60–90 min. **Not part of the spike:** UI, scoring, persistence, generator.

Minimal Expo project, one `TextInput`, log all events with timestamps into a list.

To determine:

1. Does `onChangeText` fire on **every** kana during composition — or only at certain points?
2. Does focus stay stable on an `opacity: 0` field, and does the keyboard stay open?
3. What happens after ~40 characters of uninterrupted composition? Auto-commit, slowdown, or stable?
4. Is `String.prototype.normalize` available in Hermes? Does Gboard deliver precomposed or decomposed dakuten?
5. What does the buffer look like in romaji mode — does a transient latin "k" appear before "か"?

**Abort criterion:** if 1 or 2 fails hard and cannot be solved via a native module → re-evaluate towards native Kotlin + Compose (Android-only from then on).

---

## 5. Implementation Roadmap (rough)

**0 — Spike**
- Verify input behaviour (see above)

**1 — Domain core**
- Normalizer, converter, comparator
- Word generator (seeded, constraint-based)
- Vitest suite for edge cases

**2 — Input layer**
- Hidden TextInput + buffer management
- Self-rendered input display, per-mora colouring

**3 — Game loop**
- Target word → input → match → next word
- Timer, error counting
- Session end + results screen

**4 — Configuration**
- Difficulty settings (length, features, script)
- Session mode (time vs. word count)

**5 — Persistence**
- SQLite schema, session history
- Statistics, personal bests
- `ScoreRepository` interface (local)

**6 — Polish & release**
- Haptics, onboarding (note: ignore the candidate bar)
- EAS Build → Play Internal Testing

**Future stages**
- Leaderboards (Supabase, anonymous auth)
- Dictionary words (JMdict) — caution: predictive input
- Kanji / real texts
- iOS

---

## Open Questions

To be decided before starting phase 2/3:

- **Error model:** blocking (wrong character rejected) vs. type-through (errors counted, user continues)?
- **Advance rule:** auto-advance on match, or explicit confirmation?
- **Romaji mode:** support it, or rule it out via onboarding?
- **Session definition:** fixed word count or fixed time? (determines primary metric & score schema)
