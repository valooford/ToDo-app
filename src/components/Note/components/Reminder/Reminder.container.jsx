import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import { setNotePopup as setNotePopupAC } from '@store/notesReducer';
import { removeReminder as removeReminderAC } from '@store/notificationReducer';
import {
  getReminder,
  getReminderIdByNoteId,
  getAddingNoteId,
} from '@store/selectors';

import IconButtonTitled from '@components/IconButton/IconButton.titled';
/* eslint-enable import/no-unresolved */
import Reminder from './Reminder';

function ReminderContainer({
  reminder,
  isPassed,
  isUnremovable,
  setNotePopup,
  removeReminder,
}) {
  return reminder ? (
    <Reminder
      date={reminder.date}
      period={reminder.period}
      place={reminder.place}
      isPassed={isPassed}
      onRemove={isUnremovable ? null : removeReminder}
      onClick={setNotePopup}
      IconButton={IconButtonTitled}
    />
  ) : null;
}

function mapStateToProps(state, { id }) {
  const reminderId = getReminderIdByNoteId(state, id);
  return {
    reminder: getReminder(state, reminderId),
    reminderId,
    isUnremovable: id === getAddingNoteId(state),
  };
}

function mapDispatchToProps(dispatch, { id, reminderId }) {
  return bindActionCreators(
    {
      setNotePopup: () => setNotePopupAC(id, 'reminder'),
      removeReminder: () => removeReminderAC(reminderId),
    },
    dispatch
  );
}

export default compose(
  connect(mapStateToProps),
  connect(null, mapDispatchToProps)
)(ReminderContainer);
