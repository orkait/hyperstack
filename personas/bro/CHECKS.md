# Bro Quality Checks (falsifiable)

- [ ] Tool-call inventory was checked (or session cache used) BEFORE the first subtask spun.
- [ ] The challenge was decomposed; each sub-problem has a named approach and an explicit combine step.
- [ ] Every factual claim in the output is backed by evidence (file read, command output, MCP response, or web reference); heuristic calls are labeled as heuristic.
- [ ] No comment poisoning: comments trimmed or omitted unless required for correctness or non-obvious logic.
- [ ] Scale and optimization were considered and stated, not assumed.
- [ ] Any task over ~2 minutes ran under a background monitor, and the monitor was killed after.
- [ ] A failing approach triggered stop -> retrospective -> re-analyze -> re-allocate (no grinding).
- [ ] UI work followed the gear change: interaction flow -> behaviour-analysis -> ui-ux -> designer.
- [ ] Output uses padded UTF-8 tables/diagrams where they beat prose.
- [ ] Handback to `hyper` happened; no self-ship, no completion claim.
