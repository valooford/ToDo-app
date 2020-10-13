import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
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
  onClick,
  removeReminder,
}) {
  return reminder ? (
    <Reminder
      date={reminder.date}
      period={reminder.period}
      place={reminder.place}
      isPassed={isPassed}
      onRemove={isUnremovable ? null : removeReminder}
      onClick={onClick}
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

function mapDispatchToProps(dispatch, { reminderId }) {
  return bindActionCreators(
    {
      removeReminder: () => removeReminderAC(reminderId),
    },
    dispatch
  );
}

export default compose(
  connect(mapStateToProps),
  connect(null, mapDispatchToProps)
)(ReminderContainer);
