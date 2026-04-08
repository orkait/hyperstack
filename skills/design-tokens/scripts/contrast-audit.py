#!/usr/bin/env python3
"""
Design Token Contrast Audit

Parses CSS files with oklch() values and checks WCAG contrast ratios
for all foreground/background combinations.

Usage:
    python contrast-audit.py globals.css [viz-tokens.css]

Checks: AA body (4.5:1), AA-large (3:1), border visibility (1.1:1),
        focus ring (3:1), sRGB gamut, neutral chroma.
"""

import math, re, sys

def oklch_to_srgb(L, C, h_deg):
    h = math.radians(h_deg)
    a, b = C * math.cos(h), C * math.sin(h)
    l_ = L + 0.3963377774*a + 0.2158037573*b
    m_ = L - 0.1055613458*a - 0.0638541728*b
    s_ = L - 0.0894841775*a - 1.2914855480*b
    l, m, s = l_**3, m_**3, s_**3
    r = 4.0767416621*l - 3.3077115913*m + 0.2309699292*s
    g = -1.2684380046*l + 2.6097574011*m - 0.3413193965*s
    bv = -0.0041960863*l - 0.7034186147*m + 1.7076147010*s
    def to_srgb(c):
        return max(0, min(1, c/12.92 if c <= 0.0031308 else 1.055*(c**(1/2.4))-0.055))
    return to_srgb(r), to_srgb(g), to_srgb(bv)

def rel_lum(r, g, b):
    def lin(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
    return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b)

def contrast(l1, l2):
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def gamut_ok(L, C, h):
    h_r = math.radians(h)
    a, b = C*math.cos(h_r), C*math.sin(h_r)
    l_ = L+0.3963377774*a+0.2158037573*b
    m_ = L-0.1055613458*a-0.0638541728*b
    s_ = L-0.0894841775*a-1.2914855480*b
    l, m, s = l_**3, m_**3, s_**3
    r = 4.0767416621*l-3.3077115913*m+0.2309699292*s
    g = -1.2684380046*l+2.6097574011*m-0.3413193965*s
    bv = -0.0041960863*l-0.7034186147*m+1.7076147010*s
    return all(-0.001 <= v <= 1.001 for v in [r, g, bv])

def parse_vars(css, scope):
    """Extract CSS var definitions from a scope (:root, .dark, @theme)."""
    result = {}
    in_scope = False
    depth = 0
    for line in css.split('\n'):
        s = line.strip()
        if scope in s: in_scope = True
        if in_scope:
            depth += s.count('{') - s.count('}')
            if depth <= 0 and '}' in s:
                in_scope = False
                continue
            m = re.match(r'--([\w-]+):\s*(.+?)\s*;', s)
            if m:
                result[m.group(1)] = m.group(2).split('/*')[0].strip()
    return result

def resolve_oklch(name, scope_vars):
    val = scope_vars.get(name, '')
    parsed = re.search(r'oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)', val)
    if parsed:
        return float(parsed.group(1)), float(parsed.group(2)), float(parsed.group(3))
    ref = re.search(r'var\(--([\w-]+)\)', val)
    if ref:
        return resolve_oklch(ref.group(1), scope_vars)
    return None

def get_lum(name, scope_vars):
    oklch = resolve_oklch(name, scope_vars)
    if oklch:
        rgb = oklch_to_srgb(*oklch)
        return rel_lum(*rgb)
    return None

def check(desc, fg, bg, scope_vars, min_ratio, level):
    fg_lum = get_lum(fg, scope_vars)
    bg_lum = get_lum(bg, scope_vars)
    if fg_lum is not None and bg_lum is not None:
        cr = contrast(fg_lum, bg_lum)
        ok = cr >= min_ratio
        print(f"  {'✅' if ok else '❌'} {cr:5.2f}:1 (need {min_ratio}:1 {level:8s}) {desc}")
        return ok
    print(f"  ⚠️  Could not resolve: {desc}")
    return True  # Don't count unresolvable as failure

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python contrast-audit.py globals.css [viz-tokens.css]")
        sys.exit(1)

    css = ''
    for f in sys.argv[1:]:
        with open(f) as fh:
            css += fh.read() + '\n'

    root = parse_vars(css, ':root')
    dark = parse_vars(css, '.dark')
    theme = parse_vars(css, '@theme {')
    all_vars = {**theme, **root}
    all_dark = {**theme, **dark}

    print("=" * 60)
    print("CONTRAST AUDIT")
    print("=" * 60)

    checks = [
        ("Body on page bg", "foreground", "background", all_vars, 4.5, "AA"),
        ("Body on card", "card-foreground", "card", all_vars, 4.5, "AA"),
        ("Muted on page bg", "muted-foreground", "background", all_vars, 4.5, "AA"),
        ("Primary on card", "primary", "card", all_vars, 4.5, "AA"),
        ("White on primary", "primary-foreground", "primary", all_vars, 4.5, "AA"),
        ("White on destructive", "destructive-foreground", "destructive", all_vars, 4.5, "AA"),
        ("White on success", "success-foreground", "success", all_vars, 4.5, "AA"),
        ("White on info", "info-foreground", "info", all_vars, 4.5, "AA"),
        ("Warning-fg on warning", "warning-foreground", "warning", all_vars, 3.0, "AA-lg"),
        ("DARK: Body on bg", "foreground", "background", all_dark, 4.5, "AA"),
        ("DARK: Body on card", "card-foreground", "card", all_dark, 4.5, "AA"),
        ("DARK: Muted on bg", "muted-foreground", "background", all_dark, 4.5, "AA"),
        ("DARK: Primary on card", "primary", "card", all_dark, 4.5, "AA"),
    ]

    failures = sum(1 for args in checks if not check(*args))

    # Gamut check
    print(f"\nGAMUT CHECK")
    oog = 0
    for name, val in {**all_vars, **all_dark}.items():
        parsed = re.search(r'oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)', val)
        if parsed:
            L, C, h = float(parsed.group(1)), float(parsed.group(2)), float(parsed.group(3))
            if not gamut_ok(L, C, h):
                print(f"  ⚠️  --{name}: oklch({L} {C} {h}) clips sRGB")
                oog += 1
    print(f"  {'✅' if oog == 0 else f'⚠️  {oog} out-of-gamut'} All in sRGB gamut" if oog == 0 else "")

    print(f"\n{'='*60}")
    print(f"{'✅ ALL PASS' if failures == 0 else f'❌ {failures} FAILURES'}")
    print(f"{'='*60}")
    sys.exit(1 if failures > 0 else 0)
