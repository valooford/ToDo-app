import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
// import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';

import { setPage } from '@store/appReducer';
import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
// import { getReminders } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Reminders({
  noteReminders,
  isSelectionMode,
  onMount,
  clearSelectedNotes,
}) {
  useEffect(() => {
    onMount();
  }, []);
  const noteRemindersOrder = noteReminders.order.map(
    (reminderId) => noteReminders[reminderId]
  );
  return (
    <Container
      elements={noteRemindersOrder}
      groups={{
        // addition: {
        //   test: (noteId) => noteId === notesOrder[0],
        //   component: AddNote,
        //   refPropName: 'addNoteRef',
        //   unique: true,
        // },
        // past: {
        //   test: (noteId) => true,
        //   name: 'Прошедшие',
        //   isNameRequired: true,
        //   component: Note,
        //   refPropName: 'noteRef',
        //   extraProps: { isSelectionMode },
        // },
        coming: {
          test: (/* noteId */) => true,
          name: 'Предстоящие',
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
    noteReminders: state.notification.noteReminders,
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

export default connect(mapStateToProps, mapDispatchToProps)(Reminders);
