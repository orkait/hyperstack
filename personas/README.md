# Personas (Layer 4)

Personas are domain-expert lenses that `hyper` engages for a domain. Each persona
binds an MCP plugin (ground-truth), one or more skills (process), and a role
identity via `persona.json`. Two modes:

- **gate** - owns a risk and blocks before execution (e.g. `product-manager`).
- **capability** - produces domain output (e.g. `marketing`).

The persona registry (`src/personas/registry.ts`) loads manifests; the bootstrap
compiles a Personas layer so `hyper` knows which personas exist and when they engage.

| Persona | Mode | Owns |
|---|---|---|
| `product-manager` | gate | value + viability product risk |
| `marketing` | capability | positioning, messaging, copy, brand, GTM |

## Anatomy of a persona

```
personas/
  persona.schema.json          manifest contract
  <id>/
    persona.json               binds plugin + skills + agent + gate_policy
    PROFILE.md                 identity, mission, voice
    LIFECYCLE.md               engage criteria, gate steps, handback
    CHECKS.md                  the falsifiable gate checklist
```

The bound plugin lives under `src/plugins/<plugin>/` and the skill under
`skills/<skill>/` (registered through their own ecosystems); the persona owns
them logically via the manifest, it does not physically contain them.
