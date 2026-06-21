# Personas (Layer 4)

Personas are judgment lenses that own and gate a class of decision before
execution. Each persona binds an MCP plugin (ground-truth), one or more skills
(process + gate), and a role identity via `persona.json`. The persona registry
(`src/personas/registry.ts`) loads manifests; the bootstrap compiles a Personas
layer so `hyper` knows which personas exist and when they engage.

| Persona | Owns | First |
|---|---|---|
| `product-manager` | value + viability product risk | yes |

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
