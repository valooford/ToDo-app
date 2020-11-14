import React, { useState } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.dnd';

import { getAddingNoteId } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Home({
  addingNoteId,
  regularNotesOrder,
  pinnedNotes,
  removedNotes,
  isSelectionMode,
  onClickOutsideOfElements,
}) {
  const [overlappedNote, setOverlappedNote] = useState(null);
  const onOverlap = (id) => {
    setOverlappedNote(id);
  };
  const onDragEnd = (/* id */) => {
    if (overlappedNote) {
      // console.log(`note ${id} was dropped on note ${overlappedNote}`);
      setOverlappedNote(null);
    }
  };

  return (
    <Container
      elements={[addingNoteId, ...regularNotesOrder]}
      groups={{
        addition: {
          test: (noteId) => noteId === addingNoteId,
          component: AddNote,
          refPropName: 'addNoteRef',
          unique: true,
        },
        pinned: {
          test: (noteId) => pinnedNotes[noteId],
          name: 'Закрепленные',
          isNameRequired: true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode, overlappedNote, onOverlap, onDragEnd },
        },
        unpinned: {
          test: (noteId) => !pinnedNotes[noteId] && !removedNotes[noteId],
          name: 'Другие заметки',
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode, overlappedNote, onOverlap, onDragEnd },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
    />
  );
}

function mapStateToProps(state) {
  return {
    addingNoteId: getAddingNoteId(state),
    regularNotesOrder: state.main.regularNotes.order,
    pinnedNotes: state.main.pinnedNotes,
    removedNotes: state.main.removedNotes,
  };
}
export default connect(mapStateToProps)(Home);
