---
name: frame-animator
description: Design and improve frame-based character animations for avatar/expression systems. Use when working on tick-based animation arrays, expression timing, blink cycles, idle loops, or mouth movement for a desktop character or mascot. Applies Disney's 12 animation principles concretely: asymmetric blinks, secondary actions, slow-in/slow-out, speaking rhythm, and idle personality.
metadata:
  author: orkait
  version: "1.0"
---

# Frame Animator

Systematic process for designing natural-feeling frame animations for character avatar systems. Covers idle loops, speaking, listening, and all emotional stances.

Assumes a frame-array model: each entry in the array = one tick. The array loops. No math — just explicit frames.

## When to Use

- Creating a new stance animation from scratch
- Improving an existing animation that "feels off"
- Auditing why an animation looks robotic or dead
- Designing a full set (idle + speaking + listening) for a new emotional state

## Core Principles

See [references/principles.md](references/principles.md) for the full reference. The rules that matter most in practice:

**1. Asymmetric blinks**
Closing is faster than opening. Always use an intermediate (half-open) frame.
```
open → half-open → half-open → closed → half-open → half-open → half-open → open
  [  2 frames close  ]  [hold]  [      3 frames open (slower)       ]
```
A blink that closes and opens at the same speed reads as mechanical.

**2. Secondary actions**
Idle loops need something happening beyond the main expression. Ear twitches, subtle eye shifts — 1-2 frame actions that don't change the emotional read but suggest life. Place them at intervals that feel irregular (not every N frames exactly).

**3. Uneven speaking rhythm**
Vowels hold 3 frames. Consonant transitions 1-2. The mouth should not open and close at a perfect even interval. Personality leaks through how much rest sits between phrases.

**4. Blink frequency matches personality**
- Hyper-alert/focused: rare blinks (every 24-32 ticks)
- Calm/warm: moderate (every 16-24 ticks)
- Tired/sad: no blink needed (static expression reads correctly)
- Playful: happy-close acts as a natural blink, no separate sequence needed

**5. Static vs live**
Not every stance needs animation in idle. Locked/frozen expressions (stern, guarded, sad, tired) work better as static 1-frame arrays. Motion on a frozen face reads as wrong. Reserve live idle loops for stances with emotional energy.

## Process

### Phase 1 — Classify the stance

Before writing any frames, answer:

| Question | Guides |
|----------|--------|
| Is this stance energetic or locked? | Energetic → live idle. Locked → static 1-frame idle. |
| What's the dominant eye asset? | That's frame 0. Everything else is variation from it. |
| Does the stance perk ears? | Sharp ears during listening. Rounded = stays soft. |
| How does this character speak — expansive or restrained? | Wide open vs barely opens mouth. |

### Phase 2 — Design idle

For **live** stances:
1. Establish base frame (dominant eye + mouth + ears)
2. Place blink — choose tick (not too early in the loop, not too late)
3. Build asymmetric blink sequence (2 close, 1 hold, 3 open) using half-open intermediate
4. Add 1 secondary action (ear twitch, or subtle eye shift) at a different position in the loop
5. Pad with base frames to reach 24-32 total ticks

For **static** stances:
```rust
pub const IDLE: &[Frame] = &[
    Frame { face: "...", eyes: "...", mouth: "...", ears: "..." },
];
```
`tick % 1 = 0` always. One frame, no animation.

### Phase 3 — Design speaking

12-frame loop is enough. Pattern:

```
rest rest rest | open open open | close | rest rest | open open | close rest
     [pause]      [vowel hold]   [trans]  [gap]   [next phrase]
```

Vary by personality:
- **Warm/playful**: more open frames, expressive, fast transitions
- **Neutral/focused**: even timing, moderate open hold
- **Guarded/stern**: less open (barely opens), more rest, long pauses
- **Tired/sad**: heavy rest before opening, sluggish, late open

For the open position — pick the mouth asset that fits the emotional register:
- `mouth_open_flat` → neutral/large open
- `mouth_tiny_triangle` → tight/guarded open
- `mouth_open_tongue` → playful/excited open
- `mouth_tiny_triangle` → curious/tense open

### Phase 4 — Design listening

12-frame loop. No mouth movement. Show attentiveness through eyes and ears.

- Ears go sharp for most stances (perk up to listen), stay rounded for soft stances (warm, playful, sad, tired)
- Add 1-2 frames of a slightly different eye state mid-loop (attentive glance, slight processing dip)
- Otherwise hold the dominant eye asset

### Phase 5 — Review checklist

Before writing the files:

- [ ] Blink uses half-open intermediate (not instant open→closed)
- [ ] Blink close is faster than open (2 frames down, 3 frames up)
- [ ] Speaking rhythm is uneven (not perfectly even open/close intervals)
- [ ] Idle loop has at least one secondary action
- [ ] Static stances stay static (no unnecessary blinking on locked expressions)
- [ ] Ear state is correct for listening (sharp or intentionally rounded)
- [ ] Loop length feels right — 24-32 for live idle, 12 for speaking/listening

## Frame Structure

```rust
pub struct Frame {
    pub face:  &'static str,   // face_fill_blush | face_fill_rose
    pub eyes:  &'static str,   // see references/principles.md for full list
    pub mouth: &'static str,   // see references/principles.md for full list
    pub ears:  &'static str,   // ears_style_rounded | ears_style_sharp
}
```

Every field explicit on every frame. Duplicates are fine — Rust is fast enough.

## File Layout

```
src/animations/
  mod.rs              — Frame struct + pub mod declarations
  neutral.rs          — IDLE, SPEAKING, LISTENING
  warm.rs
  playful.rs
  ... (one file per stance)
```

Each file exports three const arrays: `IDLE`, `SPEAKING`, `LISTENING`.

Resolver in `avatar.rs`:
```rust
fn select_frames(state: &WhiteboxState) -> &'static [Frame] {
    let frame = &frames[state.tick_count as usize % frames.len()];
    // ...
}
```

## Common Mistakes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blink looks like flickering | Instant open→closed, no intermediate | Add half-open frames on both sides |
| Expression feels dead/static | No secondary actions in idle | Add ear twitch or eye variation 2/3 into the loop |
| Speaking looks like a metronome | Perfectly even open/close | Vary open hold length, add extra rest before some phrases |
| Sad/tired looks wrong when it blinks | Static expression shouldn't animate | Remove blink, use 1-frame static IDLE |
| Blink timing feels off | Placed too close to start or end of loop | Put blink around tick 8 in a 32-tick loop |
| Listening looks the same as idle | Ears not changed, no eye variation | Set ears to sharp, add 1-2 frame eye shift at mid-loop |
