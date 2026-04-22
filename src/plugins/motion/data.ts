import { snippet } from "./loader.js";

export interface ApiEntry {
  name: string;
  kind: ApiKind;
  description: string;
  importPath: string;
  props?: PropEntry[];
  returns?: string;
  usage: string;
  examples: Example[];
  tips?: string[];
  relatedApis?: string[];
}

export interface PropEntry {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface Example {
  title: string;
  code: string;
  description?: string;
  category: Category;
}

export const CATEGORIES = [
  "animation",
  "gestures",
  "scroll",
  "layout",
  "exit",
  "drag",
  "hover",
  "svg",
  "transitions",
  "variants",
  "keyframes",
  "spring",
  "reorder",
  "performance",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const API_KINDS = ["component", "hook", "function", "utility"] as const;
export type ApiKind = (typeof API_KINDS)[number];

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatExample(ex: Example, headingLevel = 3): string {
  const prefix = "#".repeat(headingLevel);
  let out = `${prefix} ${ex.title}\n`;
  if (ex.description) out += `${ex.description}\n\n`;
  out += `\`\`\`tsx\n${ex.code}\n\`\`\`\n\n`;
  return out;
}

// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

const motionComponent: ApiEntry = {
  name: "motion",
  kind: "component",
  description:
    "The core building block. Every HTML and SVG element has a motion counterpart (motion.div, motion.span, motion.circle, etc.). Accepts all standard props plus animation-specific props.",
  importPath: 'import { motion } from "motion/react"',
  props: [
    { name: "initial", type: "Target | VariantLabels | false", description: "Initial visual state on mount. Set false to disable enter animation." },
    { name: "animate", type: "Target | VariantLabels", description: "Target animation values on enter and update." },
    { name: "exit", type: "Target | VariantLabels", description: "Target animation when removed (requires AnimatePresence parent)." },
    { name: "transition", type: "Transition", description: "Default transition config for this component." },
    { name: "variants", type: "Variants", description: "Named animation states. Object of { [name]: target }." },
    { name: "style", type: "MotionStyle", description: "Extended style prop supporting motion values and independent transforms." },
    { name: "whileHover", type: "Target | VariantLabels", description: "Animation target while hovered." },
    { name: "whileTap", type: "Target | VariantLabels", description: "Animation target while pressed." },
    { name: "whileFocus", type: "Target | VariantLabels", description: "Animation target while focused (:focus-visible)." },
    { name: "whileDrag", type: "Target | VariantLabels", description: "Animation target while dragging." },
    { name: "whileInView", type: "Target | VariantLabels", description: "Animation target while in viewport." },
    { name: "drag", type: "boolean | 'x' | 'y'", description: "Enable dragging. true for both axes, or constrain to one." },
    { name: "dragConstraints", type: "{ top, left, right, bottom } | RefObject", description: "Pixel constraints or ref to container element." },
    { name: "dragSnapToOrigin", type: "boolean", description: "Animate back to origin on release." },
    { name: "dragElastic", type: "number | { top, left, right, bottom }", description: "Elasticity outside constraints (0-1).", default: "0.5" },
    { name: "dragMomentum", type: "boolean", description: "Apply inertia on release.", default: "true" },
    { name: "dragTransition", type: "InertiaOptions", description: "Customize inertia physics (bounceStiffness, bounceDamping, power, timeConstant, etc.)." },
    { name: "dragDirectionLock", type: "boolean", description: "Lock drag to first detected axis." },
    { name: "dragControls", type: "DragControls", description: "Pass controls from useDragControls." },
    { name: "dragPropagation", type: "boolean", description: "Allow drag gesture propagation to child components." },
    { name: "dragListener", type: "boolean", description: "Enable/disable element as drag initiator.", default: "true" },
    { name: "onDirectionLock", type: "(axis: 'x' | 'y') => void", description: "Callback when drag direction is locked." },
    { name: "layout", type: "boolean | 'position' | 'size'", description: "Enable layout animations. 'position' animates only position, 'size' only size." },
    { name: "layoutId", type: "string", description: "Shared layout animation identifier for cross-component transitions." },
    { name: "layoutDependency", type: "any", description: "Optimize layout measurements to only occur when this value changes." },
    { name: "layoutAnchor", type: "{ x: number; y: number } | false", description: "Customise the anchor point for relative projection in layout animations. x/y are progress values 0-1 (0=top/left, 0.5=center, 1=bottom/right). Set false to animate relative to page.", default: "{ x: 0, y: 0 }" },
    { name: "layoutScroll", type: "boolean", description: "Mark scrollable container for correct layout measurement." },
    { name: "layoutRoot", type: "boolean", description: "Mark position:fixed container for layout measurement." },
    { name: "viewport", type: "ViewportOptions", description: "Options for whileInView: { once, root, margin, amount }." },
    { name: "inherit", type: "boolean", description: "Prevent inheriting parent variant changes when set to false." },
    { name: "custom", type: "any", description: "Data passed to dynamic variant functions." },
    { name: "transformTemplate", type: "(transform, generatedTransform) => string", description: "Custom transform string builder." },
    { name: "onUpdate", type: "(latest: ResolvedValues) => void", description: "Callback every frame with latest values." },
    { name: "onAnimationStart", type: "(definition) => void", description: "Callback when animation starts." },
    { name: "onAnimationComplete", type: "(definition) => void", description: "Callback when animation completes." },
    { name: "onHoverStart", type: "(event, info) => void", description: "Hover start callback." },
    { name: "onHoverEnd", type: "(event, info) => void", description: "Hover end callback." },
    { name: "onTapStart", type: "(event, info) => void", description: "Tap start callback." },
    { name: "onTap", type: "(event, info) => void", description: "Tap callback." },
    { name: "onTapCancel", type: "(event, info) => void", description: "Tap cancel callback." },
    { name: "onPan", type: "(event, info) => void", description: "Pan callback with point, delta, offset, velocity." },
    { name: "onPanStart", type: "(event, info) => void", description: "Pan start callback." },
    { name: "onPanEnd", type: "(event, info) => void", description: "Pan end callback." },
    { name: "onDrag", type: "(event, info) => void", description: "Drag callback." },
    { name: "onDragStart", type: "(event, info) => void", description: "Drag start callback." },
    { name: "onDragEnd", type: "(event, info) => void", description: "Drag end callback." },
    { name: "onViewportEnter", type: "(entry) => void", description: "Viewport enter callback." },
    { name: "onViewportLeave", type: "(entry) => void", description: "Viewport leave callback." },
    { name: "onLayoutAnimationStart", type: "() => void", description: "Layout animation start callback." },
    { name: "onLayoutAnimationComplete", type: "() => void", description: "Layout animation complete callback." },
    { name: "propagate", type: "{ tap?: boolean }", description: "Control gesture propagation." },
  ],
  usage: snippet("usage/motion.txt"),
  examples: [
    {
      title: "Basic fade in",
      category: "animation",
      code: snippet("examples/motion/basic-fade-in.txt"),
    },
    {
      title: "Hover and tap",
      category: "gestures",
      code: snippet("examples/motion/hover-and-tap.txt"),
    },
    {
      title: "Keyframes",
      category: "keyframes",
      code: snippet("examples/motion/keyframes.txt"),
    },
    {
      title: "Wildcard keyframe (start from current value)",
      category: "keyframes",
      code: snippet("examples/motion/wildcard-keyframe-start-from-current-value.txt"),
    },
    {
      title: "Variants with orchestration",
      category: "variants",
      code: snippet("examples/motion/variants-with-orchestration.txt"),
    },
    {
      title: "Drag with constraints",
      category: "drag",
      code: snippet("examples/motion/drag-with-constraints.txt"),
    },
    {
      title: "Scroll-triggered entrance",
      category: "scroll",
      code: snippet("examples/motion/scroll-triggered-entrance.txt"),
    },
    {
      title: "Layout animation",
      category: "layout",
      code: snippet("examples/motion/layout-animation.txt"),
    },
    {
      title: "Shared layout with layoutId",
      category: "layout",
      code: snippet("examples/motion/shared-layout-with-layoutid.txt"),
    },
    {
      title: "SVG line drawing",
      category: "svg",
      code: snippet("examples/motion/svg-line-drawing.txt"),
    },
    {
      title: "SVG path morphing",
      category: "svg",
      code: snippet("examples/motion/svg-path-morphing.txt"),
      description: "Paths must have same number and type of instructions.",
    },
    {
      title: "Scroll image reveal with clipPath",
      category: "scroll",
      code: snippet("examples/motion/scroll-image-reveal-with-clippath.txt"),
    },
    {
      title: "Snap-to-grid drag",
      category: "drag",
      code: snippet("examples/motion/snap-to-grid-drag.txt"),
    },
    {
      title: "Animate counter without re-renders",
      category: "animation",
      code: snippet("examples/motion/animate-counter-without-re-renders.txt"),
      description: "Pass a MotionValue as child to render its latest value.",
    },
    {
      title: "Animate CSS variables",
      category: "animation",
      code: snippet("examples/motion/animate-css-variables.txt"),
    },
    {
      title: "Dynamic variants with custom",
      category: "variants",
      code: snippet("examples/motion/dynamic-variants-with-custom.txt"),
    },
  ],
  tips: [
    "Use motion/react-client for React Server Components (Next.js app dir).",
    "motion.create(Component) wraps custom components. In React 18 the component must use forwardRef. In React 19 ref is passed via props automatically.",
    "motion.create(Component, { forwardMotionProps: true }) forwards motion props to the wrapped component.",
    "motion.create('custom-element') creates a motion component for custom DOM elements.",
    "Independent transforms: x, y, z, scale, scaleX, scaleY, rotate, rotateX, rotateY, rotateZ, skewX, skewY, transformPerspective.",
    "width/height can animate to/from 'auto'. display animates between 'none'/'block'. visibility animates between 'hidden'/'visible'.",
    "Pass a MotionValue as a child of a motion component to render its latest value: <motion.span>{motionValue}</motion.span>.",
    "SVG attributes: use attrX, attrY, attrScale for x/y/scale that target SVG attributes instead of transforms.",
  ],
  relatedApis: ["AnimatePresence", "useAnimate", "useMotionValue", "MotionConfig"],
};

const animatePresence: ApiEntry = {
  name: "AnimatePresence",
  kind: "component",
  description:
    "Enables exit animations when children are removed from the React tree. Direct children must have unique key props.",
  importPath: 'import { AnimatePresence } from "motion/react"',
  props: [
    { name: "initial", type: "boolean", description: "Set false to disable initial animations on first render.", default: "true" },
    { name: "mode", type: "'sync' | 'wait' | 'popLayout'", description: "sync: simultaneous enter/exit. wait: exit completes before enter. popLayout: pop exiting elements out of layout flow.", default: "'sync'" },
    { name: "custom", type: "any", description: "Data passed to exiting components via usePresenceData()." },
    { name: "onExitComplete", type: "() => void", description: "Fires when all exit animations finish." },
    { name: "propagate", type: "boolean", description: "If true, nested AnimatePresence children fire exit animations when parent exits." },
    { name: "root", type: "ShadowRoot | HTMLElement", description: "Root element for popLayout styles. Defaults to document.head. Set to a ShadowRoot for shadow DOM usage." },
  ],
  usage: snippet("usage/AnimatePresence.txt"),
  examples: [
    {
      title: "Modal with exit animation",
      category: "exit",
      code: snippet("examples/AnimatePresence/modal-with-exit-animation.txt"),
    },
    {
      title: "Page transitions with wait mode",
      category: "exit",
      code: snippet("examples/AnimatePresence/page-transitions-with-wait-mode.txt"),
    },
  ],
  tips: [
    "AnimatePresence must wrap the conditional — it goes OUTSIDE the {show && ...}.",
    "Each direct child needs a unique key prop.",
    "mode='wait' is useful for page transitions where old page exits before new enters.",
    "mode='popLayout' pops exiting elements out of document flow immediately. Custom component children must use forwardRef (React 18) or accept ref prop (React 19).",
  ],
  relatedApis: ["motion", "usePresence", "useIsPresent", "usePresenceData"],
};

const layoutGroup: ApiEntry = {
  name: "LayoutGroup",
  kind: "component",
  description:
    "Synchronizes layout animations across sibling components that don't re-render together. Also namespaces layoutId values.",
  importPath: 'import { LayoutGroup } from "motion/react"',
  props: [
    { name: "id", type: "string", description: "Namespace layoutId values to prevent conflicts between multiple instances." },
  ],
  usage: snippet("usage/LayoutGroup.txt"),
  examples: [
    {
      title: "Synchronized accordion items",
      category: "layout",
      code: snippet("examples/LayoutGroup/synchronized-accordion-items.txt"),
    },
  ],
  relatedApis: ["motion", "AnimatePresence"],
};

const lazyMotion: ApiEntry = {
  name: "LazyMotion",
  kind: "component",
  description:
    "Reduces bundle size by loading motion features on demand. Use the m component (from motion/react-m) instead of motion inside LazyMotion.",
  importPath: 'import { LazyMotion } from "motion/react"\nimport { m } from "motion/react-m"',
  props: [
    { name: "features", type: "FeatureBundle | () => Promise<FeatureBundle>", description: "domAnimation (~15kb: animations, variants, exit, tap, hover, focus) or domMax (~25kb: adds pan, drag, layout)." },
    { name: "strict", type: "boolean", description: "If true, throws error if motion component is used instead of m." },
  ],
  usage: snippet("usage/LazyMotion.txt"),
  examples: [
    {
      title: "Async feature loading",
      category: "performance",
      code: snippet("examples/LazyMotion/async-feature-loading.txt"),
    },
  ],
  tips: [
    "domAnimation includes: animate, variants, exit, tap, hover, focus (~15kb).",
    "domMax adds: pan, drag, layout animations (~25kb).",
    "Use async import for code splitting: features={() => import('motion').then(m => m.domMax)}.",
  ],
  relatedApis: ["motion", "MotionConfig"],
};

const motionConfig: ApiEntry = {
  name: "MotionConfig",
  kind: "component",
  description: "Sets default configuration for all child motion components.",
  importPath: 'import { MotionConfig } from "motion/react"',
  props: [
    { name: "transition", type: "Transition", description: "Default transition for all children." },
    { name: "reducedMotion", type: "'never' | 'user' | 'always'", description: "never: ignore device setting. user: respect prefers-reduced-motion. always: force reduced motion.", default: "'never'" },
    { name: "nonce", type: "string", description: "CSP nonce attribute for generated style blocks." },
  ],
  usage: snippet("usage/MotionConfig.txt"),
  examples: [
    {
      title: "Global spring transition",
      category: "transitions",
      code: snippet("examples/MotionConfig/global-spring-transition.txt"),
    },
    {
      title: "Respect reduced motion",
      category: "performance",
      code: snippet("examples/MotionConfig/respect-reduced-motion.txt"),
    },
  ],
  relatedApis: ["motion", "LazyMotion"],
};

const reorderGroup: ApiEntry = {
  name: "Reorder.Group",
  kind: "component",
  description: "Drag-to-reorder list container. Use with Reorder.Item for list items.",
  importPath: 'import { Reorder } from "motion/react"',
  props: [
    { name: "as", type: "string", description: "Rendered element.", default: "'ul'" },
    { name: "axis", type: "'x' | 'y'", description: "Reorder direction.", default: "'y'" },
    { name: "values", type: "T[]", description: "Array representing the current list order." },
    { name: "onReorder", type: "(newOrder: T[]) => void", description: "Callback with reordered array." },
  ],
  usage: snippet("usage/Reorder.Group.txt"),
  examples: [
    {
      title: "Reorderable list with exit animations",
      category: "reorder",
      code: snippet("examples/Reorder.Group/reorderable-list-with-exit-animations.txt"),
    },
  ],
  relatedApis: ["Reorder.Item", "AnimatePresence"],
};

const reorderItem: ApiEntry = {
  name: "Reorder.Item",
  kind: "component",
  description: "Draggable item inside a Reorder.Group. Accepts all motion component props.",
  importPath: 'import { Reorder } from "motion/react"',
  props: [
    { name: "as", type: "string", description: "Rendered element.", default: "'li'" },
    { name: "value", type: "T", description: "The value this item represents in the values array." },
  ],
  usage: snippet("usage/Reorder.Item.txt"),
  examples: [],
  relatedApis: ["Reorder.Group"],
};

// ---------------------------------------------------------------------------
// HOOKS
// ---------------------------------------------------------------------------

const useAnimate: ApiEntry = {
  name: "useAnimate",
  kind: "hook",
  description:
    "Imperative animation control scoped to a component subtree. Returns [scope, animate]. The scope ref is attached to a container, and animate() can target elements within it by CSS selector.",
  importPath: 'import { useAnimate } from "motion/react"',
  returns: "[scope: RefObject, animate: AnimateFunction]",
  usage: snippet("usage/useAnimate.txt"),
  examples: [
    {
      title: "Staggered list entrance",
      category: "animation",
      code: snippet("examples/useAnimate/staggered-list-entrance.txt"),
    },
    {
      title: "Animation sequence",
      category: "animation",
      code: snippet("examples/useAnimate/animation-sequence.txt"),
    },
    {
      title: "Exit animation with usePresence",
      category: "exit",
      code: snippet("examples/useAnimate/exit-animation-with-usepresence.txt"),
    },
  ],
  tips: [
    "animate() returns a control object with play(), pause(), stop(), cancel(), complete(), time, speed, duration.",
    "Use CSS selectors scoped to the scope ref: animate('.card', { ... }).",
    "The returned controls are thenable: await animate(...).",
  ],
  relatedApis: ["motion", "stagger", "usePresence"],
};

const useMotionValue: ApiEntry = {
  name: "useMotionValue",
  kind: "hook",
  description:
    "Creates a motion value that tracks state and velocity without triggering React re-renders. Pass to motion component style or SVG attribute props.",
  importPath: 'import { useMotionValue } from "motion/react"',
  returns: "MotionValue<T>",
  usage: snippet("usage/useMotionValue.txt"),
  examples: [
    {
      title: "Track drag position",
      category: "drag",
      code: snippet("examples/useMotionValue/track-drag-position.txt"),
    },
  ],
  tips: [
    "Motion values update outside React — no re-renders. Use useMotionValueEvent to react to changes.",
    "Events: 'change', 'animationStart', 'animationCancel', 'animationComplete'.",
    "Pass directly to style={{ x }} or SVG attribute props.",
  ],
  relatedApis: ["useTransform", "useSpring", "useMotionValueEvent"],
};

const useTransform: ApiEntry = {
  name: "useTransform",
  kind: "hook",
  description:
    "Creates a derived motion value from one or more source motion values via mapping or a transform function.",
  importPath: 'import { useTransform } from "motion/react"',
  returns: "MotionValue<T>",
  usage: snippet("usage/useTransform.txt"),
  examples: [
    {
      title: "Parallax scroll effect",
      category: "scroll",
      code: snippet("examples/useTransform/parallax-scroll-effect.txt"),
    },
    {
      title: "Scroll-linked color change",
      category: "scroll",
      code: snippet("examples/useTransform/scroll-linked-color-change.txt"),
    },
  ],
  props: [
    { name: "clamp", type: "boolean", description: "Clamp output to range.", default: "true" },
    { name: "ease", type: "Easing | Easing[]", description: "Easing function or array of easings per segment." },
    { name: "mixer", type: "(from, to) => (progress) => mixed", description: "Custom mixing function." },
  ],
  relatedApis: ["useMotionValue", "useScroll", "useSpring"],
};

const useSpring: ApiEntry = {
  name: "useSpring",
  kind: "hook",
  description:
    "Creates a motion value that animates to targets with spring physics. Can track another motion value.",
  importPath: 'import { useSpring } from "motion/react"',
  returns: "MotionValue<number>",
  usage: snippet("usage/useSpring.txt"),
  examples: [
    {
      title: "Smooth scroll tracking",
      category: "scroll",
      code: snippet("examples/useSpring/smooth-scroll-tracking.txt"),
    },
    {
      title: "Mouse follower",
      category: "animation",
      code: snippet("examples/useSpring/mouse-follower.txt"),
    },
  ],
  props: [
    { name: "stiffness", type: "number", description: "Spring stiffness.", default: "1" },
    { name: "damping", type: "number", description: "Spring damping.", default: "10" },
    { name: "mass", type: "number", description: "Mass of the moving object.", default: "1" },
    { name: "bounce", type: "number", description: "Bounciness (0-1).", default: "0.25" },
    { name: "duration", type: "number", description: "Duration in seconds (spring will be configured to match)." },
    { name: "visualDuration", type: "number", description: "Perceived duration (spring settles to 1/10 of movement)." },
    { name: "skipInitialAnimation", type: "boolean", description: "Skip animation on initial render.", default: "false" },
  ],
  relatedApis: ["useMotionValue", "useTransform"],
};

const useScroll: ApiEntry = {
  name: "useScroll",
  kind: "hook",
  description:
    "Creates scroll-linked motion values. Tracks window or element scroll position. Supports hardware-accelerated ScrollTimeline.",
  importPath: 'import { useScroll } from "motion/react"',
  returns: "{ scrollX, scrollY, scrollXProgress, scrollYProgress }",
  usage: snippet("usage/useScroll.txt"),
  examples: [
    {
      title: "Scroll progress bar",
      category: "scroll",
      code: snippet("examples/useScroll/scroll-progress-bar.txt"),
    },
    {
      title: "Element reveal on scroll",
      category: "scroll",
      code: snippet("examples/useScroll/element-reveal-on-scroll.txt"),
    },
    {
      title: "Horizontal scroll section",
      category: "scroll",
      code: snippet("examples/useScroll/horizontal-scroll-section.txt"),
    },
  ],
  props: [
    { name: "container", type: "RefObject<HTMLElement>", description: "Scrollable element ref. Default: window." },
    { name: "target", type: "RefObject<HTMLElement>", description: "Element to track progress through container." },
    { name: "axis", type: "'x' | 'y'", description: "Scroll axis.", default: "'y'" },
    { name: "offset", type: "[string, string]", description: "Start/end intersection points. Format: 'targetPoint containerPoint'. Points: start, center, end, 0-1, px, %, vh, vw.", default: '["start start", "end end"]' },
    { name: "trackContentSize", type: "boolean", description: "Track content size changes.", default: "false" },
  ],
  tips: [
    "Offset format: ['start end', 'end start'] means animation starts when target's start hits viewport end, ends when target's end hits viewport start.",
    "Use useTransform to map scrollYProgress to transform/opacity/filter for GPU-accelerated animations.",
    "Combine with useSpring for smoothed scroll animations.",
  ],
  relatedApis: ["useTransform", "useSpring", "useMotionValue"],
};

const useInView: ApiEntry = {
  name: "useInView",
  kind: "hook",
  description: "Detects when an element is in the viewport. Returns a boolean that triggers re-renders.",
  importPath: 'import { useInView } from "motion/react"',
  returns: "boolean",
  usage: snippet("usage/useInView.txt"),
  examples: [
    {
      title: "Trigger animation when in view",
      category: "scroll",
      code: snippet("examples/useInView/trigger-animation-when-in-view.txt"),
    },
  ],
  props: [
    { name: "root", type: "RefObject<HTMLElement>", description: "Scrollable parent ref. Default: window." },
    { name: "margin", type: "string", description: "Viewport margin (e.g., '0px 100px -50px 0px')." },
    { name: "once", type: "boolean", description: "Stop observing after first enter.", default: "false" },
    { name: "initial", type: "boolean", description: "Initial value before first measurement.", default: "false" },
    { name: "amount", type: "'some' | 'all' | number", description: "Intersection amount required.", default: "'some'" },
  ],
  relatedApis: ["useScroll", "useAnimate"],
};

const useMotionValueEvent: ApiEntry = {
  name: "useMotionValueEvent",
  kind: "hook",
  description:
    "Lifecycle-managed event listener for motion values. Automatically cleans up on unmount.",
  importPath: 'import { useMotionValueEvent } from "motion/react"',
  usage: snippet("usage/useMotionValueEvent.txt"),
  examples: [
    {
      title: "Detect scroll direction",
      category: "scroll",
      code: snippet("examples/useMotionValueEvent/detect-scroll-direction.txt"),
    },
  ],
  relatedApis: ["useMotionValue", "useScroll"],
};

const useVelocity: ApiEntry = {
  name: "useVelocity",
  kind: "hook",
  description:
    "Returns a motion value tracking the velocity (per second) of another numerical motion value.",
  importPath: 'import { useVelocity } from "motion/react"',
  returns: "MotionValue<number>",
  usage: snippet("usage/useVelocity.txt"),
  examples: [
    {
      title: "Velocity-based skew on drag",
      category: "drag",
      code: snippet("examples/useVelocity/velocity-based-skew-on-drag.txt"),
    },
  ],
  relatedApis: ["useMotionValue", "useTransform"],
};

const useTime: ApiEntry = {
  name: "useTime",
  kind: "hook",
  description:
    "Returns a motion value that updates every frame with milliseconds since creation. Useful for perpetual animations.",
  importPath: 'import { useTime } from "motion/react"',
  returns: "MotionValue<number>",
  usage: snippet("usage/useTime.txt"),
  examples: [
    {
      title: "Perpetual rotation",
      category: "animation",
      code: snippet("examples/useTime/perpetual-rotation.txt"),
    },
  ],
  relatedApis: ["useTransform", "useMotionValue"],
};

const useMotionTemplate: ApiEntry = {
  name: "useMotionTemplate",
  kind: "hook",
  description:
    "Tagged template literal that creates a motion value from a string containing other motion values.",
  importPath: 'import { useMotionTemplate } from "motion/react"',
  returns: "MotionValue<string>",
  usage: snippet("usage/useMotionTemplate.txt"),
  examples: [
    {
      title: "Dynamic gradient",
      category: "animation",
      code: snippet("examples/useMotionTemplate/dynamic-gradient.txt"),
    },
  ],
  relatedApis: ["useMotionValue", "useTransform"],
};

const useDragControls: ApiEntry = {
  name: "useDragControls",
  kind: "hook",
  description: "Manual drag initiation from any element, not just the dragged element itself.",
  importPath: 'import { useDragControls } from "motion/react"',
  returns: "DragControls",
  usage: snippet("usage/useDragControls.txt"),
  examples: [
    {
      title: "Custom drag handle",
      category: "drag",
      code: snippet("examples/useDragControls/custom-drag-handle.txt"),
    },
  ],
  relatedApis: ["motion"],
};

const useAnimationFrame: ApiEntry = {
  name: "useAnimationFrame",
  kind: "hook",
  description: "Runs a callback every animation frame. Callback receives (time, delta).",
  importPath: 'import { useAnimationFrame } from "motion/react"',
  usage: snippet("usage/useAnimationFrame.txt"),
  examples: [
    {
      title: "Continuous rotation",
      category: "animation",
      code: snippet("examples/useAnimationFrame/continuous-rotation.txt"),
    },
  ],
  relatedApis: ["useTime"],
};

const useReducedMotion: ApiEntry = {
  name: "useReducedMotion",
  kind: "hook",
  description:
    "Returns true if the device has Reduced Motion enabled (prefers-reduced-motion: reduce). Reactively updates.",
  importPath: 'import { useReducedMotion } from "motion/react"',
  returns: "boolean",
  usage: snippet("usage/useReducedMotion.txt"),
  examples: [],
  tips: ["Prefer MotionConfig reducedMotion='user' for app-wide reduced motion handling."],
  relatedApis: ["MotionConfig"],
};

const useIsPresent: ApiEntry = {
  name: "useIsPresent",
  kind: "hook",
  description: "Returns boolean indicating whether the component is still present in the tree (for AnimatePresence exit flow).",
  importPath: 'import { useIsPresent } from "motion/react"',
  returns: "boolean",
  usage: snippet("usage/useIsPresent.txt"),
  examples: [],
  relatedApis: ["AnimatePresence", "usePresence"],
};

const usePresence: ApiEntry = {
  name: "usePresence",
  kind: "hook",
  description:
    "Returns [isPresent, safeToRemove] for manual exit animation control with AnimatePresence. Call safeToRemove() when your custom exit animation is done.",
  importPath: 'import { usePresence } from "motion/react"',
  returns: "[isPresent: boolean, safeToRemove: () => void]",
  usage: snippet("usage/usePresence.txt"),
  examples: [],
  relatedApis: ["AnimatePresence", "useIsPresent", "useAnimate"],
};

const usePresenceData: ApiEntry = {
  name: "usePresenceData",
  kind: "hook",
  description: "Access the custom prop data from the parent AnimatePresence.",
  importPath: 'import { usePresenceData } from "motion/react"',
  returns: "any",
  usage: snippet("usage/usePresenceData.txt"),
  examples: [],
  relatedApis: ["AnimatePresence"],
};

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

const staggerFn: ApiEntry = {
  name: "stagger",
  kind: "utility",
  description:
    "Creates staggered delays for animation sequences. Use with useAnimate's animate() or with delayChildren in variant transitions.",
  importPath: 'import { stagger } from "motion/react"',
  usage: snippet("usage/stagger.txt"),
  examples: [
    {
      title: "Staggered list with easing",
      category: "animation",
      code: snippet("examples/stagger/staggered-list-with-easing.txt"),
    },
  ],
  props: [
    { name: "startDelay", type: "number", description: "Initial delay offset.", default: "0" },
    { name: "from", type: "'first' | 'center' | 'last' | number", description: "Origin index for stagger.", default: "'first'" },
    { name: "ease", type: "Easing", description: "Easing for stagger distribution." },
  ],
  relatedApis: ["useAnimate"],
};

const animateFn: ApiEntry = {
  name: "animate",
  kind: "function",
  description:
    "Imperative animate function. Targets CSS selectors, DOM elements, motion values, or objects. Supports timeline sequences.",
  importPath: 'import { animate } from "motion/react"',
  returns: "AnimationControls (time, speed, duration, play, pause, stop, cancel, complete, then)",
  usage: snippet("usage/animate.txt"),
  examples: [
    {
      title: "Timeline with sequencing",
      category: "animation",
      code: snippet("examples/animate/timeline-with-sequencing.txt"),
    },
  ],
  tips: [
    "at values: number (absolute), '<' (after previous), '+0.5' (relative offset), '-0.2' (overlap), '<0.5' (relative to previous start).",
    "Mini animate from 'motion/mini' is 2.3kb (CSS transitions only, no spring/layout).",
    "Full animate from 'motion' is ~18kb (springs, keyframes, independent transforms).",
  ],
  relatedApis: ["useAnimate", "stagger"],
};

// ---------------------------------------------------------------------------
// ADDITIONAL HOOKS
// ---------------------------------------------------------------------------

const useWillChange: ApiEntry = {
  name: "useWillChange",
  kind: "hook",
  description: "Returns an optimized will-change MotionValue. Pass to style.willChange to automatically manage will-change CSS property during animations.",
  importPath: 'import { useWillChange } from "motion/react"',
  returns: "WillChange",
  usage: snippet("usage/useWillChange.txt"),
  examples: [],
  relatedApis: ["useMotionValue"],
};

const useCycle: ApiEntry = {
  name: "useCycle",
  kind: "hook",
  description: "Cycles through a list of values. Returns [currentValue, cycleFunction]. Call cycle() to advance, or cycle(index) to jump.",
  importPath: 'import { useCycle } from "motion/react"',
  returns: "[T, (index?: number) => void]",
  usage: snippet("usage/useCycle.txt"),
  examples: [
    {
      title: "Toggle animation state",
      category: "animation",
      code: snippet("examples/useCycle/toggle-animation-state.txt"),
    },
  ],
  relatedApis: ["motion"],
};

const usePageInView: ApiEntry = {
  name: "usePageInView",
  kind: "hook",
  description: "Returns true when the current page/tab is the user's active tab. Uses document.visibilitychange. Useful for pausing animations or video when tab is hidden.",
  importPath: 'import { usePageInView } from "motion/react"',
  returns: "boolean",
  usage: snippet("usage/usePageInView.txt"),
  examples: [
    {
      title: "Pause video when tab hidden",
      category: "performance",
      code: snippet("examples/usePageInView/pause-video-when-tab-hidden.txt"),
    },
  ],
  relatedApis: ["useInView"],
};

// ---------------------------------------------------------------------------
// STANDALONE FUNCTIONS (framework-agnostic, from "motion" package)
// ---------------------------------------------------------------------------

const hoverFn: ApiEntry = {
  name: "hover",
  kind: "function",
  description: "Standalone hover gesture function. Under 1kb. Returns a cleanup function. The callback can return a cleanup that fires on hover end.",
  importPath: 'import { hover } from "motion"',
  returns: "() => void (cleanup)",
  usage: snippet("usage/hover.txt"),
  examples: [
    {
      title: "Standalone hover with React ref",
      category: "hover",
      code: snippet("examples/hover/standalone-hover-with-react-ref.txt"),
    },
  ],
  tips: ["Under 1kb — smallest hover animation possible.", "Import from 'motion' (not 'motion/react')."],
  relatedApis: ["motion"],
};

const pressFn: ApiEntry = {
  name: "press",
  kind: "function",
  description: "Standalone press gesture function with keyboard accessibility (Enter/Space). Returns a cleanup function.",
  importPath: 'import { press } from "motion"',
  returns: "() => void (cleanup)",
  usage: snippet("usage/press.txt"),
  examples: [],
  tips: ["Keyboard accessible: responds to Enter and Space keys.", "Import from 'motion' (not 'motion/react')."],
  relatedApis: ["motion", "hover"],
};

const scrollFn: ApiEntry = {
  name: "scroll",
  kind: "function",
  description: "Standalone scroll-linked animation function. Framework-agnostic. Can accept a callback or an animation to link to scroll progress.",
  importPath: 'import { scroll } from "motion"',
  returns: "() => void (cleanup)",
  usage: snippet("usage/scroll.txt"),
  examples: [],
  tips: ["Framework-agnostic — works without React.", "Import from 'motion' (not 'motion/react')."],
  relatedApis: ["useScroll", "animate"],
};

const inViewFn: ApiEntry = {
  name: "inView",
  kind: "function",
  description: "Standalone IntersectionObserver wrapper. Framework-agnostic. Callback can return a cleanup function that fires when element leaves viewport.",
  importPath: 'import { inView } from "motion"',
  returns: "() => void (cleanup)",
  usage: snippet("usage/inView.txt"),
  examples: [],
  tips: ["Framework-agnostic — works without React.", "Import from 'motion' (not 'motion/react')."],
  relatedApis: ["useInView"],
};

// ---------------------------------------------------------------------------
// TRANSITIONS REFERENCE
// ---------------------------------------------------------------------------

export const TRANSITIONS_REFERENCE = snippet("transitions.txt");

// ---------------------------------------------------------------------------
// ALL APIS REGISTRY
// ---------------------------------------------------------------------------

export const ALL_APIS: ApiEntry[] = [
  motionComponent,
  animatePresence,
  layoutGroup,
  lazyMotion,
  motionConfig,
  reorderGroup,
  reorderItem,
  useAnimate,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useInView,
  useMotionValueEvent,
  useVelocity,
  useTime,
  useMotionTemplate,
  useDragControls,
  useAnimationFrame,
  useReducedMotion,
  useIsPresent,
  usePresence,
  usePresenceData,
  staggerFn,
  animateFn,
  useWillChange,
  useCycle,
  usePageInView,
  hoverFn,
  pressFn,
  scrollFn,
  inViewFn,
];

export interface SearchResult {
  api: ApiEntry;
  matchingExamples: Example[];
}

export function searchApis(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const api of ALL_APIS) {
    const nameMatch = api.name.toLowerCase().includes(q);
    const descMatch = api.description.toLowerCase().includes(q);
    const matchingExamples = api.examples.filter(
      (ex) =>
        ex.title.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.code.toLowerCase().includes(q),
    );

    if (nameMatch || descMatch || matchingExamples.length > 0) {
      results.push({ api, matchingExamples });
    }
  }
  return results;
}

const apiLookup = new Map<string, ApiEntry>();
for (const api of ALL_APIS) {
  apiLookup.set(api.name.toLowerCase(), api);
  apiLookup.set(api.name.toLowerCase().replace(/\./g, ""), api);
}

export function getApiByName(name: string): ApiEntry | undefined {
  const n = name.toLowerCase();
  return apiLookup.get(n) ?? apiLookup.get(n.replace(/\./g, ""));
}

export function getExamplesByCategory(category: string): Example[] {
  const c = category.toLowerCase();
  return ALL_APIS.flatMap((api) =>
    api.examples
      .filter((ex) => ex.category === c)
      .map((ex) => (ex.description ? ex : { ...ex, description: `From ${api.name}` })),
  );
}

export function formatApiReference(api: ApiEntry): string {
  let out = `# ${api.name}\n\n`;
  out += `**Kind:** ${api.kind}\n`;
  out += `**Import:** \`${api.importPath}\`\n\n`;
  out += `${api.description}\n\n`;

  if (api.returns) {
    out += `**Returns:** \`${api.returns}\`\n\n`;
  }

  out += `## Usage\n\n\`\`\`tsx\n${api.usage}\n\`\`\`\n\n`;

  if (api.props && api.props.length > 0) {
    out += `## Props\n\n`;
    for (const p of api.props) {
      out += `- **${p.name}**: \`${p.type}\`${p.default ? ` (default: ${p.default})` : ""} — ${p.description}\n`;
    }
    out += "\n";
  }

  if (api.examples.length > 0) {
    out += `## Examples\n\n`;
    for (const ex of api.examples) {
      out += formatExample(ex);
    }
  }

  if (api.tips && api.tips.length > 0) {
    out += `## Tips\n\n`;
    for (const tip of api.tips) {
      out += `- ${tip}\n`;
    }
    out += "\n";
  }

  if (api.relatedApis && api.relatedApis.length > 0) {
    out += `**Related:** ${api.relatedApis.join(", ")}\n`;
  }

  return out;
}
