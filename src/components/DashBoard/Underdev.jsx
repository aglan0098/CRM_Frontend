import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

export default function UnderDevelopmentBox() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 300, height: 120 });

  return (
    <Rnd
      size={size}
      position={position}
      bounds="window"
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        setPosition(pos);
      }}
      style={{
        border: '2px dashed #0d6efd',
        backgroundColor: '#d4edda',
        color: '#084298',
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 600,
        textAlign: 'center',
        userSelect: 'none',
        transition: 'all 0.3s ease',
      }}
      dragHandleClassName="drag-handle"
    >
      <div role="status" aria-live="polite">
        🚧 This section is under development. Stay tuned! 🚧
      </div>
    </Rnd>
  );
}
