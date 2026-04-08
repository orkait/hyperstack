import { EdgeToolbar } from '@xyflow/react';

function CustomEdge(props) {
  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeToolbar>
        <button>Edit</button>
      </EdgeToolbar>
    </>
  );
}