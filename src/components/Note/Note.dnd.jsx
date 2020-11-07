import React from 'react';
import { useDrag } from 'react-dnd';
// import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import Note from './Note.container';
// import NoteDragLayer from './Note.drag-layer';

export default function NoteDnD(props) {
  const { noteRef } = props;

  // handle dragging
  const [, drag /* , preview */] = useDrag({
    item: { type: dragSourceTypes.NOTE },
  });
  // get rid of default dragging image (when using custom drag layer)
  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Note {...props} noteRef={noteRef ? drag(noteRef) : drag} />;
}
