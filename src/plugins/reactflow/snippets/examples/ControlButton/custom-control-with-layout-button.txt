import { Controls, ControlButton } from '@xyflow/react';

function FlowControls({ onLayout }) {
  return (
    <Controls>
      <ControlButton onClick={() => onLayout('TB')} title="Vertical layout">
        ↕
      </ControlButton>
      <ControlButton onClick={() => onLayout('LR')} title="Horizontal layout">
        ↔
      </ControlButton>
    </Controls>
  );
}