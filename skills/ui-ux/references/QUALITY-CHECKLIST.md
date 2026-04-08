# UI Quality Review Checklist

Run this checklist before shipping any interface. Score each item pass/fail.

## Typography
- [ ] Max 2 font families in the entire app
- [ ] Body text is 16px with 1.75 line height
- [ ] Heading line heights are tight (1.1–1.3), not body line height
- [ ] Headings use negative tracking, body uses zero
- [ ] Overlines are uppercase with positive tracking (+0.06em+)
- [ ] No font size below 12px anywhere
- [ ] Prose text constrained to max-width 65ch
- [ ] Headings use clamp() for fluid scaling

## Color
- [ ] No pure black (#000) text — use dark neutral
- [ ] No pure white (#FFF) backgrounds — use tinted white
- [ ] All body text passes 4.5:1 contrast (AA)
- [ ] All large text passes 3:1 contrast (AA)
- [ ] Status colors have both solid + soft variants
- [ ] White text on solid status colors passes 4.5:1
- [ ] Color is never the ONLY state indicator
- [ ] Dark mode tested and complete

## Spacing
- [ ] All spacing values are multiples of 4px
- [ ] Space within groups < space between groups
- [ ] Section padding responsive (96 → 64 → 48px)
- [ ] Card padding responsive (28 → 20 → 16px)
- [ ] No arbitrary spacing values (e.g., 13px, 37px)

## Components
- [ ] All buttons are accessible (≥ 44px touch target)
- [ ] All inputs have visible focus states
- [ ] Cards have border + radius + padding
- [ ] Badges use semantic color conventions
- [ ] Disabled states use opacity 0.5

## Layout
- [ ] Page max-width defined (1280px typical)
- [ ] Content max-width for text areas (1080px or 65ch)
- [ ] Responsive breakpoints tested (640, 768, 1024, 1280px)
- [ ] Grid gaps reduce on mobile

## Motion
- [ ] Enter: ease-out, 200ms
- [ ] Exit: ease-in, 150ms
- [ ] No linear easing on UI motion
- [ ] prefers-reduced-motion query present
- [ ] No more than 3 simultaneous animations

## Accessibility
- [ ] All interactive elements keyboard-navigable
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Modal focus trapped
- [ ] Z-index uses defined scale, not arbitrary values
- [ ] Touch targets ≥ 44px
- [ ] Focus ring visible (2px, offset 2px)

## Dark Mode
- [ ] Every semantic token has a .dark override
- [ ] Backgrounds are warm charcoal, not black
- [ ] Text is off-white, not pure white
- [ ] Elevation uses lighter bg, not just more shadow
- [ ] All contrast checks pass in dark mode too
