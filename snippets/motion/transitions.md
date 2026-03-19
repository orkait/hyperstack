## Transition Types

Motion auto-selects the transition type based on the animated value:
- Transform values (x, y, rotate): **spring** (stiffness: 500, damping: 25)
- Scale values (scale, scaleX, scaleY): **spring** (stiffness: 550, damping: 30)
- Non-physical values (opacity, color): **tween** (duration: 0.3, ease: cubic-bezier(0.25, 0.1, 0.35, 1))
- Multiple keyframes (3+): **keyframes** (duration: 0.8)

### Tween
{ type: "tween", duration: 0.3, ease: "easeOut" }
- duration: seconds (default: 0.3, or 0.8 for keyframes)
- ease: easing name, cubic bezier array, or JS function
- times: keyframe timing array (0-1 per keyframe), e.g. { times: [0, 0.2, 1] }

**Easing names:** "linear", "easeIn", "easeOut", "easeInOut", "circIn", "circOut", "circInOut", "backIn", "backOut", "backInOut", "anticipate"
**Custom:** ease: [0.42, 0, 0.58, 1] (cubic bezier) or ease: (t) => t * t (function)

### Spring — Duration-based (default for physical values)
{ type: "spring", duration: 0.8, bounce: 0.25 }
- bounce: 0 = no bounce, 1 = very bouncy (default: 0.25)
- visualDuration: perceived duration (spring settles to 1/10 of movement at this time)

### Spring — Physics-based
{ type: "spring", stiffness: 100, damping: 10, mass: 1 }
- stiffness: default 100
- damping: default 10
- mass: default 1
- velocity: initial velocity
- restSpeed: default 0.1
- restDelta: default 0.01

### Inertia (used by drag momentum)
{ type: "inertia", power: 0.8, timeConstant: 325 }
- modifyTarget: (v) => Math.round(v / 50) * 50 (snap to grid)
- min, max: boundaries
- bounceStiffness: 500, bounceDamping: 10

## Orchestration
- delay: seconds (negative = start mid-animation)
- repeat: number (Infinity for loop)
- repeatType: "loop" | "reverse" | "mirror"
- repeatDelay: seconds between repeats
- when: "beforeChildren" | "afterChildren" (variants only)
- staggerChildren: seconds between each child animation (variants only)
- delayChildren: seconds or stagger() (variants only)

## Per-value transitions
transition: {
  default: { type: "spring" },
  opacity: { duration: 0.2, ease: "linear" },
  x: { type: "spring", stiffness: 300 }
}

## Transition inheritance
Set inherit: true on a transition to merge with lower-specificity transitions (e.g. from MotionConfig).
Without inherit, a component-level transition fully replaces parent defaults.

## Animatable values
- **Independent transforms:** x, y, z, scale, scaleX, scaleY, rotate, rotateX, rotateY, rotateZ, skewX, skewY, transformPerspective
- **Transform origin:** originX (0-1), originY (0-1), originZ (px)
- **CSS:** opacity, backgroundColor, color, borderRadius, filter, clipPath, boxShadow, etc.
- **SVG:** pathLength, pathSpacing, pathOffset, cx, cy, r, d, viewBox, attrX, attrY, attrScale
- **Special:** width/height to "auto", display: "none"/"block", visibility: "hidden"/"visible", CSS variables ("--custom")
- **Hardware-accelerated:** Set transform directly as CSS string: animate={{ transform: "translateX(100px)" }}

## Keyframes
- Array values: animate={{ x: [0, 100, 0] }}
- Wildcard (null): [null, 100, 0] starts from current value
- Mid-animation hold: [0, 100, null, 0] holds current value mid-sequence
- Keyframe timing: transition: { times: [0, 0.2, 1] }
