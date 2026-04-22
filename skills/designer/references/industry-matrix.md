# Industry Design Rules Matrix

> Source: ui-ux-pro-max ui-reasoning.csv (161 industry-specific rules), awesome-design-md (58 companies)
> Core insight: Banking != gaming != healthcare. Industry context is the hardest design constraint. A playful banking app loses trust. A conservative gaming site loses engagement.

---

## How to Use This Reference

1. Identify the industry from the product description
2. Look up the primary and secondary style
3. Check must-have features (these are non-negotiable)
4. Check never-use elements (these will actively harm the product)
5. Use the color mood as the starting direction for palette selection
6. Cross-reference with `designer_get_anti_patterns(industry: ...)` for detailed violations

---

## SaaS (General)

**Style:** Glassmorphism + Flat | Secondary: Soft UI
**Emotional Target:** Trustworthy
**Color Mood:** Trust blue + single accent contrast

**Must-Have:**
- Subtle hover transitions on all interactive elements
- Smooth state changes (loading, success, error)
- Clear data hierarchy — users need to find things fast
- Empty states for every data container
- Onboarding checklist (3-5 items, Userpilot: 3x more likely to convert paid)

**Never-Use:**
- Excessive animation (users are here to work, not watch)
- More than 2 accent colors (creates visual chaos in data-rich UIs)
- AI purple (#6366F1) as default brand (reads as AI-generated, not intentionally designed)
- Heavy shadows on every card (shadow fatigue)

**Key Metric:** Time to First Value. The faster users see their data, the higher retention.

---

## Analytics / Dashboard

**Style:** Minimalism | Secondary: Data-Dense
**Emotional Target:** Technical
**Color Mood:** Neutral base + data visualization palette (Okabe-Ito or viridis, not rainbow)

**Must-Have:**
- Data export functionality (CSV, PDF minimum)
- Filtering with active filter indicators (chips above content)
- Sortable tables with direction indicators
- Keyboard navigation (power users live in keyboard)
- Monospace font for all quantitative data (decimal alignment)
- Right-align numbers, left-align text (Pencil & Paper enterprise tables rule)

**Never-Use:**
- Ornate design (competes with data for attention)
- Large decorative images (waste space that should show data)
- Playful elements (undermines data credibility)
- Heavy animations (distracting during data analysis)
- Rainbow colormaps for data viz (perceptually broken, colorblind-hostile)

**Key Pattern:** Virtual scrolling for large datasets. Saved views (named filter/sort/column configurations).

---

## Healthcare

**Style:** Soft UI | Secondary: Accessible/Ethical
**Emotional Target:** Calm
**Color Mood:** Calm blue + health green, low saturation (C < 0.12)

**Must-Have:**
- **WCAG AAA** (not just AA — diverse user base including elderly and disabled)
- Calm colors only (no bright, no neon, no high saturation)
- Large touch targets (48px+, not just 44px — users may have motor difficulties)
- Clear error recovery (errors in medical context can have real consequences)
- Large text option (Dynamic Type / text scaling support)
- Crisis resources accessible from any screen

**Never-Use:**
- Bright neon colors (anxiety-inducing in medical context)
- Motion-heavy design (motion sensitivity more common in patient populations)
- Small text below 14px (readability for elderly patients)
- Playful animations (trivializes serious health contexts)
- Gamification without clinical validation

**Legal:** HIPAA compliance affects UI (no PHI in URLs, no caching of sensitive data, session timeouts).

---

## Fintech / Banking

**Style:** Minimalism | Secondary: Enterprise Trust
**Emotional Target:** Trustworthy
**Color Mood:** Navy + trust blue + gold accent

**Must-Have:**
- Security-first visual signals (SSL badge, 2FA indicator, encryption badges)
- Trust badges prominently placed near any monetary action
- Clear transaction states (pending, processing, completed, failed)
- Proper number formatting (locale-aware: 1,234.56 vs 1.234,56)
- Audit trail visible to users
- Biometric auth support indicators

**Never-Use:**
- Playful design (destroys institutional trust)
- AI purple/pink gradients (reads as startup, not bank)
- Unclear fees or hidden costs (FTC enforcement risk — see Amazon $2.5B case)
- Bright/vivid colors (financial anxiety already high; don't add visual stress)
- Animations on transaction screens (users need clarity, not entertainment)

**Key Rule:** Every monetary value must be unambiguous. Currency symbol, decimal places, locale formatting. A $10.00 that displays as 10 could be $10 or $1,000 in different locales.

---

## Creative Agency

**Style:** Vibrant Block / Motion-Driven
**Emotional Target:** Bold
**Color Mood:** Bold, client-specific, high chroma (C 0.15+)

**Must-Have:**
- Case studies with real results and named clients
- Full-bleed imagery (the work IS the product)
- Scroll animations and motion design (demonstrates capability)
- Portfolio grid with filtering by type/industry
- Video reel or motion showreel

**Never-Use:**
- Corporate minimalism (reads as "we don't have opinions")
- Hidden or hard-to-find portfolio (the portfolio IS the sales tool)
- Stock photography anywhere (credibility destroyer for a visual agency)
- Template-feeling layouts (agencies sell originality)

---

## Developer Tool

**Style:** Dark OLED | Secondary: Minimalism
**Emotional Target:** Technical
**Color Mood:** Dark base + single accent (emerald/cyan/blue), muted surfaces

**Must-Have:**
- Code examples on every feature page (developers evaluate by reading code)
- Keyboard shortcuts for all frequent actions (developers type, not click)
- Command palette (Cmd+K) for 50+ feature navigation
- API reference with copy-to-clipboard on every code block
- Syntax highlighting in all code blocks
- Package manager install commands (npm/yarn/pnpm/cargo/go)

**Never-Use:**
- Heavy chrome (visual noise around the content developers care about)
- Poor keyboard support (developers will leave for a competitor with shortcuts)
- Slow performance (developers measure in milliseconds and will notice)
- Excessive tooltips on familiar patterns (condescending to the audience)
- Light mode as forced default (dark is the convention)

**Key Pattern:** Documentation quality IS the product quality for developer tools. Stripe's docs are why developers choose Stripe.

---

## AI / Chatbot

**Style:** Minimalism | Secondary: Soft UI
**Emotional Target:** Technical
**Color Mood:** Neutral + one distinct accent (NOT AI purple unless intentional brand decision)

**Must-Have:**
- Streaming text with visible cursor/indicator
- Typing indicators during generation
- Conversation history (sidebar or searchable)
- Tool/function call indicators (show what's happening, not just "thinking...")
- Code blocks with syntax highlighting and copy button
- Clear model/capability indicators

**Never-Use:**
- Heavy chrome (the conversation IS the interface)
- Distracting animations during text generation
- Cluttered sidebars competing with the conversation
- AI purple (#6366F1) as unconscious default (use it only if it's a deliberate brand choice)
- Anthropomorphized AI persona (the Clippy problem — confidence without competence is a UX disaster)

**The AI Purple Problem:** Adam Wathan (Tailwind creator) acknowledged #6366F1 was a "neutral, inoffensive placeholder" not intended as default for 40% of the internet. LLM training data scraped billions of tokens of Tailwind code → models learned "purple = web button" → AI-generated sites used purple → entered next training corpus → bias compounded. Using it says "this was generated."

---

## E-commerce (Luxury)

**Style:** Minimalism | Secondary: Cinematic Dark
**Emotional Target:** Premium
**Color Mood:** Black + gold, minimal palette, premium neutrals

**Must-Have:**
- Full-frame product photography (the product IS the hero, not the UI)
- Trust signals (SSL, payment icons, return policy)
- Size guides and detailed specifications
- Review system with verified purchase indicator
- Wishlist/save functionality
- Guest checkout (26% abandon if forced account — Baymard)

**Never-Use:**
- Block-based colorful layouts (reads as mass-market, not luxury)
- Playful colors or rounded-xl elements (undermines premium positioning)
- Cheap-feeling discount badges (luxury uses "complimentary shipping" not "FREE SHIPPING!!!")
- Cluttered product pages (luxury = breathing room)

---

## Government

**Style:** Minimalism | Secondary: Accessible/Ethical
**Emotional Target:** Trustworthy
**Color Mood:** High contrast, institutional blue, minimal palette

**Must-Have:**
- **WCAG AAA** (non-negotiable — diverse population including elderly, disabled, non-native speakers)
- Skip links for keyboard/screen reader users
- Plain language at **grade 4-6** reading level (GOV.UK standard)
- Breadcrumbs for hierarchical navigation
- Multi-language support
- Print-friendly layouts

**Never-Use:**
- Ornate design (wastes taxpayer attention)
- Low contrast (fails the most vulnerable users)
- Motion effects (accessibility risk)
- Decorative images without informational value
- Jargon in any user-facing text

---

## Mental Health / Wellness

**Style:** Soft UI | Secondary: Warm Editorial (mental health) or Accessible/Ethical
**Emotional Target:** Calm
**Color Mood:** Muted pastels, warm neutrals, low chroma (mental health); Warm earth tones, sage green, soft coral (wellness)

**Must-Have:**
- Calm, non-stimulating aesthetics
- Privacy-first UX (no social features without explicit opt-in)
- Generous breathing room in layout
- Gentle, non-aggressive CTAs
- Crisis resources accessible from every screen (mental health)
- Breathing space between interactive elements

**Never-Use:**
- Bright neon colors (overstimulating)
- Motion overload (can trigger anxiety)
- Gamification without clinical backing (trivializes mental health)
- Social pressure mechanics (leaderboards, streaks that punish missing)
- Dark mode as default (breaks the calm, warm impression)
- Aggressive push notifications

---

## Education

**Style:** Soft UI | Secondary: Claymorphism (for younger audiences)
**Emotional Target:** Playful (younger) / Trustworthy (professional)
**Color Mood:** Friendly pastels, warm accents, high readability contrast

**Must-Have:**
- Progress indicators (completion percentage, milestones)
- Achievement/completion feedback (but not manipulative streaks)
- Clear navigation (users may be unfamiliar with web conventions)
- Full accessibility (diverse learner populations)
- Content that works without JavaScript (progressive enhancement)

**Never-Use:**
- Complex layouts (cognitive load competes with learning)
- Dense data tables (not appropriate for most educational contexts)
- Dark mode as default (reading/learning context favors light)
- Small text (readability is paramount for learning)
