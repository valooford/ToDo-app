import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import Note from './Note.container';
import NoteDragLayer from './Note.drag-layer';

function NoteDnD({ isOverlapped, onOverlap, ...props }) {
  const { id, noteRef } = props;

  // handle dragging
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.NOTE },
    end: () => {
      onOverlap(null);
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  // get rid of default dragging image (when using custom drag layer)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  // handle dropping
  const [{ isOver }, drop] = useDrop({
    accept: dragSourceTypes.NOTE, // accepted source type
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  useEffect(() => {
    if (isOver) {
      if (!isOverlapped) {
        // onOverlap(id);
        // console.log(`note ${id} is overlapped`);
      }
    }
  }, [isOver]);

  return (
    <>
      {isDragging && <NoteDragLayer id={id} key="dragging" />}
      {isOverlapped && !isDragging && (
        <li
          style={{
            // height: `${dragAreaHeight}px`,
            height: '100px',
            backgroundColor: '#bbb',
          }}
          // ref={dropArea(dropAreaField)}
        />
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Note {...props} noteRef={drag(drop(noteRef))} />
    </>
  );
}

function mapStateToProps(state, { id, overlappedItem }) {
  return {
    isOverlapped: id === overlappedItem,
  };
}
export default connect(mapStateToProps, null)(NoteDnD);
