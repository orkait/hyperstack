export const SHADCN_RULES = {
  PRIMITIVES: "@base-ui/react",
  STYLING: "Tailwind CSS v4",
  CORE_SELECTORS: "data-slot",
  RESPONSIVE_STRATEGY: "Container Queries (@container)",
  NAMING_CONVENTION: "PascalCase (Root + Sub-component)",
  UTILITIES: ["cn from @repo/ui-utils", "cva from class-variance-authority"],
  ANIMATION: "data-state modifiers (data-open, data-closed)",
};

export const CHECKLIST = [
  "Uses @base-ui/react primitive",
  "data-slot on all rendered elements",
  "cva for variants (size, variant)",
  "cn for class merging",
  "use client directive",
  "Props spread (...props)",
  "Export all sub-components",
];
