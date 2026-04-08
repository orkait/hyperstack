import type { PatternSection } from "./types.js";
import { snippet } from "./loader.js";

export const PATTERNS: Record<PatternSection, string> = {
  "zustand-store": snippet("patterns/zustand-store.txt"),
  "undo-redo": snippet("patterns/undo-redo.txt"),
  "drag-and-drop": snippet("patterns/drag-and-drop.txt"),
  "auto-layout-dagre": snippet("patterns/auto-layout-dagre.txt"),
  "auto-layout-elk": snippet("patterns/auto-layout-elk.txt"),
  "context-menu": snippet("patterns/context-menu.txt"),
  "copy-paste": snippet("patterns/copy-paste.txt"),
  "save-restore": snippet("patterns/save-restore.txt"),
  "prevent-cycles": snippet("patterns/prevent-cycles.txt"),
  "keyboard-shortcuts": snippet("patterns/keyboard-shortcuts.txt"),
  "performance": snippet("patterns/performance.txt"),
  "dark-mode": snippet("patterns/dark-mode.txt"),
  "ssr": snippet("patterns/ssr.txt"),
  "subflows": snippet("patterns/subflows.txt"),
  "edge-reconnection": snippet("patterns/edge-reconnection.txt"),
  "custom-connection-line": snippet("patterns/custom-connection-line.txt"),
  "auto-layout-on-mount": snippet("patterns/auto-layout-on-mount.txt"),
};
