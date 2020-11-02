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
  nestedState,
  setNestedState,
  wrapperRef,
  itemClientRect,
}) {
  // drag layer properties
  const {
    item: { isNested, ...item },
    offsetDifference,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem() || {},
    offsetDifference: monitor.getDifferenceFromInitialOffset() || {},
  }));
  // correction (because of droppable area appearance)
  const [initialItemTop] = useState(() => itemClientRect.top);
  const shiftY = initialItemTop - itemClientRect.top;
  // final drag image offset
  const [offset, setOffset] = useState({
    y: offsetDifference.y + shiftY,
  });
  const setOffsetY = (y) => {
    setOffset((prev) => ({ ...prev, y }));
  };
  // redrawing by timer to increase performance
  const [shouldRedraw, setShouldRedraw] = useState(true);
  const [timerId] = useState({});
  useEffect(() => {
    if (!shouldRedraw) return;
    const offsetY = offsetDifference.y + shiftY;
    const {
      top: wrapperTop,
      bottom: wrapperBottom,
    } = wrapperRef.current.getBoundingClientRect();
    const { top: itemTop, height: itemHeight } = itemClientRect;
    const addListItemHeight = 46;
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

  const horizontalOffset = offsetDifference.x;
  useEffect(() => {
    if (offsetDifference.x < -20) setNestedState(false);
    if (offsetDifference.x > 20) setNestedState(true);
  }, [horizontalOffset < -20, horizontalOffset > 20]);

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
        <ListItem
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...item}
          isDragging
          isNested={nestedState}
        />
      </div>
    </div>
  );
}
