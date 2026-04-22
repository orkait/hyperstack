import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register(server: McpServer): void {
  server.resource(
    "cheatsheet",
    "motion://react/cheatsheet",
    { description: "Motion for React quick reference cheatsheet", mimeType: "text/markdown" },
    async () => {
      const text = `# Motion for React - Cheatsheet

## Import
\`\`\`tsx
import { motion, AnimatePresence, useAnimate, useMotionValue, useTransform, useSpring, useScroll, useInView, stagger } from "motion/react"
// For RSC (Next.js app dir): import from "motion/react-client"
// For reduced bundle: import { m } from "motion/react-m" + LazyMotion
\`\`\`

## Quick Patterns

### Fade in
\`\`\`tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
\`\`\`

### Hover + Tap
\`\`\`tsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
\`\`\`

### Exit animation
\`\`\`tsx
<AnimatePresence>
  {show && <motion.div key="x" exit={{ opacity: 0 }} />}
</AnimatePresence>
\`\`\`

### Scroll-triggered
\`\`\`tsx
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} />
\`\`\`

### Scroll-linked
\`\`\`tsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
<motion.div style={{ opacity }} />
\`\`\`

### Drag
\`\`\`tsx
<motion.div drag dragConstraints={{ top: -100, left: -100, bottom: 100, right: 100 }} />
\`\`\`

### Layout animation
\`\`\`tsx
<motion.div layout />                    // auto-animate layout changes
<motion.div layoutId="shared-element" /> // shared element transition
\`\`\`

### Variants with stagger
\`\`\`tsx
const parent = { show: { transition: { staggerChildren: 0.1 } } };
const child = { hidden: { opacity: 0 }, show: { opacity: 1 } };
<motion.ul variants={parent} initial="hidden" animate="show">
  <motion.li variants={child} />
</motion.ul>
\`\`\`

### Spring physics
\`\`\`tsx
transition={{ type: "spring", stiffness: 300, damping: 20 }}
// or duration-based:
transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
\`\`\`

## Animatable Values
- Transforms: x, y, z, scale, scaleX, scaleY, rotate, rotateX, rotateY, skewX, skewY
- CSS: opacity, backgroundColor, color, borderRadius, filter, clipPath, etc.
- SVG: pathLength, pathSpacing, pathOffset, cx, cy, r, d, viewBox
- Special: width/height to "auto", CSS variables ("--custom")
`;
      return { contents: [{ uri: "motion://react/cheatsheet", mimeType: "text/markdown", text }] };
    },
  );
}
