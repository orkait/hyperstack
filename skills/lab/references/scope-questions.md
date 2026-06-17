# Scope-question playbook

After the user names a **target** and before building variants, ask **1-3** scope
questions. The goal is to pin the variant space so the three variants are distinct
*and* all in the right neighborhood - not to interrogate. Pick the 1-3 that most
change what you build. Skip anything already answered by a `DESIGN.md` or prior turn.

## When to ask vs. just build

- Ask when the answer **changes the variants** (feel, layout family, content source).
- Don't ask what you can read (existing design tokens, the locked sections above this
  one, the project's component library).
- Never ask "is this ok?" - that's what locking is for.

## The menu (choose 1-3)

| Dimension | Why it matters | Example question |
|---|---|---|
| **Feel / direction** | Biggest lever; wrong feel = all variants rejected | "Dark/technical, warm-editorial, or playful for this one?" |
| **Job of the section** | Determines content + hierarchy | "Is this section's job to convince, explain, or convert?" |
| **Hero element** | What the variants are built around | "Should the visual lead be the live trace, a static diagram, or copy-first?" |
| **Content truth** | Honest content only (Iron rule) | "What real numbers/copy can I use here? Omit anything not real." |
| **Layout family** | Bounds the 3 variants | "Split, centered, or full-bleed - or should I try one of each?" |
| **Density / length** | Affects rhythm and mobile | "Compact band or a taller, breathing section?" |
| **Reference** | Fast calibration | "Any site whose version of this section you like?" |

## Default if the user is terse

If the user says "just build it," default to: **3 variants spanning different layout
families** (e.g. split / centered / full-bleed), same feel as the locked sections
above, honest content pulled from the codebase. Then let the lock + iterate loop
converge.

## After variants are shown

One closing question only: **"which locks, or what changes?"** Then act - lock and
move on, or iterate the same target with a changed *approach* (not pixel nudges).
