const reactFlow = useReactFlow();

// Add a node
reactFlow.addNodes({ id: 'new', position: { x: 100, y: 100 }, data: { label: 'New' } });

// Fit view with animation
reactFlow.fitView({ duration: 500, padding: 0.2 });

// Export flow
const json = reactFlow.toObject();