import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import dragSourceTypes from '@/dragSourceTypes';

import Note from './Note';
import NoteDragLayer from './Note.drag-layer';

function NoteDnD({
  isOverlapped,
  groupName,
  onOverlap,
  onDragEnd,
  overlapNext,
  noteRef,
  ...props
}) {
  const { id } = props;

  // handle dragging
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: `${dragSourceTypes.NOTE}-${groupName}` },
    begin: () => {
      const clientRect = noteRef.current.getBoundingClientRect(); // save height
      overlapNext(); // overlap next item
      return { height: clientRect.height }; // return props for ListItem
    },
    end: () => {
      onDragEnd();
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  // get rid of default dragging image (when using custom drag layer)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  // handle dropping
  const [{ isOver, overHeight }, drop] = useDrop({
    accept: `${dragSourceTypes.NOTE}-${groupName}`, // accepted source type
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      overHeight: monitor.isOver() && monitor.getItem().height,
    }),
  });
  const [dragAreaHeight, setDragAreaHeight] = useState(null);
  useEffect(() => {
    if (isOver && !isDragging) {
      if (!isOverlapped) {
        onOverlap();
      } else {
        overlapNext(); // overlap next item
      }
    }
  }, [isOver]);
  useEffect(() => {
    if (overHeight) {
      setDragAreaHeight(overHeight);
    }
  }, [overHeight]);

  // handle dropping on droppable area
  const [, dropArea] = useDrop({
    accept: `${dragSourceTypes.NOTE}-${groupName}`,
  });

  return (
    <>
      {isDragging && <NoteDragLayer id={id} key="dragging" />}
      {isOverlapped && !isDragging && (
        <div
          style={{
            height: `${dragAreaHeight || 140}px`, // ! equals 0 when overlapNext() on drag begin is fired
          }}
          ref={dropArea}
        />
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Note {...props} noteRef={drag(drop(noteRef))} isHidden={isDragging} />
    </>
  );
}

// function mapStateToProps(state, { id, overlappedNote }) {
//   return {
//     isOverlapped: id === overlappedNote,
//   };
// }
// export default connect(mapStateToProps, null)(NoteDnD);
export default connect(null, null)(NoteDnD);
