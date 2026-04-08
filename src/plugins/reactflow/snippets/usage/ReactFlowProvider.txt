import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
      <Sidebar />  {/* Can use useReactFlow() here */}
    </ReactFlowProvider>
  );
}