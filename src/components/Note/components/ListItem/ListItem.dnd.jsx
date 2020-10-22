import React from 'react';
import { useDrag } from 'react-dnd';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import ListItem from './ListItem';
// import ListItemDragLayer from './ListItem.drag-layer';

function ListItemDnD(props) {
  const { isNested, value } = props;
  const [, drag, preview] = useDrag({
    item: { type: dragSourceTypes.LIST_ITEM },
    collect: () => ({
      isNested,
      value,
    }),
  });
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ListItem {...props} ref={preview} dragRef={drag} />
      {/* <ListItemDragLayer /> */}
    </>
  );
}

export default React.forwardRef(ListItemDnD);
