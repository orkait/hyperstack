<ReactFlow nodes={nodes} edges={edges}>
  <MiniMap nodeColor={(n) => n.type === 'input' ? '#6366f1' : '#94a3b8'} pannable zoomable />
</ReactFlow>