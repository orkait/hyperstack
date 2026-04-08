type MyNodeData = { label: string; status: 'active' | 'inactive' };
type MyNode = Node<MyNodeData, 'statusNode'>;

const node: MyNode = {
  id: '1',
  type: 'statusNode',
  position: { x: 0, y: 0 },
  data: { label: 'Server', status: 'active' },
};
