# Keyboard Shortcuts

```tsx
function KeyboardShortcuts() {
  const { undo, redo } = useFlowHistory();
  const { copy, paste } = useCopyPaste();
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (mod && e.key === 'c') { copy(); }
      if (mod && e.key === 'v') { paste(); }
      if (mod && e.key === '=') { e.preventDefault(); zoomIn(); }
      if (mod && e.key === '-') { e.preventDefault(); zoomOut(); }
      if (mod && e.key === '0') { e.preventDefault(); fitView({ duration: 300 }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, copy, paste, fitView, zoomIn, zoomOut]);

  return null;
}
```
