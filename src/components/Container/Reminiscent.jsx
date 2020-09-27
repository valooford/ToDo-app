import React, { useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';

import { setPage as setPageAC } from '@store/appReducer';
import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
import {
  setDateReminder,
  removeReminder as removeReminderAC,
} from '@store/notificationReducer';
import {
  getAddingNoteId,
  getReminders,
  getReminderIdByNoteId,
} from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Reminiscent({
  addingNoteId,
  // addingNoteReminderId,
  reminders,
  noteReminders,
  isSelectionMode,
  setReminder,
  setPage,
  // removeReminder,
  clearSelectedNotes,
}) {
  useEffect(() => {
    setPage();
  }, []);
  // setting reminder on addingNote
  useEffect(() => {
    setReminder();
  }, [addingNoteId]);
  // cleaning up on page switching
  // useEffect(() => {
  //   return () => {
  //     if (addingNoteReminderId) {
  //       removeReminder(addingNoteReminderId);
  //     }
  //   };
  // }, [addingNoteReminderId]);
  const noteRemindersOrder = noteReminders.order;
  return (
    <Container
      elements={[...noteRemindersOrder]} // will contain addingNoteId
      groups={{
        addition: {
          test: (noteId) => noteId === addingNoteId,
          component: AddNote,
          refPropName: 'addNoteRef',
          unique: true,
        },
        past: {
          test: (noteId) => reminders[noteReminders[noteId]].date <= Date.now(),
          name: 'Прошедшие',
          isNameRequired: true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
        coming: {
          test: (noteId) => reminders[noteReminders[noteId]].date > Date.now(),
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
  const addingNoteId = getAddingNoteId(state);
  return {
    addingNoteId,
    addingNoteReminderId: getReminderIdByNoteId(state, addingNoteId),
    reminders: getReminders(state),
    noteReminders: state.notification.noteReminders,
    isSelectionMode: !!state.main.selectedNotes.length,
  };
}
function getClosestDate() {
  const closestDate = new Date();
  const hours = closestDate.getHours();
  closestDate.setHours(0, 0, 0, 0);
  if (hours < 7) {
    closestDate.setHours(8);
  } else if (hours < 12) {
    closestDate.setHours(13);
  } else if (hours < 17) {
    closestDate.setHours(18);
  } else if (hours < 19) {
    closestDate.setHours(20);
  } else {
    closestDate.setDate(closestDate.getDate() + 1);
    closestDate.setHours(8);
  }
  return closestDate;
}
function mapDispatchToProps(dispatch, { addingNoteId, pageName }) {
  return bindActionCreators(
    {
      setReminder: () => setDateReminder(addingNoteId, getClosestDate()),
      setPage: () => setPageAC(pageName),
      removeReminder: (addingNoteReminderId) =>
        removeReminderAC(addingNoteReminderId),
    },
    dispatch
  );
}

export default compose(
  connect(mapStateToProps, {
    clearSelectedNotes: clearSelectedNotesAC,
  }),
  connect(null, mapDispatchToProps)
)(Reminiscent);
