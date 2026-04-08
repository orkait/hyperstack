const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

<ReactFlow nodes={nodes} onNodesChange={onNodesChange} />