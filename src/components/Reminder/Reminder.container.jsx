import React from 'react';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import Reminder from '@components/Reminder/Reminder';

import { setNotePopup as setNotePopupAC } from '@store/mainReducer';
import {
  removeReminder as removeReminderAC,
  getReminderById,
} from '@store/notificationReducer';
/* eslint-enable import/no-unresolved */

function ReminderContainer({
  index,
  notes,
  reminders,
  setNotePopup,
  removeReminder,
}) {
  const { creationDate } = notes[index];
  const noteId = creationDate.getTime();
  const noteReminder = getReminderById(reminders, noteId);
  return noteReminder ? (
    <Reminder
      date={noteReminder.date}
      period={noteReminder.period}
      place={noteReminder.place}
      onRemove={() => {
        removeReminder(noteId);
      }}
      onClick={() => {
        setNotePopup(index, 'reminder');
      }}
    />
  ) : null;
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
    reminders: state.notification.reminders,
  };
}

export default connect(mapStateToProps, {
  setNotePopup: setNotePopupAC,
  removeReminder: removeReminderAC,
})(ReminderContainer);
