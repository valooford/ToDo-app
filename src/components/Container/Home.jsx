import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';

import { clearSelectedNotes as clearSelectedNotesAC } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Home({
  pinnedNotes,
  notesOrder,
  isSelectionMode,
  clearSelectedNotes,
}) {
  return (
    <Container
      elements={notesOrder}
      groups={{
        addition: {
          test: (noteId) => noteId === notesOrder[0],
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
          extraProps: { isSelectionMode },
        },
        unpinned: {
          test: (noteId) => !pinnedNotes[noteId],
          name: 'Другие заметки',
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
      }}
      onClickOutsideOfElements={isSelectionMode ? clearSelectedNotes : null}
    />
  );
}

function mapStateToProps(state) {
  return {
    pinnedNotes: state.main.pinnedNotes,
    notesOrder: state.main.notesOrder,
    isSelectionMode: !!state.main.selectedNotes.length,
  };
}

export default connect(mapStateToProps, {
  clearSelectedNotes: clearSelectedNotesAC,
})(Home);
