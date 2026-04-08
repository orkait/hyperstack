import { snippet } from "./loader.js";
import type { ApiEntry } from "./types.js";

const useReactFlowHook: ApiEntry = {
  name: "useReactFlow",
  kind: "hook",
  description:
    "Returns a ReactFlowInstance to update nodes/edges, manipulate the viewport, or query flow state. Does NOT cause re-renders on state changes.",
  importPath: "import { useReactFlow } from '@xyflow/react'",
  returns: "ReactFlowInstance",
  usage: snippet("usage/useReactFlow.txt"),
  examples: [
    {
      title: "Add node on button click",
      category: "interaction",
      code: snippet("examples/useReactFlow/add-node-on-button-click.txt"),
    },
    {
      title: "Delete selected elements",
      category: "interaction",
      code: snippet("examples/useReactFlow/delete-selected-elements.txt"),
    },
  ],
  tips: [
    "Must be used inside <ReactFlowProvider> or <ReactFlow>.",
    "Unlike useNodes/useEdges, this hook won't cause re-renders on state changes. Query state on demand.",
    "Pass useReactFlow() as dependency to useCallback/useEffect — it's not initialized on first render.",
  ],
  relatedApis: ["ReactFlowProvider", "ReactFlowInstance", "useNodes", "useEdges"],
};

const useNodesStateHook: ApiEntry = {
  name: "useNodesState",
  kind: "hook",
  description:
    "Like React's useState but with a built-in change handler for nodes. Quick prototyping of controlled flows without Zustand.",
  importPath: "import { useNodesState } from '@xyflow/react'",
  returns: "[Node[], setNodes, onNodesChange]",
  usage: snippet("usage/useNodesState.txt"),
  examples: [
    {
      title: "Minimal controlled flow",
      category: "quickstart",
      code: snippet("examples/useNodesState/minimal-controlled-flow.txt"),
    },
  ],
  tips: ["For production apps with complex state, prefer Zustand with applyNodeChanges/applyEdgeChanges."],
  relatedApis: ["useEdgesState", "applyNodeChanges", "ReactFlow"],
};

const useEdgesStateHook: ApiEntry = {
  name: "useEdgesState",
  kind: "hook",
  description:
    "Like React's useState but with a built-in change handler for edges. Quick prototyping of controlled flows without Zustand.",
  importPath: "import { useEdgesState } from '@xyflow/react'",
  returns: "[Edge[], setEdges, onEdgesChange]",
  usage: snippet("usage/useEdgesState.txt"),
  examples: [],
  relatedApis: ["useNodesState", "applyEdgeChanges", "addEdge"],
};

const useNodesHook: ApiEntry = {
  name: "useNodes",
  kind: "hook",
  description:
    "Returns the current nodes array. Components using this hook re-render whenever ANY node changes (position, selection, etc).",
  importPath: "import { useNodes } from '@xyflow/react'",
  returns: "Node[]",
  usage: snippet("usage/useNodes.txt"),
  examples: [],
  tips: ["Can cause excessive re-renders. Prefer useReactFlow().getNodes() for on-demand access, or useNodesData for specific node data."],
  relatedApis: ["useEdges", "useReactFlow", "useNodesData"],
};

const useEdgesHook: ApiEntry = {
  name: "useEdges",
  kind: "hook",
  description:
    "Returns the current edges array. Components using this hook re-render whenever any edge changes.",
  importPath: "import { useEdges } from '@xyflow/react'",
  returns: "Edge[]",
  usage: snippet("usage/useEdges.txt"),
  examples: [],
  tips: ["Can cause excessive re-renders. Prefer useReactFlow().getEdges() for on-demand access."],
  relatedApis: ["useNodes", "useReactFlow"],
};

const useNodesDataHook: ApiEntry = {
  name: "useNodesData",
  kind: "hook",
  description:
    "Subscribe to data changes of specific nodes by ID. More efficient than useNodes when you only need certain nodes' data.",
  importPath: "import { useNodesData } from '@xyflow/react'",
  returns: "Pick<Node, 'id' | 'data' | 'type'>[]",
  usage: snippet("usage/useNodesData.txt"),
  examples: [
    {
      title: "Display connected node data",
      category: "custom-nodes",
      code: snippet("examples/useNodesData/display-connected-node-data.txt"),
    },
  ],
  relatedApis: ["useNodes", "useHandleConnections", "useNodeConnections"],
};

const useNodeIdHook: ApiEntry = {
  name: "useNodeId",
  kind: "hook",
  description:
    "Returns the ID of the node it is used inside. Useful deep in the render tree without prop drilling.",
  importPath: "import { useNodeId } from '@xyflow/react'",
  returns: "string | null",
  usage: snippet("usage/useNodeId.txt"),
  examples: [],
  relatedApis: ["useInternalNode", "useNodesData"],
};

const useConnectionHook: ApiEntry = {
  name: "useConnection",
  kind: "hook",
  description:
    "Returns the current connection state during an active connection interaction. Returns null properties when no connection is active. Useful for colorizing handles based on validity.",
  importPath: "import { useConnection } from '@xyflow/react'",
  returns: "ConnectionState",
  usage: snippet("usage/useConnection.txt"),
  examples: [
    {
      title: "Colorize handle during connection",
      category: "connections",
      code: snippet("examples/useConnection/colorize-handle-during-connection.txt"),
    },
  ],
  relatedApis: ["useHandleConnections", "Handle"],
};

const useHandleConnectionsHook: ApiEntry = {
  name: "useHandleConnections",
  kind: "hook",
  description:
    "Returns an array of connections for a specific handle. Re-renders when edge changes affect the handle.",
  importPath: "import { useHandleConnections } from '@xyflow/react'",
  returns: "HandleConnection[]",
  usage: snippet("usage/useHandleConnections.txt"),
  examples: [],
  relatedApis: ["useNodeConnections", "useConnection", "Handle"],
};

const useNodeConnectionsHook: ApiEntry = {
  name: "useNodeConnections",
  kind: "hook",
  description: "Returns an array of connections for a node. Can filter by handle type and ID.",
  importPath: "import { useNodeConnections } from '@xyflow/react'",
  returns: "NodeConnection[]",
  usage: snippet("usage/useNodeConnections.txt"),
  examples: [],
  relatedApis: ["useHandleConnections", "useConnection"],
};

const useOnSelectionChangeHook: ApiEntry = {
  name: "useOnSelectionChange",
  kind: "hook",
  description: "Listen for changes to both node and edge selection.",
  importPath: "import { useOnSelectionChange } from '@xyflow/react'",
  usage: snippet("usage/useOnSelectionChange.txt"),
  examples: [],
  relatedApis: ["useReactFlow", "ReactFlow"],
};

const useOnViewportChangeHook: ApiEntry = {
  name: "useOnViewportChange",
  kind: "hook",
  description:
    "Listen for viewport changes (pan, zoom). Provides callbacks for start, change, and end phases.",
  importPath: "import { useOnViewportChange } from '@xyflow/react'",
  usage: snippet("usage/useOnViewportChange.txt"),
  examples: [],
  relatedApis: ["useViewport", "useReactFlow"],
};

const useViewportHook: ApiEntry = {
  name: "useViewport",
  kind: "hook",
  description: "Returns the current viewport { x, y, zoom }. Re-renders on every viewport change.",
  importPath: "import { useViewport } from '@xyflow/react'",
  returns: "Viewport",
  usage: snippet("usage/useViewport.txt"),
  examples: [],
  tips: ["Causes re-render on every pan/zoom. Use useOnViewportChange for event-based approach, or useReactFlow().getViewport() for on-demand."],
  relatedApis: ["useOnViewportChange", "useReactFlow"],
};

const useStoreHook: ApiEntry = {
  name: "useStore",
  kind: "hook",
  description:
    "Subscribe to internal React Flow Zustand store. Re-exported from Zustand. Use selectors to minimize re-renders.",
  importPath: "import { useStore } from '@xyflow/react'",
  usage: snippet("usage/useStore.txt"),
  examples: [],
  tips: ["Always use a selector function to avoid re-rendering on every state change.", "For most use cases, prefer useReactFlow, useNodes, or useEdges instead."],
  relatedApis: ["useStoreApi", "useReactFlow"],
};

const useStoreApiHook: ApiEntry = {
  name: "useStoreApi",
  kind: "hook",
  description:
    "Returns the Zustand store object directly for on-demand state access without causing re-renders.",
  importPath: "import { useStoreApi } from '@xyflow/react'",
  returns: "StoreApi",
  usage: snippet("usage/useStoreApi.txt"),
  examples: [],
  relatedApis: ["useStore", "useReactFlow"],
};

const useNodesInitializedHook: ApiEntry = {
  name: "useNodesInitialized",
  kind: "hook",
  description:
    "Returns whether all nodes have been measured and given width/height. Returns false when new nodes are added, then true once measured.",
  importPath: "import { useNodesInitialized } from '@xyflow/react'",
  returns: "boolean",
  usage: snippet("usage/useNodesInitialized.txt"),
  examples: [
    {
      title: "Auto-layout on mount",
      category: "layout",
      code: snippet("examples/useNodesInitialized/auto-layout-on-mount.txt"),
    },
  ],
  relatedApis: ["useReactFlow"],
};

const useUpdateNodeInternalsHook: ApiEntry = {
  name: "useUpdateNodeInternals",
  kind: "hook",
  description:
    "Notify React Flow when you programmatically add/remove handles or change handle positions on a node.",
  importPath: "import { useUpdateNodeInternals } from '@xyflow/react'",
  returns: "(nodeId: string | string[]) => void",
  usage: snippet("usage/useUpdateNodeInternals.txt"),
  examples: [],
  tips: ["Call this after dynamically adding/removing Handle components inside a custom node."],
  relatedApis: ["Handle"],
};

const useKeyPressHook: ApiEntry = {
  name: "useKeyPress",
  kind: "hook",
  description: "Listen for specific key codes and returns whether they are currently pressed.",
  importPath: "import { useKeyPress } from '@xyflow/react'",
  returns: "boolean",
  usage: snippet("usage/useKeyPress.txt"),
  examples: [],
  relatedApis: ["ReactFlow"],
};

const useInternalNodeHook: ApiEntry = {
  name: "useInternalNode",
  kind: "hook",
  description: "Returns an InternalNode object with additional computed properties like positionAbsolute and measured dimensions.",
  importPath: "import { useInternalNode } from '@xyflow/react'",
  returns: "InternalNode | undefined",
  usage: snippet("usage/useInternalNode.txt"),
  examples: [],
  relatedApis: ["useReactFlow", "useNodeId"],
};

export const HOOK_APIS: ApiEntry[] = [
  useReactFlowHook,
  useNodesStateHook,
  useEdgesStateHook,
  useNodesHook,
  useEdgesHook,
  useNodesDataHook,
  useNodeIdHook,
  useConnectionHook,
  useHandleConnectionsHook,
  useNodeConnectionsHook,
  useOnSelectionChangeHook,
  useOnViewportChangeHook,
  useViewportHook,
  useStoreHook,
  useStoreApiHook,
  useNodesInitializedHook,
  useUpdateNodeInternalsHook,
  useKeyPressHook,
  useInternalNodeHook,
];
