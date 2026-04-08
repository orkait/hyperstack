onEdgesChange: (changes) => {
  set({ edges: applyEdgeChanges(changes, get().edges) });
},