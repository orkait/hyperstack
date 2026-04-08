# WCAG Contrast Requirements

| Context | Minimum ratio | Level |
|---------|--------------|-------|
| Body text (< 18px) | 4.5:1 | AA |
| Large text (≥ 18px bold or ≥ 24px) | 3:1 | AA |
| UI components (borders, icons) | 3:1 | AA |
| Enhanced body text | 7:1 | AAA |
| Enhanced large text | 4.5:1 | AAA |

## Design token pairs to audit
| Pair | Target |
|------|--------|
| Body text on page bg | 4.5:1 AA |
| Muted text on page bg | 4.5:1 AA |
| Primary on bg (links) | 4.5:1 AA |
| White on primary (buttons) | 4.5:1 AA |
| White on destructive/success/info | 4.5:1 AA |
| Warning-fg on warning | 3:1 AA-large |
| Border vs background | ≥1.1:1 visible |
| Focus ring vs surface | ≥3:1 WCAG 2.4.7 |

## Fix failing colors
Reduce L in OKLCH while keeping C and H unchanged:
oklch(0.63 0.15 145) → oklch(0.55 0.15 145)