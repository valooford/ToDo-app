import React from 'react';
import { useDragLayer } from 'react-dnd';

import Note from './Note.container';

const layerStyles = {
  position: 'absolute',
  width: '100%',
  pointerEvents: 'none',
  zIndex: 100,
};

export default function NoteDragLayer({ id }) {
  // drag layer properties
  const { offsetDifference } = useDragLayer((monitor) => ({
    item: monitor.getItem() || {},
    offsetDifference: monitor.getDifferenceFromInitialOffset() || {},
  }));

  return (
    <div style={layerStyles}>
      <div
        style={{ marginTop: `${offsetDifference.y}px`, marginLeft: '-15px' }}
      >
        <Note id={id} />
      </div>
    </div>
  );
}
