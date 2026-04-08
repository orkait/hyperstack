# Motion Reference

## Duration
| Duration | Use |
|----------|-----|
| 0ms | Instant state changes |
| 100–150ms | Hover, focus, toggles |
| 200ms | Default transitions |
| 300ms | Panel open/close |
| 400–500ms | Complex animations |

Exits faster than entrances. Enter 200ms → Exit 150ms.

## Easing
| Easing | Use |
|--------|-----|
| ease-out `cubic-bezier(0,0,0.2,1)` | Entering (appearing) |
| ease-in `cubic-bezier(0.4,0,1,1)` | Exiting (closing) |
| ease-in-out `cubic-bezier(0.4,0,0.2,1)` | Repositioning (staying visible) |
| spring/bounce | Celebration, playful feedback only |

NEVER use linear easing for UI motion.