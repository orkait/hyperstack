# Elevation Levels

| Level | Name | Use | Dark mode |
|-------|------|-----|-----------|
| 0 | Flat | Page background | Darkest bg |
| 1 | Subtle | Inline cards, zebra rows | Slightly lighter |
| 2 | Raised | Standard cards | Lighter still |
| 3 | Elevated | Dropdowns, popovers | More lighter |
| 4 | Floating | Modals, dialogs | Lightest card bg |

## Key rules
- Each level MUST be visually distinguishable — not just via borders
- Dark mode: shadows invisible — use progressively lighter bg-color per level
- Surfaces nest: page → card → inset panel → floating popover

## Shadow warmth formula
box-shadow: 0 2px 8px oklch(0.22 0.006 56 / 0.08)
Never: box-shadow: 0 2px 8px rgba(0,0,0,0.08)