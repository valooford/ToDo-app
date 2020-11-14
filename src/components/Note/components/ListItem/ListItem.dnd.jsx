import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import ListItem from './ListItem';
import ListItemDragLayer from './ListItem.drag-layer';

export const ListDragContext = React.createContext();

function ListItemDnD(props) {
  const {
    isNested,
    value,
    onDrag,
    onOverlap,
    onDragEnd,
    overlapNext,
    isOverlapped,
  } = props;
  const listItemWrapperRef = useContext(ListDragContext); // used to get the limits of dragging

  const [nestState, setNestState] = useState(isNested);

  // handle dragging
  const itemRef = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM }, // source type
    begin: () => {
      const clientRect = itemRef.current.getBoundingClientRect(); // save height
      onDrag(); // set dragging item
      return { isNested, value, height: clientRect.height }; // return props for ListItem
    },
    end: () => {
      onDragEnd(nestState); // reset dragging and overlapped item
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  // get rid of default dragging image (when using custom drag layer)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  // handle dropping on ListItem
  const [dragAreaHeight, setDragAreaHeight] = useState(40); // equals dragging ListItem height
  const [{ isOver, overHeight }, drop] = useDrop({
    accept: dragSourceTypes.LIST_ITEM, // accepted source type
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      overHeight: monitor.isOver() && monitor.getItem().height, // dragging ListItem height
    }),
  });
  // catching ListItem overlap
  useEffect(() => {
    if (isOver) {
      if (!isOverlapped) {
        if (onOverlap) onOverlap(); // setting overlapped item
      } else if (overlapNext) {
        overlapNext(); // overlap next item
      }
    }
  }, [isOver]);

  if (overHeight && overHeight !== dragAreaHeight)
    setDragAreaHeight(overHeight);

  // handle dropping on droppable area
  const [, dropArea] = useDrop({
    accept: dragSourceTypes.LIST_ITEM,
  });
  // choosing droppable areas
  const dropAreaField = useRef(null);

  return (
    <>
      {isDragging && (
        <ListItemDragLayer
          nestState={nestState}
          setNestState={(val) => {
            setNestState(val);
          }}
          wrapperRef={listItemWrapperRef}
          itemClientRect={itemRef.current.getBoundingClientRect()}
        />
      )}
      {isOverlapped && !isDragging && (
        <li
          style={{
            height: `${dragAreaHeight}px`,
            backgroundColor: '#bbb',
          }}
          ref={dropArea(dropAreaField)}
        />
      )}
      <ListItem
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        isHidden={isDragging}
        dragRef={drag}
        ref={drop(itemRef)}
      />
    </>
  );
}

export default React.forwardRef(ListItemDnD);
