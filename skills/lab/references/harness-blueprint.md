# Harness blueprint (Vite + React)

Concrete Phase 0 scaffolding. Adapt the dev flag and router to the project's stack.
Goal: `/lab-cook` (current target only) and `/lab-view` (locked targets assembled),
both under a lab navbar (theme + device toggles) with a pinned mobile sidebar, all
dev-only. Everything here is throwaway prototype scaffolding (Iron Law 4).

## File layout

```
src/lab/
  lab.css                 scoped prototype styles (OKLCH, mirrors the design system) - throwaway
  shared.tsx              prototype primitives + a useLabFonts() CDN-font loader
  chrome.tsx              LabShell: lab navbar (theme + device toggles) + mobile sidebar
  cook.tsx                /lab-cook - renders ONLY the current target's variants
  view.tsx                /lab-view - assembles locked/* in order
  current-target.tsx      the ONE target in flight + its N variant components (the only scratch)
  locked/
    <section>.tsx         one clean component per locked target (the winners)
    index.ts              ordered export list -> what /lab-view renders
```

`current-target.tsx` is the only file that changes per round. On lock: move the
winner into `locked/<section>.tsx`, append it to `locked/index.ts`, then blank
`current-target.tsx` (Iron Laws 1 & 2).

## Routing (dev-gated)

```tsx
const IS_DEV = import.meta.env.DEV;
const LabCook = React.lazy(() => import("@/lab/cook"));
const LabView = React.lazy(() => import("@/lab/view"));

// inside <Routes>:
{IS_DEV && <Route path="/lab-cook" element={<LabCook />} />}
{IS_DEV && <Route path="/lab-view" element={<LabView />} />}
```

Keep the real production routes untouched. Optionally alias the production landing
route to `<LabView/>` *only* when `IS_DEV`, so the additive page shows up where the
user expects it - but never in a production build.

## LabShell (chrome.tsx) - navbar + mobile sidebar

```tsx
export function LabShell({ title, children }: { title: string; children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showMobile, setShowMobile] = useState(true);   // mobile sidebar toggle
  useLabFonts();
  return (
    <div data-theme={theme} className="lab-root">
      {/* lab navbar: plain, very low height, two controls top-right */}
      <header className="lab-navbar">
        <span className="lab-title">{title}</span>
        <div className="lab-controls">
          <button onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}>
            {theme === "light" ? "☾ dark" : "☀ light"}
          </button>
          <button
            aria-pressed={showMobile}
            onClick={() => setShowMobile(v => !v)}
          >
            ▢ mobile
          </button>
        </div>
      </header>

      <div className="lab-body">
        {/* MAIN preview - desktop width */}
        <main className="lab-main">
          <SiteNavbar />          {/* shared real site navbar, inside the preview */}
          {children}
        </main>

        {/* mobile sidebar - toggled from the navbar, mirrors the same content at ~390px */}
        {showMobile && (
          <aside className="lab-mobile-sidebar">
            <div className="phone" style={{ width: 390 }}>
              <SiteNavbar mobile />
              {children}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
```

Notes:
- The `[mobile]` toggle shows/hides the mobile-view sidebar (the constant ~390px
  reference). Main preview stays desktop width; flip the sidebar on to judge mobile
  beside it before locking.
- `data-theme` drives the scoped token set (light / warm-charcoal dark) in `lab.css`.
- `SiteNavbar` is the real site nav (or a faithful stand-in) so previews sit under
  realistic chrome and the mobile sidebar shows the mobile drawer.

## cook.tsx - current target only

```tsx
import { variants } from "@/lab/current-target";   // [{ id, label, note, C }]

export default function LabCook() {
  return (
    <LabShell title="lab-cook · <target name>">
      {variants.map(v => (
        <section key={v.id} className="lab-variant">
          <div className="lab-variant-label"><b>{v.id}</b> {v.label} - {v.note}</div>
          <v.C />
        </section>
      ))}
    </LabShell>
  );
}
```

When the cook is empty (between targets), `variants` is `[]` and the page reads
"empty - awaiting next target."

## view.tsx - locked targets assembled

```tsx
import { LOCKED } from "@/lab/locked";   // ordered [{ id, C }]

export default function LabView() {
  return (
    <LabShell title="lab-view · additive">
      {LOCKED.map(({ id, C }) => <C key={id} />)}
    </LabShell>
  );
}
```

## Mirroring the design system in lab.css

So variants read true, the scoped `lab.css` should copy the project's real tokens
(cream/ink surfaces, plum/accent, shadows, radii) as plain OKLCH custom properties,
plus `[data-theme="dark"]` overrides. Load the intended fonts from a CDN in
`useLabFonts()` for the prototype. None of this ships - final wiring replaces it with
the real token files and self-hosted fonts.
