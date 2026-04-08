onNodesChange: (changes) => {
  set({ nodes: applyNodeChanges(changes, get().nodes) });
},