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
  const { isNested, value, onDrag, onOverlap, onDragEnd, isOverlapped } = props;
  const listItemWrapperRef = useContext(ListDragContext); // used to get the limits of dragging
  // handle dragging
  const itemRef = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM },
    begin: () => {
      const clientRect = itemRef.current.getBoundingClientRect();
      if (onDrag) onDrag();
      return { isNested, value, height: clientRect.height };
    },
    end: () => {
      onDragEnd();
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  // handle dropping
  const [dragAreaHeight, setDragAreaHeight] = useState(40);
  const [{ overHeight }, drop] = useDrop({
    accept: dragSourceTypes.LIST_ITEM,
    hover: () => {
      onOverlap();
    },
    // drop: (item, monitor) => {
    //   console.log(item);
    // },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      overHeight: monitor.isOver() && monitor.getItem().height,
    }),
  });
  if (overHeight && overHeight !== dragAreaHeight)
    setDragAreaHeight(overHeight);
  const [{ shouldCollapse }, collapseDrop] = useDrop({
    accept: dragSourceTypes.LIST_ITEM,
    collect: (monitor) => ({ shouldCollapse: !!monitor.isOver() }),
  });
  useEffect(() => {
    if (!onDragEnd || !shouldCollapse || !isOverlapped) return;
    onDragEnd();
  }, [shouldCollapse]);
  // get rid of default dragging image (when using custom drag layer)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  // choosing droppable areas
  const dropAreaField = useRef(null);
  drop(isOverlapped && !isDragging ? dropAreaField : itemRef);

  return (
    <>
      {isDragging && (
        <ListItemDragLayer
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
          ref={dropAreaField}
        />
      )}
      <ListItem
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        isHidden={isDragging}
        dragRef={drag}
        ref={collapseDrop(itemRef)}
      />
    </>
  );
}

export default React.forwardRef(ListItemDnD);
