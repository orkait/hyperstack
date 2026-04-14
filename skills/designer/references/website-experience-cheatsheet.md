# Website Experience Cheatsheet

Use this when designing pages, flows, and components that must work well as
websites, not just look polished in screenshots.

This reference is intentionally cross-cutting. These rules should influence
multiple DESIGN.md sections, especially Components, Motion, Do's and Don'ts,
Responsive, and Anti-Patterns.

## 1. Orientation and Information Scent

- The first viewport should make the page's purpose obvious.
- Users should quickly understand:
  - where they are
  - what they can do
  - what happens next
- Navigation labels should use user language, not internal team vocabulary.
- Each page or section should have one primary action with stronger visual weight
  than secondary actions.
- Avoid decorative hero sections that delay comprehension or hide the real task.

## 2. Conversion and Task Flow

- One primary CTA per section. Secondary actions should be visibly secondary.
- Reduce avoidable friction:
  - do not force account creation before obvious value unless required
  - do not split simple tasks across unnecessary steps
  - keep progress visible in multi-step flows
- Prefer clear defaults and safe recommendations over blank states.
- If the page is transactional, the user must always know:
  - what they are committing to
  - what information is required
  - how to go back or recover

## 3. Forms and Validation

- Labels must remain visible. Placeholder-only forms are not acceptable.
- Use correct `autocomplete` tokens where applicable.
- Validate at sensible moments:
  - on blur
  - on submit
  - in real time only when it clearly helps
- Preserve user input across validation errors and network failures.
- Error messages must say:
  - what is wrong
  - where it is wrong
  - how to fix it
- Authentication flows should allow paste and password managers. Do not rely on
  memorization, transcription, or puzzle-like challenges.

## 4. States and Feedback

- Every async action needs immediate visible acknowledgment.
- Every major component or page needs designed states for:
  - loading
  - empty
  - error
  - success
  - disabled
  - destructive confirmation or recovery
- Avoid silent failures and silent no-ops.
- Optimistic UI is acceptable only if rollback and failure messaging are explicit.

## 5. Accessibility and Interaction Safety

- Focus must be visible and should not be obscured by sticky UI, banners, or
  overlays.
- Minimum target size should meet WCAG 2.2 AA at 24x24 CSS px where applicable.
  Prefer 44x44 CSS px for touch comfort.
- Any dragging interaction needs a simpler pointer alternative.
- Motion must respect `prefers-reduced-motion`.
- Keyboard navigation must preserve logical focus order.
- Hover or focus content must not trap, obscure, or disappear unexpectedly.

## 6. Performance Is UX

- Treat performance budgets as design decisions, not later engineering cleanup.
- Baseline website budgets:
  - LCP: <= 2.5s at p75
  - INP: <= 200ms at p75
  - CLS: <= 0.1 at p75
- Avoid layout shifts from:
  - images without dimensions
  - late-loading UI
  - banners, drawers, and injected content
- Use images on mobile only when they add information or trust, not just mood.
- Rich motion should never hide slow UI feedback.

## 7. Responsive Content Priority

- Design mobile-first content priority, not just mobile layout shrinkage.
- At narrow widths, preserve:
  - meaning
  - main action
  - orientation
  - recovery paths
- Reflow should remain usable down to 320 CSS px.
- Zoom and responsive overlays should not hide focused controls or primary actions.
- Dense desktop chrome should collapse into simpler, more legible mobile navigation.

## 8. DESIGN.md Implications

If a DESIGN.md is excellent, it should answer these questions somewhere in the
contract:

- What is the primary user task on each page?
- What is the CTA hierarchy?
- What are the major page and component states?
- What form and authentication constraints apply?
- What performance and motion budgets apply?
- What accessibility floor is non-negotiable?
- What content is prioritized on mobile?

If those answers are missing, the design is visually specified but experientially
under-specified.

## Source Anchors

- VoltAgent design-contract direction:
  - https://github.com/VoltAgent/awesome-design-md
- VoltAgent multi-platform skill packaging and curation:
  - https://github.com/VoltAgent/awesome-agent-skills
  - https://github.com/VoltAgent/awesome-codex-subagents
- Web performance:
  - https://web.dev/articles/lcp
  - https://web.dev/inp/
  - https://web.dev/optimize-cls
- Rendering responsiveness:
  - https://web.dev/articles/rendering-performance
- Form UX:
  - https://web.dev/articles/codelab-address-form-best-practices
- Accessibility:
  - https://www.w3.org/TR/WCAG22/
  - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
  - https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  - https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
  - https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
  - https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
- Reduced motion:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Mobile content discipline:
  - https://www.nngroup.com/videos/mobile-images/
