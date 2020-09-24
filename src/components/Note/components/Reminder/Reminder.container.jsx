import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import { setNotePopup as setNotePopupAC } from '@store/mainReducer';
import { removeReminder as removeReminderAC } from '@store/notificationReducer';
import { getReminderById } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Reminder from './Reminder';

function ReminderContainer({ reminder, setNotePopup, removeReminder }) {
  return reminder ? (
    <Reminder
      date={reminder.date}
      period={reminder.period}
      place={reminder.place}
      onRemove={removeReminder}
      onClick={setNotePopup}
    />
  ) : null;
}

function mapStateToProps(state, { id }) {
  return {
    reminder: getReminderById(state, id),
  };
}

function mapDispatchToProps(dispatch, { id }) {
  return bindActionCreators(
    {
      setNotePopup: () => setNotePopupAC(id, 'reminder'),
      removeReminder: () => removeReminderAC(id),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReminderContainer);
