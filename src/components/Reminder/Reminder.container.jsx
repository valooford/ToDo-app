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

function ReminderContainer({ id, reminder, setNotePopup, removeReminder }) {
  return reminder ? (
    <Reminder
      date={reminder.date}
      period={reminder.period}
      place={reminder.place}
      onRemove={() => {
        removeReminder(id);
      }}
      onClick={() => {
        setNotePopup(id, 'reminder');
      }}
    />
  ) : null;
}

function mapStateToProps(state, { id }) {
  return {
    reminder: getReminderById(state.notification.reminders, id),
  };
}

export default connect(mapStateToProps, {
  setNotePopup: setNotePopupAC,
  removeReminder: removeReminderAC,
})(ReminderContainer);
