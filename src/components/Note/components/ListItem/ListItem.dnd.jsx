import React, { useContext, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import ListItem from './ListItem';
import ListItemDragLayer from './ListItem.drag-layer';

export const ListDragContext = React.createContext();

function ListItemDnD(props) {
  const { isNested, value, onOverlap, onDrop } = props;
  const listItemWrapperRef = useContext(ListDragContext);

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM, isNested, value },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [{ isOverlapped }, drop] = useDrop({
    accept: dragSourceTypes.LIST_ITEM,
    drop: (/* item, monitor */) => {
      onDrop();
    },
    collect: (monitor) => ({ isOverlapped: !!monitor.isOver() }),
  });
  if (isOverlapped) onOverlap();

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  const itemRef = useRef(null);
  return (
    <>
      {isDragging && (
        <ListItemDragLayer wrapperRef={listItemWrapperRef} itemRef={itemRef} />
      )}
      <ListItem
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        isOverlapped={isOverlapped}
        isHidden={isDragging}
        dragRef={drag}
        droppableRef={drop(itemRef)}
      />
      {/* <ListItem {...props} ref={preview} dragRef={drag} /> */}
    </>
  );
}

export default React.forwardRef(ListItemDnD);
