# Visual Composition Theory

> Source: NNG (1.5M eyetracking fixations, 57,453 fold fixations), A List Apart, Smashing Magazine
> Core insight: Mathematical alignment is a starting point. The eye overrides the math.

---

## Visual Hierarchy — The 6 Levers

**Define the hierarchy before opening a design tool.** Rank every element 1-N by importance. Then assign levers in this priority order:

### 1. Size (Scale) — Strongest, fastest signal

Bigger = more important. Never create two elements at equal size for different priority levels — they compete and neither wins.

NNG recommends max **3 size variations** in a design: body (14-16px), subheader (18-22px), header (up to 32px). More than 3 creates noise.

### 2. Contrast — Independent from color

Dark on light reads regardless of colorblindness. **The squint test:** blur your design 5-10px. If the primary action isn't the first thing you see blurred, the hierarchy is broken.

Max **3 contrast variations** in complex designs. Timid contrast (slightly larger, slightly bolder) reads as a **mistake**, not a decision. If two things are different, make them VERY different.

### 3. Color — Attracts but cannot stand alone

Warm saturated colors advance; cool muted tones recede. Reserve red **exclusively** for destructive actions/errors. Limit working palette to 2 primary + 2 secondary for information design.

Color affects 8% of males with colorblindness. Never the sole indicator of anything.

### 4. Typography — Weight is the primary signal

Bold vs regular is the strongest intra-size hierarchy. All-caps in small sizes signals metadata/labels.

**The trap:** Using too many weight/size/color changes simultaneously. If everything is emphasized, nothing is.

### 5. Spacing — First-resort grouping tool

Decreased spacing unites. Increased spacing separates. **An element with more surrounding space receives more attention** — whitespace functions as a spotlight.

Use spacing before reaching for borders or fills.

### 6. Position — Top-left receives most attention

F-pattern: top-left starts the scan. The **optical center** sits slightly above mathematical center — content at true mathematical center feels low. Raise hero content by 5-8% of viewport height.

---

## CRAP Principles (Contrast, Repetition, Alignment, Proximity)

### Contrast
Not just color. Operates on size, weight, spacing, and position.

**Failure mode:** "Same-same" design — equal-weight text blocks, equal spacing everywhere, navigation and body at identical weight.

**Rule:** If two elements are not the same, make them **VERY** different. Timid contrast reads as mistake.

### Repetition
Consistency creates implicit comprehension rules. When links are always blue underlined, users stop thinking about what's interactive.

**Failure mode:** Three different button treatments, four shades of gray without semantic intent.

### Alignment
Everything should have a visual connection to something else. Left-aligning everything is the simplest valid system.

**Critical error:** "Center-everything" on text-heavy pages. Centered multi-line paragraphs are slower to read because each line starts in a different position. Reserve centered alignment for isolated short elements: display headlines, single-line labels, modal titles.

### Proximity
"Elements closer to each other than to surrounding items are perceived as related."

**Failure mode:** Equal spacing between all elements regardless of relationship.

| Context | Gap |
|---|---|
| Label to its input | 4-8px |
| Between form groups | 24-32px |
| Between major sections | 48-96px |

Same gap for all = invisible structure.

---

## Whitespace — Micro vs Macro

### Micro whitespace
Between letters (tracking), between lines (leading), between label and input, between list items. **Governs readability.**

Increasing line-height from 1.2 to 1.5 for body text demonstrably improves reading speed and comprehension. Spiekermann's Economist redesign: increased character spacing and leading → more legible without reducing word count.

### Macro whitespace
Between major sections, around hero elements, page margins. **Governs perceived value and information density.**

- **Luxury brands** (Apple, Rolex) use generous macro whitespace as a signal of quality and confidence
- **Crowded layouts** read as "affordable" and "high volume"
- This is not aesthetic preference — it's a measurable signal that users decode unconsciously

### Active whitespace
Strategic, not accidental. An element surrounded by more space than its neighbors receives more attention — the emptiness functions as a **spotlight**. Apple isolates product images this way. The whitespace is doing work.

### Passive whitespace
Structural: margins, padding, leading. Defaulting to cramped layouts is not neutral — it signals low value.

### Implementation
Use spacing in ratios. 4px or 8px base unit with scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. All spacing relationships have mathematical coherence.

---

## The Fold (NNG Data — 57,453 fixations)

### The numbers
- Content above fold: **102% more views** than immediately below
- Top half of viewport: **> 65% of viewing time** within above-fold zone
- Above-fold ads: 73% viewability vs 44% below-fold (Google)
- **57% of viewing time above fold** (down from 80% in 2010 — users scroll more, but conditionally)
- Aggregate: ~84% attention difference above vs below

### The illusion of completeness
When a hero fills the entire viewport with no content peeking below, many users assume the page is complete and leave.

Patterns that cause this:
- Full-viewport video with no overflow
- Hard horizontal rule at fold position
- Large gap that reads as page-end

### Rules from research
1. Place primary value proposition and CTA above fold on all standard viewports
2. **Never fill the exact viewport height** — bleed at least 40-80px of next section into view
3. The fold is a threshold requiring a "promise" of value to motivate scroll
4. Scrolling behavior is conditioned by the first 100px. If those 100px aren't relevant, users leave.

---

## Reading Patterns (NNG 1.5M fixations)

### F-Pattern
**Trigger:** Dense text without visual formatting, low-motivation scanning.

Horizontal sweep top → shorter sweep lower → vertical scan down left side only. Right side receives near-zero attention. Users read ~28% of words.

**Response:** Front-load sentences. Key word first in every line. Nav links lead with distinguishing word.

### Layer-Cake Pattern (most effective)
**Trigger:** Content with clear subheadings every 200-300 words.

Users scan headings only, read body beneath headings that match intent. NNG: "by far the most effective" for comprehension/efficiency balance.

**Response:** Headings must be **meaningful summaries**, not labels. "Overview" is a label. "Users abandon checkout at address validation" is a summary.

### Z-Pattern
**Trigger:** Sparse pages — logo top-left, nav top-right, headline bottom-left, CTA bottom-right.

The Z terminal point is the action point. Works for < 50 words.

### Spotted Pattern
**Trigger:** Users scanning for specific information (prices, dates, phone numbers).

**Response:** Format scannable information with distinct visual treatment.

### Key stat
Users spend **80% of page-viewing time on the left half** (NNG). Horizontal attention is deeply asymmetric.

---

## Visual Weight and Balance

Weight emerges from interaction of multiple factors (never single-factor):

| Factor | More Weight |
|---|---|
| Color temperature | Warm hues (red heaviest, yellow lightest) |
| Value | Dark on light backgrounds |
| Size | Larger, but not linearly |
| Position | Higher on page, optical center (above mathematical) |
| Density | Clustered elements outweigh sum of parts |
| Isolation | More surrounding whitespace = more weight (spotlight effect) |

**Visual direction:** Shapes with axes (arrows, triangles, diagonals) direct the eye. Human faces and gazes direct toward whatever the subject looks at — place copy in the direction a subject's gaze points.

**Asymmetric balance:** A large, light element on one side balanced by a small, dark element on the other. More visually interesting than symmetry. More dynamic. More human.

---

## Grid Theory

### Column grid (most common)
12-column dominant because it divides evenly by 1, 2, 3, 4, 6, and 12.

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Columns | 12 | 8 | 4 |
| Gutters | 24px | 16px | 16px |
| Outer margins | 48-64px | 32px | 20px |

### Baseline grid (makes layouts feel "tight")
All vertical spacing aligned to a horizontal rhythm unit. **8px is standard.** Line heights become 16, 24, 32, 40px. Margins become 8, 16, 24, 32px. The font size need not be a multiple; its **line-height must be**.

### Column span guide

| Width | Columns | Use |
|---|---|---|
| Full | 12/12 | Hero, full-bleed |
| Wide | 10/12 | Most content |
| Standard | 8/12 | Forms, articles |
| Narrow | 6/12 | Cards, tiles |
| Sidebar | 4/12 | Auxiliary |
| Widget | 3/12 | Stats, micro-cards |

### When to use each grid type
- **Manuscript** (single column): editorial, blogs, reading-focused
- **Column**: general web layout, most projects
- **Modular** (columns + rows): dashboards with mixed card sizes
- **Baseline**: always, alongside column grid. The grid that makes layouts feel considered.

**Practical rule:** Start with column grid + baseline grid. Add modular only for heterogeneous content blocks.

---

## Optical Alignment vs Mathematical Alignment

Mathematical centering places the geometric center at the container center. Optical centering places the **visual** center. They are frequently different, and the difference is perceptible.

### Specific corrections

| Element | Correction | Why |
|---|---|---|
| Icons in buttons | 1-2px **upward** offset | Visual weight sits below geometric center |
| Text in buttons | 1-2px more **bottom** padding than top | Text feels optically centered with more bottom space |
| Type in circular badges | 1px **upward** offset | Ascender weight sits above geometric centerline |
| Hero headlines | Raise **5-8%** above mathematical center | Optical center sits above mathematical center |
| Display type | Enable `font-kerning: normal`, manually kern AV/WA/To at 36px+ | Auto-kerning insufficient at display sizes |
| Circles vs squares | Circle must be **physically larger** to appear same size | Keyline circles extend beyond square boundary (see icon grid specs) |

**The general rule:** Mathematical alignment is a starting point, never the finish. It almost always needs **upward adjustment** — we perceive the lower half of any container as heavier.

---

## Golden Ratio (phi = 1.618) — What It Actually Does

**Concrete value:**
- Type scale: 16px * 1.618 = ~26px heading (harmonious)
- Layout: 61.8% main : 38.2% sidebar on 1200px = 741px : 459px (useful starting constraint)
- Line height: 16px * 1.618 = ~26px (reasonable starting point)

**Where it's mythology:**
- Responsive layouts break phi-based fixed proportions
- Average ratio between headline and body on top design blogs ≈ 2.5, not 1.618
- A golden-ratio sidebar at 38.2% collapses to useless width at 375px viewport

**Verdict:** Use as a starting ratio for type scales and initial layout sketches. A reasonable default, not a rule. A List Apart: modular scales are "a tool, not magic." Rounding and improvisation expected.

---

## Rule of Thirds

Divide composition into 3x3 grid. Place interest at intersections, not center.

**In hero sections:** Headline on left-vertical third. CTA at lower-left intersection. Focal image on right third. Creates asymmetric tension + aligns with F-pattern.

**In image cropping:** Subject's eyes at upper-left intersection reads more powerfully than centered.

**When to break it:** Dense data UIs need mathematical grid alignment, not compositional balance. Rule of thirds is for visual/marketing surfaces only.
