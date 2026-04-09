# UX Writing & Microcopy

> Source: Mailchimp Content Style Guide, NNG error rubric + placeholder research, GOV.UK content design,
>   Copyhackers (Joanna Wiebe), Microsoft inclusive design, ContentVerve A/B tests, Samuel Hulick (UserOnboard)
> Core insight: Words are 50% of the interface. A perfectly designed button with "Submit" loses to a mediocre button that says "Get started free."

---

## Button Labels

### First-person vs second-person (ContentVerve)
"Start **my** free 30-day trial" outperformed "Start **your** free 30-day trial" by **90%** in click-through rate.

**Mechanism:** Endowment effect — first-person language makes users mentally take ownership before clicking.

### Verb choice hierarchy
Benefit-oriented verbs (get, start, discover, claim, unlock) consistently outperform obligation-oriented verbs (submit, register, sign up). The framing shifts from what the user must *do* to what the user will *receive*.

### Joanna Wiebe's CTA principle (Copyhackers)
Rewrite every button from the user's perspective. Imagine their internal thought before clicking and make the button complete that thought. "Learn More" loses to "Send me the free guide" because the latter mirrors the user's actual mental state.

### Specifics that work

| Pattern | Evidence |
|---|---|
| Verb + object: "Download report", "Add to cart" | Universal best practice |
| Single CTA per screen | +266% conversions (WiserNotify) |
| Front-load the verb | Users scan first word. "Save changes" not "Changes will be saved" |
| Personalized CTAs | Convert 202% better than generic (HubSpot) |
| CTA above fold + prominent | +304% conversion (ContentVerve) |
| "No credit card required" near CTA | +34% trial signups |

### Anti-patterns
- "Click here" — meaningless out of context, bad for screen readers
- "Submit" — obligation framing, zero benefit signal
- "OK" — ambiguous on confirmation dialogs
- "Yes/No" on confirmations — forces user to re-read the question
- "Learn More" as primary CTA — passive, no commitment

---

## Voice & Tone (Mailchimp System)

### Four voice dimensions (constant, never change)
1. **Plainspoken** — strip away fluffy language and emotional manipulation; clarity above all
2. **Genuine** — speak in a familiar, warm, accessible way rooted in understanding
3. **Translators** — demystify complex concepts at expert level without dumbing down
4. **Dry humor** — straight-faced, subtle, a touch eccentric; prefer winking to shouting

### Five writing goals
Empower, Respect, Educate, Guide, Speak Truth. Content must be simultaneously Clear, Useful, Friendly, and Appropriate.

### Tone adjustment
Tone (variable) differs from voice (constant). Ask: "Consider the reader's state of mind. Are they relieved? Confused?" Adjust accordingly.

**"It's always more important to be clear than entertaining."**

### Humor boundaries
- Funny when it comes naturally. "Forced humor can be worse than none."
- "Weird but not inappropriate, smart but not snobbish"
- When uncertain, keep a straight face
- Never condescending or exclusive

### The golden rule
Active voice, positive framing. "You can edit your profile" not "Your profile can be edited." Say what users CAN do, not what they can't.

---

## Plain Language (GOV.UK — The Gold Standard)

### Specific, measurable rules

| Rule | Target |
|---|---|
| Reading age | **9 years old** (~5,000 common words learned by age 9) |
| Sentence length | **25 words maximum** |
| Paragraph length | **5 sentences maximum** |
| Title length | **65 characters or less** (including spaces) |
| Meta summary | **160 characters** |

### Research backing
Even high-literacy expert users prefer plain language — **80% of people** prefer sentences written in clear English. Block capitals are **13-18% harder** to read. Low-literacy users read word-by-word with narrower visual fields and abandon searches more readily.

### Word replacements

| Use | Instead of |
|---|---|
| buy | purchase |
| help | assist |
| about | approximately |
| start | commence |
| need | require |
| end | terminate |
| use | utilize |
| get | obtain |
| ask | enquire |
| tell | inform |

Use contractions ("you'll") but avoid negative contractions ("can't" → "cannot").

Active voice mandatory. Form titles: active verb ("Submit your expenses"). Guidance titles: present participle ("Submitting your expenses").

---

## Error Messages (NNG Rubric + GOV.UK + Stripe)

### NNG's three dimensions, 12 guidelines

| Dimension | What It Covers |
|---|---|
| **Visibility** | Adjacent placement, 3+ error indicators (WCAG), severity-based presentation, no premature display |
| **Communication** | Grade 7-8 reading, precise problem description, actionable solutions, system-blaming tone |
| **Efficiency** | Safeguard against likely mistakes, preserve input, offer high-probability fixes, contextual help |

**Grading:** A (3.3-4.0) = top-tier. D (1.5-) = significant deficiencies.
- Craigslist: **D (2.08)** — terse messages, cleared input, blamed user
- J.Crew: **A (3.67)** — clear styling, preserved input, context

### Error message structure
**What happened + Why + How to fix it.**

| Good | Bad |
|---|---|
| "That email is already registered. Try signing in instead, or use a different email." | "Error 403" |
| "Your bank declined this charge. No payment was made. Try a different card." | "Invalid input" |
| "Enter a valid phone number, like (555) 123-4567" | "You entered the wrong password" |
| "Passwords must be at least 8 characters with one number" | "Something went wrong" |

### GOV.UK error standards
- Write in plain English: "Enter your full name" not "Field required"
- Avoid: "invalid," "forbidden," "please," "sorry," technical codes
- Hidden "Error:" prefix for screen readers
- Inline + summary at top of page — **wording must be identical in both**
- **Never clear user's input**

### Stripe error standards
- Parameter-specific: "Card number is incomplete" not "Invalid input"
- Attribute bank failures: "Your bank declined. No payment was made."
- Suggest next step: "Try reentering your card number" or "Use a different card"
- Real-time format validation surfaces errors before submission

### Universal rules
- Never rely on color alone (use icons, borders, labels)
- Positive framing: describe what to do, not what went wrong
- Never blame the user. The system failed, not the person.
- Validate on **blur** (field exit), not on input (interrupts typing)
- Exception: validate in real-time **only when correcting an existing error** ("reward early, punish late")
- Remove error state immediately when input becomes valid

### Hostile patterns (NNG)
ALL CAPS errors, red-only indicators, generic "Something went wrong" with no next step, errors that auto-dismiss before user finishes reading

---

## Placeholder Text (NNG Research)

**Placeholders are harmful. NNG's specific findings:**
1. Users forget what was asked once they start typing (memory burden)
2. Impossible to verify responses without visible labels
3. Some users mistake placeholder for a pre-filled default and skip entirely
4. Low-contrast gray text fails accessibility standards
5. Disappearing text forces reliance on short-term memory

**Recommendation is absolute:** Never use placeholder as label replacement. Always use persistent, visible labels.

**Acceptable use:** Format hints only. "MM/DD/YYYY", "e.g., jane@company.com". Keep short.

**Floating labels** are a compromise — they solve disappearing-label problem but introduce tiny, hard-to-read text. Prefer visible label above + hint below when space permits.

---

## Conversion Copy (Copyhackers — Joanna Wiebe)

### Voice-of-Customer research
Interview 5-10 customers for 60 minutes each. Mine support tickets. Use their **exact language** in copy. This is "an unfair advantage" because you're using words users already think in.

### Every line has one job
After each sentence: "Does this give the reader a reason to keep going?" If not, cut it.

### Headlines do 80% of the work
Incorporate concrete details (numbers, timeframes). The Specificity Rule:
- "We generated 143 qualified leads for a London agency in 12 months" **beats**
- "We help you grow your business"

### Numbers and social proof
- **Specific numbers signal authenticity.** "3,600 panelists" beats "many participants"
- **Odd numbers feel more real.** "143 leads" beats "150 leads" (round feels fabricated)
- Duolingo: "45.6M learners for Spanish" (precise, impressive)
- GOV.UK: spell out one through nine, digits for 10+
- Low-numeracy: "4 out of 5" more accessible than "80%"

### The "so what?" test
After every claim, ask "so what?" from user's perspective. If the answer isn't obvious, the copy fails. Benefit-driven beats feature-driven because users care about outcomes, not capabilities.

---

## Confirmation Dialogs

### Kill "Are you sure?"
NNG: confirmation dialogs fail when overused because users develop automatic "Yes" responses. "If you warn people too much, they stop paying attention."

### Structure
- **Title** = the action as a question: "Delete this project?"
- **Body** = consequences with specifics: "This will permanently delete 'Q4 Marketing' and its 12,847 subscribers. This cannot be undone."
- **Buttons** = specific verbs: "Delete project" / "Keep project" — never "OK" / "Cancel"

### Five patterns for destructive actions (strongest → weakest)

| Pattern | When | Example |
|---|---|---|
| **Typing confirmation** | Critical irreversible | MailChimp: type "DELETE" + shows list name + count |
| **Undo over confirmation** | Most cases (NNG recommended) | Gmail: "Conversation deleted. Undo." |
| **Consequence description** | When impact must be clear | "Delete 'Q4 Marketing' and 12,847 subscribers" |
| **Cooling period** | High-value transactions | Animated info reveal + progress bar during order |
| **Two-person approval** | Highest stakes | GitHub PR approval, banking second-sign |

### Destructive styling
- Red button for destructive option
- Default focus on Cancel (safe option)
- Maximum distance between confirm and cancel

---

## Inclusive Language (Microsoft Guidelines)

### Gender-neutral patterns
Never use he/him/his/she/her/hers in generic references. Three rewrites:
1. Use "you"
2. Use plural noun + pronoun
3. Replace pronoun with "the"/"a"

Use "they/their" for singular generic references.

### Term replacements

| Use | Instead of |
|---|---|
| chair, moderator | chairman |
| humanity, people | mankind |
| workforce, staff | manpower |
| synthetic, manufactured | manmade |
| primary, subordinate | master, slave |
| allowlist, blocklist | whitelist, blacklist |

### Input-agnostic verbs
- "select" instead of "click" (accounts for keyboard, screen reader, touch)
- "go to" instead of "navigate to"
- "choose" instead of "pick" or "click on"

---

## Headlines for UI

| Rule | Rationale |
|---|---|
| Front-load keywords | Users scan first 2-3 words only |
| Sentence case | Title Case Feels Like Marketing. Material, Carbon, Atlassian default sentence case. |
| Under 8 words | Subheadings fit one line on mobile |
| Be specific, not clever | "3 items in your cart" beats "Almost there!" |
| Match mental model | Clicked "Billing" → heading is "Billing", not "Manage your subscription preferences" |

### The Copyhackers specificity rule
Incorporate concrete details: "143 qualified leads in 12 months" > "We help you grow"

---

## Loading State Copy

| Duration | Pattern | Example |
|---|---|---|
| < 2s | Spinner only | Text disappears before readable |
| 2-10s | Verb + ellipsis | "Saving...", "Uploading..." |
| 10s+ | Progressive with count | "Uploading (3 of 12 files)..." |
| Unknown long | Time estimate | "Processing — this may take a minute" |

- Present participle: "Saving..." not "Save in progress"
- Match verb to action: "Export" click → "Exporting..." not "Loading..."

---

## Empty States

**Every empty state is an onboarding moment.**

### Structure
Headline (what's missing) + Supporting copy (what happens next) + Single CTA + Illustration (optional)

### Four types, four tones

| Type | Tone | Example |
|---|---|---|
| First use | Encouraging + instructive | "No projects yet. Create your first to get started." |
| User-cleared | Congratulatory | "All caught up!" |
| No results | Helpful | "No results for 'xyz'. Try a different search term." |
| Error state | Honest + recoverable | "Something went wrong loading your data. Try refreshing." |

### Rules
- 2-3 sentences max
- Never a blank screen with no explanation
- Empty states with a CTA are the **primary vector for feature adoption**
- The CTA should be the single most helpful next action

---

## Tooltips & Help Text

- Users read tooltips **after confusion**, not proactively. Prevent confusion with clear labels first.
- **One sentence, one idea.** If it needs a paragraph → help doc, not tooltip.
- Help text below fields > tooltips — always visible, no hover required, accessible by default
- Never put critical information in a tooltip — if required to complete the task, it's in the UI
- Icon choice: `(i)` for supplementary info, `(?)` for "what is this?"
- **Mobile: tooltips are hostile.** Hover doesn't exist on touch. Use inline help or expandable sections.

---

## The Hemingway Principle — Readability Evidence

| Source | Reading Level |
|---|---|
| GOV.UK | Grade 4 (age 9) |
| NNG error messages | Grade 7-8 |
| Copyhackers conversion copy | Grade 6 |
| Flesch Reading Ease general | 60-70 |

**Evidence:** Morkes and Nielsen (1997): "extremely scannable" text with bullets, bold keywords, and headings helped users complete tasks faster with fewer errors. Screen reading incurs **20-30% performance deficit** vs paper (Dillon 1992) — web text must compensate by being substantially simpler.

**Critical caveat:** Readability scores (Flesch-Kincaid, Gunning Fog) measure only word length and sentence length. They ignore formatting, hierarchy, whitespace, and IA. A wall of Grade 6 text is harder to read than well-formatted Grade 10 text. **Scores are necessary but not sufficient.**

Active voice, short sentences, common words — not style preferences but measurable performance factors.
