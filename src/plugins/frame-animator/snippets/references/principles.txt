# Animation Principles Reference

Research-backed timing and design rules for tick-based avatar animation at ~12fps (83ms per tick).

## Available Assets (whitebox)

### Eyes (11 variants)
| Asset | Reads as |
|-------|----------|
| `eyes_open_blush` | Neutral open, blush tint |
| `eyes_open_rose` | Open, warm/rose tint |
| `eyes_half_open_blush` | Half-open, blush — intermediate for blink, or concentrated base |
| `eyes_half_open_rose` | Half-open, rose — intermediate for blink on warm/curious |
| `eyes_soft_closed` | Gently closed — blink hold state |
| `eyes_happy_closed` | Closed with joy — playful blink / warm secondary |
| `eyes_excited_squint` | Squinted excitement — playful dominant |
| `eyes_worried_angled` | Angled worry — guarded dominant |
| `eyes_serious_angry` | Hard, locked — stern/angry dominant |
| `eyes_sleepy_flat` | Flat drooped — tired dominant |
| `eyes_teary` | Teary — sad dominant |

**Blink pairs:**
- Blush stances: `eyes_open_blush` ↔ `eyes_half_open_blush` ↔ `eyes_soft_closed`
- Rose stances: `eyes_open_rose` ↔ `eyes_half_open_rose` ↔ `eyes_soft_closed`
- Playful: `eyes_excited_squint` ↔ `eyes_happy_closed` (squint is already mostly closed)
- Focused: `eyes_half_open_blush` ↔ `eyes_soft_closed` (already halfway, 1 frame down)
- Angry/stern: `eyes_serious_angry` → `eyes_soft_closed` (no intermediate, instant tense blink)

### Mouths (10 variants)
| Asset | Reads as | Use for |
|-------|----------|---------|
| `mouth_flat_neutral` | Resting closed | Neutral/focused/tired rest position |
| `mouth_open_flat` | Open, neutral | General speech open, angry open |
| `mouth_soft_smile` | Closed smile | Warm rest position |
| `mouth_tiny_triangle` | Small tight open | Curious/guarded open, tense speech |
| `mouth_cat_smile` | Curved cat smile | Playful rest |
| `mouth_wavy_cat` | Wavy playful | Playful variation |
| `mouth_open_tongue` | Wide open, tongue | Playful excited open |
| `mouth_small_frown` | Downturned | Guarded/sad rest position |
| `mouth_chevron_serious` | Chevron tight | Stern rest position |
| `mouth_pout_loop` | Pout | Angry rest position |

**Speaking open position by stance:**
- Neutral, Alert, Focused, Angry: `mouth_open_flat`
- Warm: `mouth_open_flat` (with soft_smile as rest)
- Playful: `mouth_open_tongue` or `mouth_open_flat`
- Curious: `mouth_open_flat` (with tiny_triangle as rest)
- Guarded: `mouth_tiny_triangle` (barely opens)
- Stern: `mouth_tiny_triangle` (tight, deliberate)
- Tired: `mouth_open_flat` (sluggish, arrives late)
- Sad: `mouth_open_flat` (heavy, reluctant)

### Ears (2 variants)
| Asset | Use |
|-------|-----|
| `ears_style_rounded` | Default for soft/warm/sad/tired stances |
| `ears_style_sharp` | Alert, curious, focused, stern, guarded, angry. Also: all stances during listening except warm/playful/sad/tired |

### Face (2 variants)
| Asset | Use |
|-------|-----|
| `face_fill_blush` | Most stances |
| `face_fill_rose` | Warm, playful, curious — warmer/softer emotional palette |

---

## Disney's 12 Principles — Applied

### 1. Slow In and Slow Out
Movement feels natural when it accelerates into and decelerates out of held positions.

**For blinks**: closing is a fast acceleration (2 frames), holding is a brief stop (1 frame), opening is a slow deceleration (3 frames). Total: 6 frames.

**For speaking**: mouth accelerates open (1-2 frames transition), holds at the vowel (2-3 frames), decelerates closed (1-2 frames).

At 12fps: 2 frames = 166ms (fast), 3 frames = 249ms (noticeable slow).

### 2. Secondary Action
The main action (idle expression, speaking mouth) should be accompanied by a supporting action that adds personality without stealing focus.

**Examples:**
- Ear twitching 2/3 of the way through an idle loop
- Eyes staying slightly more open during speech (engaged)
- A brief happy-close during warm speaking (joy leaks through)

Rule: secondary actions should be 1-3 frames, not draw attention on their own.

### 3. Timing
Frame count = character weight and personality.

| Personality trait | Speaking rhythm | Idle blink frequency |
|-------------------|-----------------|----------------------|
| Alert, urgent | Short vowel holds (2 frames), fast transitions | Very rare (1 blink per 32-tick loop) |
| Warm, expressive | Longer holds (3 frames), smooth | Moderate (blink at tick 8 of 24) |
| Focused, deliberate | Even, controlled | Slow (blink at tick 16 of 32) |
| Tired, sluggish | Long rest before opening, late open | No blink (static) |
| Stern, measured | Extra rest before each phrase | No blink (static) |
| Sad, heavy | Heavy pause before opening, frown returns fast | No blink (static) |
| Playful, energetic | Fast transitions, varied mouth shapes | Joy squish instead of blink |

### 4. Anticipation
A small preparatory action before the main action makes it read more intentionally.

For this avatar system, anticipation is implicit in the half-open blink frames — the eyes begin closing before they're fully closed, so the brain reads "a blink is happening" a frame before it completes.

### 5. Exaggeration
At small avatar scale, subtle differences in expression vanish. Lean into distinct eye/mouth combinations per stance. Don't use the same open-mouth asset for all stances — let the tight `mouth_tiny_triangle` signal guarded/tense, and `mouth_open_tongue` signal playful.

### 6. Appeal
Each stance should be immediately readable at a glance. Avoid expressions that look "in between" two stances — they read as broken, not subtle.

Static stances (guarded, stern, tired, sad) achieve appeal through stillness. Motion on a naturally still face breaks the read.

---

## Blink Timing by Stance

| Stance | Blink position | Intermediate | Total blink frames |
|--------|---------------|--------------|-------------------|
| Neutral | Tick 7 of 32 | `eyes_half_open_blush` | 6 (2+1+3) |
| Warm | Tick 8 of 32 | `eyes_half_open_rose` | 6 (2+1+3) |
| Playful | Tick 9-10 of 24 | `eyes_happy_closed` acts as blink | 2 |
| Curious | Tick 8 of 32 | `eyes_half_open_rose` | 6 (2+1+3) |
| Alert | Tick 24 of 32 | `eyes_half_open_rose` | 4 (1+1+2) — very brief |
| Focused | Tick 16 of 32 | (already half-open, 1 frame close) | 4 (1+1+2) |
| Angry | Tick 20 of 24 | None — instant tense blink | 1 |
| Guarded | None | — | Static |
| Stern | None | — | Static |
| Tired | None | — | Static |
| Sad | None | — | Static |

---

## Speaking Rhythm Patterns

**Standard (neutral, alert):**
```
rest rest | open open open | rest rest | open open | rest rest
```
Uneven phrase lengths. 3-frame vowel holds.

**Expressive (warm, playful):**
```
rest | open open open | secondary | open open | rest
```
Faster pace, secondary action mid-speech (happy close for warm, excited squint for playful).

**Restrained (guarded, stern):**
```
rest rest rest rest | tiny-open tiny-open | rest rest | tiny-open | rest rest
```
More rest than open. Mouth barely parts.

**Sluggish (tired):**
```
rest rest rest rest rest rest rest rest rest | open open open
```
8 frames rest before the mouth opens at all. Heavy reluctance.

**Heavy (sad):**
```
rest rest rest rest | open open open | rest rest rest rest
```
Opens late, closes fast, then sits in long rest.

---

## Idle Loop Structure

```
[base frames] → [blink 6 frames] → [base frames] → [secondary action 2 frames] → [base frames]
```

Positioning:
- Blink: ~1/4 into the loop (tick 7-8 of 32)
- Secondary action: ~2/3 into the loop (tick 19-22 of 32)
- Both positions should feel irregular — not exactly at the midpoint or end

Total loop length: 24 for playful/energetic, 32 for most stances.

---

## Sources

- Disney's 12 Principles of Animation (Johnston & Thomas, 1981)
- Programming natural idle character animations — dev.to
- Sprite animation frame timing — sprite-ai.art
- Breathing life into idle animations — AnimSchool Blog
- Duolingo character animation with Rive — dev.to
