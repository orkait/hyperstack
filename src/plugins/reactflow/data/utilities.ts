import { snippet } from "./loader.js";
import type { ApiEntry } from "./types.js";

const addEdgeUtil: ApiEntry = {
  name: "addEdge",
  kind: "utility",
  description:
    "Convenience function to add a new edge to an array. Validates and prevents duplicates.",
  importPath: "import { addEdge } from '@xyflow/react'",
  returns: "Edge[]",
  usage: snippet("usage/addEdge.txt"),
  examples: [],
  relatedApis: ["ReactFlow", "useEdgesState"],
};

const applyNodeChangesUtil: ApiEntry = {
  name: "applyNodeChanges",
  kind: "utility",
  description:
    "Apply an array of NodeChange objects to your nodes array. Used in Zustand stores for controlled flows.",
  importPath: "import { applyNodeChanges } from '@xyflow/react'",
  returns: "Node[]",
  usage: snippet("usage/applyNodeChanges.txt"),
  examples: [],
  relatedApis: ["applyEdgeChanges", "useNodesState"],
};

const applyEdgeChangesUtil: ApiEntry = {
  name: "applyEdgeChanges",
  kind: "utility",
  description:
    "Apply an array of EdgeChange objects to your edges array. Used in Zustand stores for controlled flows.",
  importPath: "import { applyEdgeChanges } from '@xyflow/react'",
  returns: "Edge[]",
  usage: snippet("usage/applyEdgeChanges.txt"),
  examples: [],
  relatedApis: ["applyNodeChanges", "useEdgesState"],
};

const getBezierPathUtil: ApiEntry = {
  name: "getBezierPath",
  kind: "utility",
  description: "Returns SVG path string and label position for a bezier edge between two points.",
  importPath: "import { getBezierPath } from '@xyflow/react'",
  returns: "[path: string, labelX: number, labelY: number, offsetX: number, offsetY: number]",
  usage: snippet("usage/getBezierPath.txt"),
  examples: [],
  relatedApis: ["getSmoothStepPath", "getStraightPath", "getSimpleBezierPath", "BaseEdge"],
};

const getSmoothStepPathUtil: ApiEntry = {
  name: "getSmoothStepPath",
  kind: "utility",
  description: "Returns SVG path string for a stepped/rounded edge with configurable border radius.",
  importPath: "import { getSmoothStepPath } from '@xyflow/react'",
  returns: "[path, labelX, labelY, offsetX, offsetY]",
  usage: snippet("usage/getSmoothStepPath.txt"),
  examples: [],
  relatedApis: ["getBezierPath", "getStraightPath"],
};

const getStraightPathUtil: ApiEntry = {
  name: "getStraightPath",
  kind: "utility",
  description: "Calculates a straight line path between two points.",
  importPath: "import { getStraightPath } from '@xyflow/react'",
  returns: "[path, labelX, labelY]",
  usage: snippet("usage/getStraightPath.txt"),
  examples: [],
  relatedApis: ["getBezierPath", "getSmoothStepPath"],
};

const getSimpleBezierPathUtil: ApiEntry = {
  name: "getSimpleBezierPath",
  kind: "utility",
  description: "Returns SVG path for a simple bezier curve (less pronounced curve than getBezierPath).",
  importPath: "import { getSimpleBezierPath } from '@xyflow/react'",
  returns: "[path, labelX, labelY, offsetX, offsetY]",
  usage: snippet("usage/getSimpleBezierPath.txt"),
  examples: [],
  relatedApis: ["getBezierPath"],
};

const getConnectedEdgesUtil: ApiEntry = {
  name: "getConnectedEdges",
  kind: "utility",
  description: "Given nodes and all edges, returns edges that connect any of the given nodes together.",
  importPath: "import { getConnectedEdges } from '@xyflow/react'",
  returns: "Edge[]",
  usage: snippet("usage/getConnectedEdges.txt"),
  examples: [],
  relatedApis: ["getIncomers", "getOutgoers"],
};

const getIncomersUtil: ApiEntry = {
  name: "getIncomers",
  kind: "utility",
  description: "Returns nodes connected to the given node as the source of an edge (upstream nodes).",
  importPath: "import { getIncomers } from '@xyflow/react'",
  returns: "Node[]",
  usage: snippet("usage/getIncomers.txt"),
  examples: [],
  relatedApis: ["getOutgoers", "getConnectedEdges"],
};

const getOutgoersUtil: ApiEntry = {
  name: "getOutgoers",
  kind: "utility",
  description: "Returns nodes connected to the given node as the target of an edge (downstream nodes).",
  importPath: "import { getOutgoers } from '@xyflow/react'",
  returns: "Node[]",
  usage: snippet("usage/getOutgoers.txt"),
  examples: [],
  relatedApis: ["getIncomers", "getConnectedEdges"],
};

const getNodesBoundsUtil: ApiEntry = {
  name: "getNodesBounds",
  kind: "utility",
  description: "Returns the bounding box containing all given nodes. Useful with getViewportForBounds.",
  importPath: "import { getNodesBounds } from '@xyflow/react'",
  returns: "Rect",
  usage: snippet("usage/getNodesBounds.txt"),
  examples: [],
  relatedApis: ["getViewportForBounds"],
};

const getViewportForBoundsUtil: ApiEntry = {
  name: "getViewportForBounds",
  kind: "utility",
  description: "Returns the viewport to fit given bounds. Useful for server-side viewport calculation or custom fit-view logic.",
  importPath: "import { getViewportForBounds } from '@xyflow/react'",
  returns: "Viewport",
  usage: snippet("usage/getViewportForBounds.txt"),
  examples: [],
  relatedApis: ["getNodesBounds", "useReactFlow"],
};

const reconnectEdgeUtil: ApiEntry = {
  name: "reconnectEdge",
  kind: "utility",
  description: "Reconnect an existing edge with new source/target. Used in onReconnect handlers.",
  importPath: "import { reconnectEdge } from '@xyflow/react'",
  returns: "Edge[]",
  usage: snippet("usage/reconnectEdge.txt"),
  examples: [
    {
      title: "Edge reconnection",
      category: "connections",
      code: snippet("examples/reconnectEdge/edge-reconnection.txt"),
    },
  ],
  relatedApis: ["addEdge", "ReactFlow"],
};

const isNodeUtil: ApiEntry = {
  name: "isNode",
  kind: "utility",
  description: "Type guard to check if an object is a valid Node.",
  importPath: "import { isNode } from '@xyflow/react'",
  returns: "boolean",
  usage: snippet("usage/isNode.txt"),
  examples: [],
  relatedApis: ["isEdge"],
};

const isEdgeUtil: ApiEntry = {
  name: "isEdge",
  kind: "utility",
  description: "Type guard to check if an object is a valid Edge.",
  importPath: "import { isEdge } from '@xyflow/react'",
  returns: "boolean",
  usage: snippet("usage/isEdge.txt"),
  examples: [],
  relatedApis: ["isNode"],
};

export const UTILITY_APIS: ApiEntry[] = [
  addEdgeUtil,
  applyNodeChangesUtil,
  applyEdgeChangesUtil,
  getBezierPathUtil,
  getSmoothStepPathUtil,
  getStraightPathUtil,
  getSimpleBezierPathUtil,
  getConnectedEdgesUtil,
  getIncomersUtil,
  getOutgoersUtil,
  getNodesBoundsUtil,
  getViewportForBoundsUtil,
  reconnectEdgeUtil,
  isNodeUtil,
  isEdgeUtil,
];
