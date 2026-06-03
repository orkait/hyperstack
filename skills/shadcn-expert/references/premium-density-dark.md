# Premium Density & Dark-Surface Discipline

**Apply ONLY when DESIGN.md calls for a dense, dark, or devtool/agent-console aesthetic** (high information density, AMOLED/true-black, data-heavy panels). Do NOT impose this on a marketing site, a spacious consumer app, or a light-first brand - those stay on the generic shadcn defaults. This is opt-in aesthetic guidance, not a baseline.

## Density

- **4px grid everywhere.** Spacing tokens on multiples of 4 (2px/6px only for ultra-compact inline cases). No arbitrary `13px`/`18px` gaps.
- **Fixed chrome heights.** Titlebar, panel header, tabbar, statusbar each get one fixed height token (e.g. 36 / 32 / 34 / 28). Reuse the token, don't re-pick per column.
- **Shared top-row height = aligned borders.** Every column's top row in a multi-pane layout must share the same `height` + `box-sizing: border-box` + `border-bottom`, or the bottom borders land at different Y and the misalignment shows.

## Dark surfaces

- **Elevation by lightness, not shadow.** On true-black, drop shadows are invisible - raise the surface token's lightness instead. Reserve shadows for overlays only; never put a border AND a shadow on the same card.
- **Shadows differ per theme.** If a component carries a shadow, define both: high alpha on dark, low alpha (~0.06-0.14) on light. Reusing dark alphas in light mode muddies the canvas.
- **Three border roles, distinct tokens:** section boundary (card/table outline), inner separator (row dividers, lower contrast), emphasis edge (hover/focus, used sparingly). One token for all three erases the inner/outer distinction.
- **`::selection` must stay readable in both themes** - a low-alpha accent tint makes selected text vanish; raise alpha (~0.4 dark / ~0.2 light) and set an explicit selection text color.
- **Live/pulse indicators animate opacity, not box-shadow** - a glowing shadow bleeds blur into neighboring rows.

## Color: action vs state

| Need | Use |
|---|---|
| Primary / secondary CTA button | **Neutral** (near-white on dark / near-black on light) `--primary` |
| Focus ring, selected row, checked box/radio, active step, link | **Accent** color (`--ring` / accent token) |
| Destructive CTA | **Red** status token (not accent, not neutral) |

Rule: **neutral = actions, accent = state.** A blue/accent primary button is the most common tell of a generic AI UI - avoid it in this aesthetic.

## Radius, icons, voice

- **Closed radius set.** Pick ~4 values (e.g. tight / control / container / pill) and never introduce off-scale radii (no stray 8/10/12/16).
- **One icon library, fixed stroke** (Lucide, 1.5 stroke), sized per context (titlebar ~18, button ~16, card-header ~11). No emoji, no unicode glyphs.
- **Voice:** sentence case for UI text; UPPERCASE + tracking only for eyebrow labels/badges; quantify over qualify (`12,847 rows`, not "many rows").

## Motion

- **Micro-interactions animate `background-color` only** (~120ms) - animating `color`/`opacity`/`transform` on icons jitters on common hardware.
- **Overlays are the exception** (dialog, command palette, drawer): backdrop `blur(12px)` + spring/expo curve on the panel, not flat opacity + linear `ease`. Reference easing tokens; don't hand-write `cubic-bezier`.
- **Overlays animate BOTH enter and exit.** Unmounting instantly produces an exit flash. Use a two-stage mount: keep the node mounted, flip a `visible` class to drive the transition, and delay unmount by the longest transition duration.
  - Drive the enter transition with `useLayoutEffect` (commit hidden styles, then set `visible` in the same paint) and the exit with a `setTimeout` matching the transition duration. **Do NOT use `requestAnimationFrame`.**
- Gate decorative/reveal motion behind `@media (prefers-reduced-motion: no-preference)`.

## App-shell composition

- **3-pane shell** = CSS grid, fixed side columns + `1fr` main (`220px 1fr 280px`), rows `titlebar 1fr statusbar`. Apply `contain: layout style paint` per panel to isolate scroll/streaming reflow.
- **Sidebar collapse needs dual transitions** - animate grid column width AND content opacity together, with `white-space: nowrap` on nav items, or text wraps mid-animation. `display:none` collapses height; don't use it.
- **Mobile (≤768px):** grid → single column, sidebar becomes `position: fixed` translateX drawer + tap-dismiss backdrop; nav items auto-close the drawer on click.
- **Hide scrollbar, keep scroll:** `::-webkit-scrollbar:horizontal { height:0 }` - never `overflow-x: hidden`, which kills the scroll entirely.
