# Shadcn/UI MCP Plugin (Base UI Edition)

This MCP plugin provides ground-truth information about the Shadcn/UI (Base UI) component library. It is designed to be registered with the **Hyperstack** MCP server.

## Features

- **\`shadcn_list_components\`**: List all components in the \`packages/ui/src\` directory.
- **\`shadcn_get_component\`**: Get details and full source code for any component.
- **\`shadcn_get_rules\`**: Get the architectural guidelines (Base UI, Tailwind v4, data-slots).
- **\`shadcn_get_usage_example\`**: (Coming soon) Get Storybook stories as usage examples.

## Registration

To register this plugin with Hyperstack, add it to the \`loadPlugins\` call in \`hyperstack/src/index.ts\`:

\`\`\`typescript
import { shadcnPlugin } from "./plugins/shadcn/index.js";

// ... inside loadPlugins ...
loadPlugins(server, [
  // ... existing plugins ...
  shadcnPlugin,
]);
\`\`\`

## Skill Integration

This plugin is designed to be used with the \`shadcn-expert\` skill. The skill instructs the LLM on how to use these tools to build, audit, and refactor components following the library's strict architectural rules.

