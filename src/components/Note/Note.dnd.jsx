import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

/* eslint-disable import/no-unresolved */
import dragSourceTypes from '@/dragSourceTypes';
/* eslint-enable import/no-unresolved */

import Note from './Note.container';
import NoteDragLayer from './Note.drag-layer';

function NoteDnD({ isOverlapped, onOverlap, onDragEnd, ...props }) {
  // const { id, noteRef } = props;

  const { id } = props;
  // seems like noteRef must be stable across renders
  const noteRef = useRef(null);

  // handle dragging
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: dragSourceTypes.NOTE },
    begin: () => {
      const clientRect = noteRef.current.getBoundingClientRect(); // save height
      return { height: clientRect.height }; // return props for ListItem
    },
    end: () => {
      onDragEnd(id);
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  // get rid of default dragging image (when using custom drag layer)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  // handle dropping
  const [{ isOver, overHeight }, drop] = useDrop({
    accept: dragSourceTypes.NOTE, // accepted source type
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      overHeight: monitor.isOver() && monitor.getItem().height,
    }),
  });
  const [dragAreaHeight, setDragAreaHeight] = useState(null);
  useEffect(() => {
    if (isOver && !isDragging) {
      if (!isOverlapped) {
        onOverlap(id);
        setDragAreaHeight(overHeight);
      }
    }
  }, [isOver]);

  // handle dropping on droppable area
  const [, dropArea] = useDrop({
    accept: dragSourceTypes.NOTE,
  });

  return (
    <>
      {isDragging && <NoteDragLayer id={id} key="dragging" />}
      {isOverlapped && !isDragging && (
        <div
          style={{
            height: `${dragAreaHeight}px`,
            // height: '100px',
            backgroundColor: '#bbb',
          }}
          ref={dropArea}
        />
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Note {...props} noteRef={drag(drop(noteRef))} isHidden={isDragging} />
    </>
  );
}

function mapStateToProps(state, { id, overlappedNote }) {
  return {
    isOverlapped: id === overlappedNote,
  };
}
export default connect(mapStateToProps, null)(NoteDnD);
