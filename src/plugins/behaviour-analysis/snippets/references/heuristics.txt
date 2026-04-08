# Heuristic Evaluation Questions

Detailed questions per Nielsen's heuristic, adapted for interactive data visualizations and modern web apps.

## 1. Visibility of System Status

- Is the current view mode clearly indicated (active tab, highlight, selected state)?
- Is there a loading indicator when async operations run?
- Does the active/selected result show a distinct visual treatment?
- When a filter is active, is it obvious that results are filtered?
- Do sliders/toggles show their current value?
- After dragging a node, is the settled state visually clear?
- Is the current layout mode (dagre/cluster) clearly indicated?

## 2. Match Between System and Real World

- Do button labels describe what they DO, not what they ARE? ("Clear" not "X")
- Are view mode names intuitive? ("Live" vs "Results" vs "Highlight" — does a new user understand these?)
- Do edge/node labels match the domain vocabulary?
- Are slider labels clear about what they control?

## 3. User Control and Freedom

- Can every highlight be cleared?
- Can every mode switch be reversed?
- Can collapsed groups be re-expanded?
- Can the user undo the last action?
- Is there a "reset to defaults" for settings?
- Can the user escape from every state back to a clean view?

## 4. Consistency and Standards

- Do all "clear" actions clear the same scope of state?
- Do all click targets have hover states?
- Are all buttons the same size/style for the same level of importance?
- Does clicking behave the same way on result cards, nodes, edges?
- Do both layout modes support the same view modes identically?
- Are keyboard shortcuts consistent with platform conventions?

## 5. Error Prevention

- Can slider values be set to break the layout?
- Can the user reach a state where no nodes are visible and there's no indication why?
- Can rapid clicking cause race conditions?
- Does the UI prevent invalid state combinations?
- Are destructive actions (reset, clear all) confirmed or easily undoable?

## 6. Recognition Rather Than Recall

- Is the current state visible at all times (not hidden in a menu)?
- Can the user see which result is highlighted without scrolling the results panel?
- Are collapsed group contents summarized (count, kind)?
- Is the search filter text always visible when active?

## 7. Flexibility and Efficiency

- Can power users access functions via keyboard?
- Are there shortcuts for common workflows (run + highlight)?
- Can the user adjust layout parameters without opening a dialog?
- Is the most common action the easiest to perform?

## 8. Aesthetic and Minimalist Design

- Are controls only shown when relevant? (dagre sliders hidden in cluster mode)
- Is information density appropriate — not too sparse, not overwhelming?
- Are animations purposeful (communicate state change) or decorative (just pretty)?
- Do hover/highlight effects add information or just noise?

## 9. Help Users Recover from Errors

- What happens when the API is unreachable?
- What happens when a query returns an error?
- What happens when the graph data is malformed?
- Are error messages actionable ("server unreachable — is it running?")?
- Can the user retry failed operations?

## 10. Accessibility

- Can all interactive elements be reached via keyboard (Tab)?
- Do interactive elements have focus indicators?
- Is there sufficient color contrast for all states?
- Do animations respect `prefers-reduced-motion`?
- Are drag interactions achievable without a mouse?
- Do screen readers announce state changes (highlights, mode switches)?
- Are ARIA labels present on non-text interactive elements?

## Visualization-Specific Heuristics

Beyond Nielsen's 10, for data visualizations check:

### Data-Ink Ratio
- Is every visual element carrying information?
- Can any decoration be removed without losing meaning?

### Gestalt Principles
- Are related nodes visually grouped (proximity, color, enclosure)?
- Do edges clearly connect their endpoints?
- Is the visual hierarchy clear (important nodes larger/brighter)?

### Interaction Affordance
- Do draggable things look draggable (cursor change)?
- Do clickable things look clickable (hover effect)?
- Are non-interactive elements clearly non-interactive?

### State Feedback Latency
- Is feedback immediate (<100ms) for direct manipulation (drag)?
- Is feedback fast (<300ms) for triggered actions (click to highlight)?
- Are long operations (layout compute) shown with progress indication?

## Sources

- [Nielsen Norman Group: 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Maze: How to Conduct a Heuristic Evaluation](https://maze.co/guides/usability-testing/heuristic-evaluation/)
- [Adam Fard: Heuristic Evaluation Guide](https://adamfard.com/blog/heuristic-evaluation)
