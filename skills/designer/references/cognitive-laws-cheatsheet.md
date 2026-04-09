# Cognitive Design Laws

> Source: Laws of UX (lawsofux.com), Nielsen Norman Group, Smashing Magazine - primary research
> Core insight: These are not opinions. They are empirically documented facts about human cognition that constrain every UI decision.

---

## Fitts' Law

**Formula:** `T = a + b * log2(2D/W)`
- T = movement time (ms), D = distance to target center, W = width of target along movement axis
- a, b = empirical constants (higher for touch than mouse)

**Key insight:** Halving the distance is worth more than doubling the size (logarithmic returns on size vs compounding benefit on distance).

**UI Applications:**
- Touch targets must be physically >= **44pt (iOS) / 48dp (Android) / 44px (WCAG 2.5.5)**
- Screen edges are **infinite targets for mouse** — cursor cannot overshoot. macOS menu bar at top edge is correct Fitts' implementation. Windows taskbar at bottom.
- Screen edges are the **hardest on touch** — thumbs rest center-bottom. Never put critical CTAs at screen edges on mobile.
- Place submit CTA at **bottom of its form** — pointer/finger is already near the last field. Top-placed submit = maximum travel distance.
- Pie/radial menus > linear menus — all options equidistant from trigger point
- **Increase padding without increasing visible border** — users won't slow down for invisible hit-area expansion

**Violations:**
- Icon-only buttons where visual footprint (16px) != tap target (needs 44px)
- Destructive actions adjacent to safe actions with < 8px gap (Delete beside Save)
- Form submit buttons at page top on mobile (maximum travel distance)
- Tool palettes with zero gap between minimum-size items

---

## Hick's Law

**Formula:** `RT = a + b * log2(n + 1)`
- RT = reaction/decision time, n = equally probable alternatives, +1 = "no response" option

**Key insight:** Going from 2→4 choices costs far more than 20→22. The first few added choices are the most expensive. The relationship is logarithmic — each doubling of options adds a constant time.

**UI Applications:**
- Minimize choices at **irreversible decision points** (checkout, delete confirm, first-time onboarding)
- Decompose multi-step tasks into **single-decision screens** — wizard pattern exists because of Hick's Law
- **Surface a recommended option** to short-circuit the decision tree (Spotify Daily Mix, Netflix autoplay)
- **Progressive disclosure:** expose features incrementally, not all at once
- Google homepage = canonical n=1: one input, one button

**Critical distinction:** Hick's Law applies to **decisions**, not **recognition**. A 15-item nav with clear categories is fine because users scan/recognize, not memorize. A 15-option modal dialog is not fine — users must evaluate each option.

**Violations:**
- SaaS onboarding showing all features on first login
- Pricing tiers with no recommended plan highlighted
- Dropdowns with 50+ unsorted options (should be searchable)
- Settings pages with every toggle visible at once (should be grouped)

---

## Miller's Law

**Formula:** Working memory holds **7 +/- 2 chunks** (Miller 1956). Nelson Cowan 2001 revised to **4 +/- 1** for pure memory without rehearsal.

**Key insight:** The unit is a **chunk**, not an item. "19195552743" = 11 items; "(919) 555-2743" = 3 chunks. Same information, 73% lower cognitive load. Chunking is the single most powerful tool for managing complexity.

**UI Applications:**
- **Auto-chunk** phone numbers and card numbers as user types — never require manual formatting
- Group form fields into visual sections of **<= 5 fields each**
- Navigation: **<= 7 primary items** for unstructured lists; group if exceeding 9
- Onboarding: never show **> 5-7 sequential steps** without a checkpoint
- Error messages: prioritize and show **first 3-5**, never stack 10+
- Dashboard widgets: **group related metrics** together

**Violations:**
- Flat navigation with 12+ items, no visual grouping
- IBAN/reference codes displayed as unbroken strings
- Long settings page with 20+ ungrouped controls

---

## Gestalt Principles

**Hierarchy of strength:** Proximity > Similarity > Closure > Continuity > Common Fate

### Proximity (strongest)
Items closer together are perceived as the same group — **overrides color, size, and shape**.

**Application:** Form label-to-input gap (4-8px) must be tighter than input-to-next-label gap (16-24px). Equal spacing destroys form structure. A "Delete" button 4px from "Save" will be accidentally perceived as related and tapped.

### Similarity
Elements sharing visual properties (color, shape, size, style) are perceived as related.

**Application:** All links must share one consistent treatment. All error states share red + icon. Break similarity = break comprehension. Primary and secondary buttons at similar visual weight = users can't identify the main action.

### Closure
The brain completes incomplete shapes.

**Application:** A partial card at viewport bottom = "more content below" (deliberate scroll hook). Skeleton loading screens use incomplete shapes the brain fills in. 3 visible card borders, 1 implied = less visual noise.

### Continuity
The eye follows implied paths (lines, curves, alignments).

**Application:** Vertical form alignment creates single-column flow. Zigzag alternating image/text layouts force re-orientation. NNG eyetracking confirmed users stumbled significantly on zigzag vs linear layouts.

### Common Fate
Elements moving together (same direction, speed, timing) are perceived as grouped.

**Application:** All skeleton placeholders pulse at **identical timing** — offset timing reads as separate blocks. Selected items in multi-select animate together at identical speed.

---

## Von Restorff Effect (Isolation Effect)

**Rule:** When multiple similar objects are present, the one that **differs most** is remembered and acted upon first.

**Key insight:** If three items are all highlighted, isolation cancels out. **ONE primary CTA per view.**

**UI Applications:**
- **One primary CTA per view** differentiated from everything else. Multiple highlighted CTAs cancel each other.
- Notification badges: red dot on app icons is pure Von Restorff — the only red circle in a monochromatic UI
- Pricing tables: recommended plan gets different background, elevation, or scale — **only one plan, never two**
- Error states visually deviate from all other UI elements (color + icon + weight)

**Violations:**
- Multiple CTAs styled as "highlighted" (they cancel each other out)
- Animation overuse: if 6 elements animate on load, none is isolated
- Banner blindness: promotional elements styled like highlighted features get ignored

---

## Serial Position Effect

**Rule:** Items at the **start** (primacy — encoded into long-term memory) and **end** (recency — still in active working memory) of a sequence are remembered most. Middle items have highest forgetting rates.

**UI Applications:**
- **Navigation: first and last positions are premium real estate.** Apple: logo left-most, Help right-most. Amazon: logo left, cart+account right.
- Pricing tables: recommended plan first or last, never second of three — and still needs Von Restorff differentiation
- Onboarding: put highest-value "aha moment" **early** (primacy shapes overall impression). Put highest-friction step (payment) **at the end** (recency reduces abandonment anxiety)
- Form fields: lead with easy low-friction fields (name, email). Put hard fields (tax ID, legal name) in the middle

---

## F-Pattern (NNG — 232 users + replications, 1.5M fixations)

**Trigger:** Dense text without visual formatting, low-motivation scanning.

**The pattern:**
1. Horizontal sweep across top
2. Shorter horizontal sweep lower down
3. Vertical scan down left side only

**Key stats:**
- Right side of text-heavy pages receives **near-zero attention**
- Users read **~28% of words** per page visit
- Words at line beginnings receive **3-5x more fixation** than line ends
- **80% of viewing time on left half** of page (NNG)

**Design response:**
- **Front-load sentences:** "Users prefer larger targets" beats "When considering interface design..."
- Nav link text leads with distinguishing word: "Billing settings" not "Settings for billing"
- Add H2/H3 subheadings **every 200-300 words** to break into layer-cake pattern (most effective pattern)

---

## Z-Pattern

**Trigger:** Low-text landing/marketing pages with heavy visuals and clear conversion goal.

**Eye path:** top-left → top-right → diagonal → bottom-right (CTA terminal point)

**Layout:** Logo top-left. Trust signals top-right. Supporting copy bottom-left. **Primary CTA bottom-right** (the terminal action point).

Works for hero sections with < 50 words. Too much text triggers F-pattern instead.

---

## Jakob's Law

**Rule:** "Users spend most of their time on *other* websites. They prefer your site to work the same way as all the sites they already know." — Jakob Nielsen

**UI Applications:**
- Primary navigation: top bar (desktop) or bottom tab (mobile). Right sidebar or hamburger on desktop creates friction.
- Radio buttons = single-select. Checkboxes = multi-select. Toggles = binary. **Never swap these.**
- Blue underlined text = link. 30-year convention. Removing underlines reduces click rates 10-15% (NNG).
- Shopping cart icon top-right — every e-commerce site. Moving it costs discoverability.
- Password visibility toggle (eye icon): a 2015+ convention users now expect.

**Change management:** When redesigning, provide **preview + opt-in + revert** (YouTube M3 rollout). Forced overnight redesigns cause revolt (Snapchat 2018: lost 3M+ users).

---

## Doherty Threshold

**Rule (IBM 1982):** Productivity soars when response time < 400ms.

**Perception thresholds:**

| Latency | Perception |
|---|---|
| < 100ms | Feels instantaneous — direct manipulation |
| 100-400ms | Feels immediate — slight delay, user stays engaged |
| 400ms-1s | **Flow breaks** — users disengage, begin secondary task |
| > 1s | Abandonment begins rising sharply |
| > 10s | Users abandon (NNG) |

**UI Applications:**
- **Optimistic UI:** Update immediately, fire API in background, rollback on failure. GitHub stars, Twitter likes, Instagram hearts all work this way.
- Skeleton screens outperform spinners for **perceived** speed at identical actual load time
- Search autocomplete must appear within **300ms** to feel predictive
- Keystroke-to-display must be **< 50ms** — React apps re-rendering on every keystroke without debounce create perceptible lag
- **Intentional artificial delays** on instant operations increase perceived quality ("Calculating..." before instant result — LinkedIn uses this deliberately)

---

## Peak-End Rule

**Rule (Kahneman 1993):** Remembered experience = average of (most intense moment + final moment). **Duration neglect:** longer experiences are NOT rated better.

**Evidence:** Cold water study — 60s at 14°C rated more negatively than 60s at 14°C + 30s at 15°C (slightly better end). The end dominated memory despite longer total discomfort.

**UI Applications:**
- **Order confirmation = peak AND end.** Mailchimp's illustrated "High Five" celebration made a boring admin screen a memorable brand moment. Treat it as a brand investment.
- **Onboarding completion = peak.** Slack's pre-populated channel with first message = immediate evidence of value
- **Error recovery = peak management.** Stripe's specific, helpful error messages turn a negative peak into a trust-building moment
- **Offboarding:** A no-friction cancellation with genuine "We'll miss you" creates a less negative end than a dark-pattern 5-step process. Negative offboarding end drives negative word-of-mouth.

---

## Cross-Law Interactions

These laws compose and sometimes conflict. The interactions matter:

**Hick's + Serial Position on navigation:** Fewer primary items (Hick) + important items at first/last positions (Serial Position) = fewer, well-placed items. Never more than 7, most important at edges.

**Fitts' + Von Restorff on CTAs:** Large (Fitts) + visually isolated (Von Restorff) = compound positive. A large, distinctly colored button satisfies both simultaneously.

**Doherty + Peak-End on loading:** If load takes 3s, design the *reveal* as a positive peak — animated content appearing, not content suddenly popping in.

**Hick's vs Progressive Disclosure:** Hiding too many features violates discoverability. Showing too many violates Hick's. The balance: features used by < 20% of users get hidden. Features used by 80%+ stay visible.

---

## When to Apply Which Law

| Product Type | Laws to Consult | Why |
|---|---|---|
| **Any UI** | Fitts (touch targets), Jakob (conventions), Peak-End (completion screens) | Universal constraints |
| **Multi-choice** | Hick (reduce options), Von Restorff (isolate primary) | Decision reduction |
| **Data-heavy** | Miller (chunking), Gestalt (grouping) | Cognitive load management |
| **Landing page** | Von Restorff (CTA isolation), Serial Position (section order), Z-Pattern (layout) | Conversion optimization |
| **Content page** | F-Pattern (reading direction), Doherty (perceived speed) | Reading behavior |
| **Marketing** | Z-Pattern (eye path), Peak-End (conversion moments) | Attention direction |
| **Forms** | Gestalt (proximity), Hick (progressive steps), Miller (field grouping) | Completion optimization |
| **E-commerce** | Fitts (buy button), Doherty (instant cart), Peak-End (order confirmation) | Transaction completion |
