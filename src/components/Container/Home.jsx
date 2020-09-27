import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';

import { setPage } from '@store/appReducer';
import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
import { getAddingNoteId } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Home({
  addingNoteId,
  regularNotesOrder,
  pinnedNotes,
  isSelectionMode,
  onMount,
  clearSelectedNotes,
}) {
  useEffect(() => {
    onMount();
  }, []);
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
    addingNoteId: getAddingNoteId(state),
    regularNotesOrder: state.main.regularNotes.order,
    pinnedNotes: state.main.pinnedNotes,
    isSelectionMode: !!state.main.selectedNotes.length,
  };
}
function mapDispatchToProps(dispatch, { pageName }) {
  return bindActionCreators(
    {
      onMount: () => setPage(pageName),
      clearSelectedNotes: clearSelectedNotesAC,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
