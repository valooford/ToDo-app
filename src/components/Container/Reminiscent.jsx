import React, { useEffect, useState } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';

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
  addingNoteReminderId,
  reminders,
  noteReminders,
  removedNotes,
  isSelectionMode,
  setReminder,
  removeReminder,
  onClickOutsideOfElements,
}) {
  // setting reminder on addingNote
  useEffect(() => {
    setReminder();
  }, [addingNoteId]);
  // cleaning up on page switching
  const [storedAddingNoteReminderId] = useState({
    id: addingNoteReminderId,
  });
  useEffect(() => {
    storedAddingNoteReminderId.id = addingNoteReminderId;
  }, [addingNoteReminderId]);
  useEffect(() => {
    return () => {
      removeReminder(storedAddingNoteReminderId.id);
    };
  }, []);

  const noteRemindersOrder = noteReminders.order;
  return (
    <Container
      elements={noteRemindersOrder} // will contain addingNoteId
      groups={{
        addition: {
          test: (noteId) => noteId === addingNoteId,
          component: AddNote,
          refPropName: 'addNoteRef',
          unique: true,
        },
        past: {
          test: (noteId) =>
            reminders[noteReminders[noteId]].date <= Date.now() &&
            !removedNotes[noteId],
          name: 'Прошедшие',
          isNameRequired: true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
        coming: {
          test: (noteId) =>
            (reminders[noteReminders[noteId]].place ||
              reminders[noteReminders[noteId]].date > Date.now()) &&
            !removedNotes[noteId],
          name: 'Предстоящие',
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
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
    removedNotes: state.main.removedNotes,
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
function mapDispatchToProps(dispatch, { addingNoteId }) {
  return bindActionCreators(
    {
      setReminder: () => setDateReminder(addingNoteId, getClosestDate()),
      removeReminder: (addingNoteReminderId) =>
        removeReminderAC(addingNoteReminderId),
    },
    dispatch
  );
}
export default compose(
  connect(mapStateToProps, null),
  connect(null, mapDispatchToProps)
)(Reminiscent);
