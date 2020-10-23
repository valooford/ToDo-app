import React, { useEffect, useState } from 'react';
import { useDragLayer } from 'react-dnd';

import ListItem from './ListItem';

const layerStyles = {
  position: 'absolute',
  width: '100%',
  pointerEvents: 'none',
  zIndex: 100,
};
export default function ListItemDragLayer() {
  const { item, offsetDifference } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    offsetDifference: monitor.getDifferenceFromInitialOffset(),
  }));
  const [offset, setOffset] = useState(offsetDifference);
  const [shouldRedraw, setShouldRedraw] = useState(true);
  const [timerId] = useState({});
  useEffect(() => {
    if (!shouldRedraw) return;
    setOffset(offsetDifference);
    setShouldRedraw(false);
    timerId.id = setTimeout(() => {
      setShouldRedraw(true);
    }, 40);
  }, [shouldRedraw]);
  useEffect(
    () => () => {
      clearTimeout(timerId.id);
    },
    []
  );

  return (
    <div style={layerStyles}>
      <div style={{ marginTop: `${offset.y}px` }}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ListItem {...item} />
      </div>
    </div>
  );
}
