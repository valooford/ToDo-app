import React, { useEffect, useState } from 'react';
import { useDragLayer } from 'react-dnd';

import ListItem from './ListItem';

const layerStyles = {
  position: 'absolute',
  width: '100%',
  pointerEvents: 'none',
  zIndex: 100,
};

export default function ListItemDragLayer({
  wrapperRef,
  // itemClientRect,
  itemRef,
}) {
  // drag layer properties
  const { item, offsetDifference } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    offsetDifference: monitor.getDifferenceFromInitialOffset() || {},
  }));
  // final drag image offset
  const [offset, setOffset] = useState({ y: offsetDifference.y });
  const setOffsetY = (y) => {
    setOffset((prev) => ({ ...prev, y }));
  };
  // redrawing by timer to increase performance
  const [shouldRedraw, setShouldRedraw] = useState(true);
  const [timerId] = useState({});
  const [itemClientRect] = useState(() =>
    itemRef.current.getBoundingClientRect()
  );
  useEffect(() => {
    if (!shouldRedraw) return;
    const offsetY = offsetDifference.y;
    const {
      top: wrapperTop,
      bottom: wrapperBottom,
    } = wrapperRef.current.getBoundingClientRect();
    const { top: itemTop, height: itemHeight } = itemClientRect;
    const addListItemHeight = 46; // 34h + 6*2pad
    if (itemTop + offsetY < wrapperTop) {
      setOffsetY(wrapperTop - itemTop);
    } else if (
      itemTop + offsetY + itemHeight >
      wrapperBottom - addListItemHeight
    ) {
      setOffsetY(wrapperBottom - itemTop - itemHeight - addListItemHeight);
    } else {
      setOffsetY(offsetY);
    }
    setShouldRedraw(false);
    timerId.id = setTimeout(() => {
      setShouldRedraw(true);
    }, 40);
  }, [shouldRedraw]);

  // cleaning up
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
        <ListItem {...item} isDragging />
      </div>
    </div>
  );
}
