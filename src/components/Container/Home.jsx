import React from 'react';
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
          extraProps: { isSelectionMode },
        },
        unpinned: {
          test: (noteId) => !pinnedNotes[noteId] && !removedNotes[noteId],
          name: 'Другие заметки',
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
      dndEnabled
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
