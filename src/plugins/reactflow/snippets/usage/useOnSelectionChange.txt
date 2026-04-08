useOnSelectionChange({
  onChange: ({ nodes, edges }) => {
    console.log('Selected nodes:', nodes);
    console.log('Selected edges:', edges);
  },
});