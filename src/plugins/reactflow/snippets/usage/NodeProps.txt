import type { NodeProps, Node } from '@xyflow/react';

// Step 1: Define your node type
type CounterNode = Node<{ initialCount?: number }, 'counter'>;

// Step 2: Use NodeProps<YourNodeType> as the prop type
export default function CounterNode(props: NodeProps<CounterNode>) {
  const [count, setCount] = useState(props.data?.initialCount ?? 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button className="nodrag" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// Step 3: Register in nodeTypes (outside component!)
const nodeTypes = { counter: CounterNode };