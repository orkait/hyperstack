#!/usr/bin/env python3
"""
Cross-file consistency validator for design token systems.

Usage:
    python cross-validate.py globals.css viz-tokens.css component-patterns.ts

Checks:
1. All var() references resolve
2. All :root tokens have .dark overrides
3. No hue-specific names in semantic tokens
4. Typography utilities use var(), not magic numbers
5. Token naming consistency across files
"""

import re, sys

def parse_scoped_vars(css, scope):
    result = set()
    in_scope = False
    depth = 0
    for line in css.split('\n'):
        s = line.strip()
        if scope in s: in_scope = True
        if in_scope:
            depth += s.count('{') - s.count('}')
            if depth <= 0 and '}' in s:
                in_scope = False; continue
            m = re.match(r'--([\w-]+):', s)
            if m: result.add(m.group(1))
    return result

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python cross-validate.py globals.css [viz-tokens.css] [component-patterns.ts]")
        sys.exit(1)

    contents = {}
    for f in sys.argv[1:]:
        with open(f) as fh:
            contents[f] = fh.read()

    css_files = [f for f in contents if f.endswith('.css')]
    ts_files = [f for f in contents if f.endswith('.ts')]

    all_css = '\n'.join(contents[f] for f in css_files)
    all_defined = set()
    for m in re.finditer(r'--([\w-]+)\s*:', all_css):
        all_defined.add(m.group(1))

    issues = 0

    # 1. Var resolution
    print("1. VAR RESOLUTION")
    for f in css_files:
        refs = re.findall(r'var\(--([\w-]+)\)', contents[f])
        for ref in set(refs):
            if ref not in all_defined and not ref.startswith('font-geist'):
                print(f"  ❌ {f}: var(--{ref}) not defined")
                issues += 1
    if issues == 0: print("  ✅ All var() references resolve")

    # 2. Light/dark parity
    print("\n2. LIGHT/DARK PARITY")
    root_vars = parse_scoped_vars(all_css, ':root')
    dark_vars = parse_scoped_vars(all_css, '.dark')
    skip = {v for v in root_vars if any(v.startswith(p) for p in ['radius','hero-','cta-','primary-button'])}
    missing = (root_vars - skip) - dark_vars
    for v in sorted(missing):
        print(f"  ⚠️  :root has --{v} but .dark does not")
    if not missing: print("  ✅ All semantic tokens have dark overrides")

    # 3. Hue-specific names
    print("\n3. HUE-AGNOSTIC NAMING")
    hue_words = ['violet','purple','peach','orange','lavender','apricot','teal','coral']
    for f, content in contents.items():
        for hue in hue_words:
            # Check token NAMES only (not comments or values)
            for m in re.finditer(r'--([\w-]*' + hue + r'[\w-]*)\s*:', content):
                if 'chart' not in m.group(1):
                    print(f"  ❌ {f}: Token name contains '{hue}': --{m.group(1)}")
                    issues += 1
    if issues == 0: print("  ✅ No hue-specific names in tokens")

    # 4. Typography magic numbers
    print("\n4. TYPOGRAPHY — NO MAGIC NUMBERS")
    for f in css_files:
        util_start = contents[f].find('@layer utilities')
        if util_start < 0: continue
        utils = contents[f][util_start:]
        for line in utils.split('\n'):
            if re.search(r'\.text-(display|heading|body|caption|overline|subtitle|code)', line) and '{' in line:
                bare = re.findall(r'(?:font-size|line-height|font-weight|letter-spacing):\s*(-?[\d.]+(?:px|rem|em)\b)', line)
                if bare:
                    print(f"  ❌ {f}: Bare value {bare} in {line.strip()[:60]}")
                    issues += 1
    if issues == 0: print("  ✅ All typography utilities use var() tokens")

    # 5. Cross-file token consistency
    if ts_files:
        print("\n5. CROSS-FILE CONSISTENCY")
        ts = '\n'.join(contents[f] for f in ts_files)
        if 'var(--size-button-' in ts:
            print("  ✅ Button sizes reference CSS tokens")
        else:
            print("  ⚠️  Button sizes may not reference --size-button-* tokens")

    print(f"\n{'='*50}")
    print(f"{'✅ ALL PASS' if issues == 0 else f'❌ {issues} ISSUES FOUND'}")
    sys.exit(1 if issues > 0 else 0)
