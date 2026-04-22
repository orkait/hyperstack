import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";

export function register(server: ToolServer): void {
  server.tool(
    "motion_generate_animation",
    "Generate a Motion for React animation snippet from a natural-language description. Returns ready-to-use JSX.",
    {
      description: z.string().describe("Describe the animation you want (e.g., 'fade in from bottom on scroll', 'draggable card with spring', 'staggered list entrance', 'page transition with exit')"),
      elementType: z.string().optional().describe("HTML element type (default: 'div')"),
    },
    async ({ description, elementType }) => {
      const code = generateAnimationCode(description, elementType);

      return {
        content: [
          {
            type: "text",
            text: `\`\`\`tsx\n${code}\n\`\`\`\n\nYou can customize the animation values, transition type, and element type as needed.`,
          },
        ],
      };
    },
  );
}

export function generateAnimationCode(description: string, elementType?: string): string {
  const el = elementType ?? "div";
  const desc = description.toLowerCase();

  const motionImports = new Set<string>(["motion"]);
  const reactImports = new Set<string>();

  let jsx = "";
  let hooks = "";
  let wrapBefore = "";
  let wrapAfter = "";
  let componentSignature = "{ children }";

  if (desc.includes("scroll") && (desc.includes("link") || desc.includes("progress") || desc.includes("parallax"))) {
    motionImports.add("useScroll");
    motionImports.add("useTransform");
    reactImports.add("useRef");
    hooks += `  const ref = useRef(null);\n`;
    hooks += `  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });\n`;
    if (desc.includes("parallax")) {
      hooks += `  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);\n`;
      jsx = `<motion.${el} ref={ref} style={{ y }}>\n  {children}\n</motion.${el}>`;
    } else {
      hooks += `  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);\n`;
      hooks += `  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);\n`;
      jsx = `<motion.${el} ref={ref} style={{ opacity, y }}>\n  {children}\n</motion.${el}>`;
    }
  } else if (desc.includes("scroll") || desc.includes("in view") || desc.includes("viewport")) {
    jsx = `<motion.${el}\n  initial={{ opacity: 0, y: 40 }}\n  whileInView={{ opacity: 1, y: 0 }}\n  viewport={{ once: true, amount: 0.3 }}\n  transition={{ duration: 0.6, ease: "easeOut" }}\n>\n  {children}\n</motion.${el}>`;
  } else if (desc.includes("exit") || desc.includes("page transition") || desc.includes("route")) {
    motionImports.add("AnimatePresence");
    componentSignature = "{ children, itemKey }";
    wrapBefore = `<AnimatePresence mode="wait">\n  `;
    wrapAfter = `\n</AnimatePresence>`;
    jsx = `<motion.${el}\n    key={itemKey}\n    initial={{ opacity: 0, x: 20 }}\n    animate={{ opacity: 1, x: 0 }}\n    exit={{ opacity: 0, x: -20 }}\n    transition={{ duration: 0.3 }}\n  >\n    {children}\n  </motion.${el}>`;
  } else if (desc.includes("stagger") || desc.includes("list")) {
    motionImports.add("useAnimate");
    motionImports.add("stagger");
    reactImports.add("useEffect");
    componentSignature = "{ items }";
    hooks += `  const [scope, animate] = useAnimate();\n\n`;
    hooks += `  useEffect(() => {\n    animate("li", { opacity: 1, y: 0 }, { delay: stagger(0.08) });\n  }, [animate]);\n`;
    jsx = `<ul ref={scope}>\n  {items.map((item) => (\n    <motion.li key={item} initial={{ opacity: 0, y: 20 }}>\n      {item}\n    </motion.li>\n  ))}\n</ul>`;
  } else if (desc.includes("drag")) {
    if (desc.includes("spring") || desc.includes("bounce")) {
      jsx = `<motion.${el}\n  drag\n  dragSnapToOrigin\n  dragElastic={0.3}\n  whileDrag={{ scale: 1.05, cursor: "grabbing" }}\n  transition={{ type: "spring", stiffness: 300, damping: 20 }}\n>\n  {children}\n</motion.${el}>`;
    } else {
      jsx = `<motion.${el}\n  drag\n  dragConstraints={{ top: -100, left: -100, bottom: 100, right: 100 }}\n  whileDrag={{ scale: 1.05 }}\n>\n  {children}\n</motion.${el}>`;
    }
  } else if (desc.includes("hover")) {
    jsx = `<motion.${el}\n  whileHover={{ scale: 1.05 }}\n  whileTap={{ scale: 0.95 }}\n  transition={{ type: "spring", stiffness: 400, damping: 17 }}\n>\n  {children}\n</motion.${el}>`;
  } else if (desc.includes("layout") || desc.includes("shared")) {
    if (desc.includes("shared") || desc.includes("tab") || desc.includes("underline")) {
      componentSignature = "{ isSelected = false }";
      jsx = `{isSelected && (\n  <motion.${el} layoutId="indicator" className="indicator" />\n)}`;
    } else {
      jsx = `<motion.${el} layout transition={{ type: "spring", stiffness: 500, damping: 30 }}>\n  {children}\n</motion.${el}>`;
    }
  } else if (desc.includes("spring") || desc.includes("bounce")) {
    jsx = `<motion.${el}\n  initial={{ scale: 0 }}\n  animate={{ scale: 1 }}\n  transition={{ type: "spring", stiffness: 260, damping: 20 }}\n>\n  {children}\n</motion.${el}>`;
  } else if (desc.includes("svg") || desc.includes("line draw") || desc.includes("path")) {
    jsx = `<motion.path\n  d="M0 0 L100 100"\n  initial={{ pathLength: 0 }}\n  animate={{ pathLength: 1 }}\n  transition={{ duration: 2, ease: "easeInOut" }}\n/>`;
  } else if (desc.includes("fade")) {
    const fromBottom = desc.includes("bottom") || desc.includes("up");
    const fromLeft = desc.includes("left");
    const fromRight = desc.includes("right");
    const initial: Record<string, number> = { opacity: 0 };
    if (fromBottom) initial.y = 30;
    if (fromLeft) initial.x = -30;
    if (fromRight) initial.x = 30;
    jsx = `<motion.${el}\n  initial={${JSON.stringify(initial)}}\n  animate={{ opacity: 1${fromBottom ? ", y: 0" : ""}${fromLeft || fromRight ? ", x: 0" : ""} }}\n  transition={{ duration: 0.5, ease: "easeOut" }}\n>\n  {children}\n</motion.${el}>`;
  } else {
    jsx = `<motion.${el}\n  initial={{ opacity: 0, y: 20 }}\n  animate={{ opacity: 1, y: 0 }}\n  transition={{ duration: 0.4, ease: "easeOut" }}\n>\n  {children}\n</motion.${el}>`;
  }

  const importLine = `import { ${[...motionImports].join(", ")} } from "motion/react";`;
  const reactImportLine = reactImports.size > 0 ? `\nimport { ${[...reactImports].join(", ")} } from "react";` : "";

  let code = `${importLine}${reactImportLine}\n\nfunction AnimatedComponent(${componentSignature}) {\n`;
  if (hooks) code += hooks + "\n";
  code += `  return (\n    ${wrapBefore}${jsx}${wrapAfter}\n  );\n}`;

  return code;
}
