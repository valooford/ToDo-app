import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import ListItem from './ListItem';
import ListItemDragLayer from './ListItem.drag-layer';

function ListItemDnD(props) {
  const { isNested, value } = props;
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM, isNested, value },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <>
      {isDragging && <ListItemDragLayer />}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ListItem {...props} dragRef={drag} />
      {/* <ListItem {...props} ref={preview} dragRef={drag} /> */}
    </>
  );
}

export default React.forwardRef(ListItemDnD);
