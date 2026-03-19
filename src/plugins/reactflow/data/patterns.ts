import type { PatternSection } from "./types.js";
import { snippet } from "./loader.js";

export const PATTERNS: Record<PatternSection, string> = {
  "zustand-store": snippet("patterns/zustand-store.md"),
  "undo-redo": snippet("patterns/undo-redo.md"),
  "drag-and-drop": snippet("patterns/drag-and-drop.md"),
  "auto-layout-dagre": snippet("patterns/auto-layout-dagre.md"),
  "auto-layout-elk": snippet("patterns/auto-layout-elk.md"),
  "context-menu": snippet("patterns/context-menu.md"),
  "copy-paste": snippet("patterns/copy-paste.md"),
  "save-restore": snippet("patterns/save-restore.md"),
  "prevent-cycles": snippet("patterns/prevent-cycles.md"),
  "keyboard-shortcuts": snippet("patterns/keyboard-shortcuts.md"),
  "performance": snippet("patterns/performance.md"),
  "dark-mode": snippet("patterns/dark-mode.md"),
  "ssr": snippet("patterns/ssr.md"),
  "subflows": snippet("patterns/subflows.md"),
  "edge-reconnection": snippet("patterns/edge-reconnection.md"),
  "custom-connection-line": snippet("patterns/custom-connection-line.md"),
  "auto-layout-on-mount": snippet("patterns/auto-layout-on-mount.md"),
};
