# Component Patterns Reference

Detailed specifications for common UI components. Read when building specific components.

## Buttons

### Variants

| Variant | Background | Text | Shadow | Use |
|---------|-----------|------|--------|-----|
| Primary | Brand gradient | White | Brand glow | Main CTAs |
| Secondary | Accent fill | Dark or white | Accent glow | Energy CTAs |
| Outline | Transparent | Brand color | None | Secondary actions |
| Ghost | Transparent | Muted | None | Tertiary, toolbar |
| Destructive | Error solid | White | None | Delete, danger |
| CTA (inverted) | White | Brand | Dark shadow | On dark sections |

### Sizes

| Size | Height | Horizontal padding | Font size |
|------|--------|-------------------|-----------|
| sm | 34px | 18px | 13px |
| md | 42px | 24px | 14px |
| lg | 50px | 32px | 15px |
| xl | 58px | 40px | 16px |

### States

- **Hover:** brightness(1.08), shadow expands
- **Active:** scale(0.97), 150ms ease-snappy
- **Disabled:** opacity 0.5, cursor not-allowed
- **Focus:** 2px ring, 2px offset, brand color
- **Loading:** spinner replaces text, maintain width

### Shape

Pill (border-radius: 9999px) for primary/secondary CTAs. Rounded rectangle for utility buttons. Be consistent within an app.

## Cards

### Anatomy

```
┌─ border (1px, border-color) ─────────────────────┐
│ padding (20–40px depending on content density)    │
│                                                    │
│  ┌─ Optional header ─────────────────────────┐   │
│  │ Title (H3 weight) + optional badge/action │   │
│  └──────────────────────────────────────────────┘   │
│                                                    │
│  Content area                                      │
│                                                    │
│  ┌─ Optional footer ────────────────────────┐    │
│  │ Actions, metadata, links                  │    │
│  └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

### Rules

- Always: border + border-radius (12px) + padding
- Card-on-card: inner uses muted bg, outer uses card bg
- Hover: shadow expands + optional brand tint
- Elevation: surface-level-1 (subtle) or surface-level-2 (standard)

## Badges

### Status badges

Soft background + solid text color from same semantic family:

```
[Success soft bg] Success text
[Warning soft bg] Warning text
[Error soft bg]   Error text
[Info soft bg]    Info text
```

### Difficulty badges

- Easy: success-soft bg + success text
- Medium: warning-soft bg + warning text
- Hard: error-soft bg + destructive text

### Eyebrow badges

- Font: mono, 10–11px
- Style: uppercase, tracking-wider (+0.06em)
- Shape: pill (border-radius: 9999px)
- Border: 1px accent color
- Content: label, optionally with icon prefix (✦, →)

## Forms

### Input anatomy

- Height: 40px (default, meets touch target)
- Padding: 12px horizontal
- Border: 1px border-color (default), 1.5px primary (focused)
- Border-radius: default (10px)
- Placeholder: muted-foreground color

### Focus state

1. Border changes: border-color → primary, width 1px → 1.5px
2. Ring appears: 3px spread, primary color at 12% opacity
3. Transition: 150ms ease-out

### Error state

1. Border: destructive color
2. Ring: destructive at 12% opacity
3. Message: caption size, destructive color, 4px below input
4. Icon: optional error icon inside input (right-aligned)

### Toggle / Switch

- Track: 36×20px, border-radius pill
- Thumb: 16×16px circle, white
- Off: muted bg, thumb left
- On: primary bg, thumb right
- Transition: 150ms ease-snappy

### Checkbox

- Size: 16×16px
- Unchecked: border-color border, transparent bg
- Checked: primary bg, white checkmark
- Border-radius: 4px (not pill — that's radio)

### Segmented control

- Container: border, border-radius
- Options: equal width, text-only
- Active: primary-soft bg + primary text
- Inactive: transparent bg + muted text
- Dividers: 1px border between options

## Status Indicators

### Dot indicators

- Size: 8px circle
- Active/generating: pulse animation
- Colors: success=green, warning=amber, error=red, info=blue, locked=muted at 0.4 opacity

### Progress bars

- Height: 6px (standard) or 4px (compact)
- Track: muted bg
- Fill: semantic color (success=green, warning=amber, error=red)
- Border-radius: pill on both track and fill
- Animation: width transition 300ms ease-out

## Navigation

### Sidebar

- Width: 220–256px
- Background: accent-tinted (brand-50 or muted)
- Active item: primary-soft bg + primary text + icon
- Inactive item: foreground text, no bg
- Section labels: overline style (uppercase, tracking-wider, muted)
- Collapse: icon-only mode at 64px width

### Top nav (glass)

- Height: 64–66px
- Background: page-bg at 92% opacity + backdrop-filter blur(16px)
- Border: 1px bottom border
- Shadow: subtle nav shadow
- Fixed position with appropriate z-index (1030)
