import React from 'react';
import { connect } from 'react-redux';

import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.dnd';

import { getAddingNoteId } from '@store/selectors';
import { insertNote as insertNoteAC } from '@store/notesReducer';

import Container from './Container';

function Home({
  addingNoteId,
  regularNotesOrder,
  pinnedNotes,
  removedNotes,
  isSelectionMode,
  onClickOutsideOfElements,
  insertNote,
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
      onDrop={(sourceId, targetId) => {
        if (targetId === 'end') {
          insertNote(sourceId);
        } else {
          insertNote(sourceId, targetId);
        }
      }}
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
export default connect(mapStateToProps, { insertNote: insertNoteAC })(Home);
