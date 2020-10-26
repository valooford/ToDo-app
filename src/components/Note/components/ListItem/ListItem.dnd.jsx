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
  const { isNested, value, onDrag, onOverlap, onDragEnd, isOverlapped } = props;
  const listItemWrapperRef = useContext(ListDragContext); // used to get the limits of dragging
  // handle dragging
  const itemRef = useRef(null);
  // const [itemClientRect, setItemClientRect] = useState(null);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM, isNested, value },
    begin: () => {
      // setItemClientRect(itemRef.current.getBoundingClientRect());
      if (onDrag) onDrag();
    },
    end: () => {
      // setItemClientRect(null);
      onDragEnd();
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  // handle dropping
  const [, drop] = useDrop({
    accept: dragSourceTypes.LIST_ITEM,
    hover: () => {
      onOverlap();
    },
    // drop: (item, monitor) => {
    //   console.log(item);
    // },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });
  // get rid of default dragging image (when using custom drag layer)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  // choosing droppable areas
  const dropAreaField = useRef(null);
  drop(isOverlapped ? dropAreaField : itemRef);

  return (
    <>
      {isDragging && (
        <ListItemDragLayer
          wrapperRef={listItemWrapperRef}
          // itemClientRect={itemClientRect}
          itemRef={itemRef}
        />
      )}
      {isOverlapped && !isDragging && (
        <div
          style={{ height: '40px', backgroundColor: '#bbb' }}
          ref={dropAreaField}
        />
      )}
      {/* {!isDragging && ( */}
      <ListItem
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        isHidden={isDragging}
        dragRef={drag}
        ref={itemRef}
      />
      {/* )} */}
    </>
  );
}

export default React.forwardRef(ListItemDnD);
