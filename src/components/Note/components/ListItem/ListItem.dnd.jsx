import React, { useContext, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import ListItem from './ListItem';
import ListItemDragLayer from './ListItem.drag-layer';

export const ListDragContext = React.createContext();

function ListItemDnD(props) {
  const { isNested, value } = props;
  const listItemWrapperRef = useContext(ListDragContext);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM, isNested, value },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  // const itemRef = drag;
  const itemRef = useRef(null);
  return (
    <>
      {isDragging && (
        <ListItemDragLayer wrapperRef={listItemWrapperRef} itemRef={itemRef} />
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ListItem {...props} dragRef={drag(itemRef)} />
      {/* <ListItem {...props} ref={preview} dragRef={drag} /> */}
    </>
  );
}

export default React.forwardRef(ListItemDnD);
