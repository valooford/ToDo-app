import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import { removeReminder as removeReminderAC } from '@store/notificationReducer';
import {
  getReminder,
  getReminderIdByNoteId,
  getAddingNoteId,
} from '@store/selectors';
import { getFormattedDate } from '@common/utils';

import IconButtonTitled from '@components/IconButton/IconButton.titled';
import { withTitle } from '@components/Title/Title';

import Label from './Label';

const LabelTitled = withTitle(Label);

function Reminder({
  reminder,
  isPassed,
  isUnremovable,
  onClick,
  removeReminder,
}) {
  if (!reminder) return null;
  const { date, period, place } = reminder;
  const fullText = (date && getFormattedDate(date)) || place;
  let text = fullText;
  const commaIndex = text.indexOf(',');
  if (!date && commaIndex !== -1) {
    text = text.slice(0, commaIndex);
  }
  let iconSymbol;
  if (date) {
    iconSymbol = period ? '\ue820' : '\ue809';
  } else {
    iconSymbol = '\ue80a';
  }

  return (
    <LabelTitled
      text={text}
      titleText={fullText}
      iconSymbol={iconSymbol}
      isSecondary={isPassed}
      onRemove={isUnremovable ? null : removeReminder}
      onClick={onClick}
      IconButton={IconButtonTitled}
    />
  );
}

function mapStateToProps(state, { id }) {
  const reminderId = getReminderIdByNoteId(state, id);
  return {
    reminder: getReminder(state, reminderId),
    reminderId,
    isUnremovable: id === getAddingNoteId(state),
  };
}
function mapDispatchToProps(dispatch, { reminderId, id }) {
  return bindActionCreators(
    {
      removeReminder: () => removeReminderAC(reminderId, id),
    },
    dispatch
  );
}

export default compose(
  connect(mapStateToProps),
  connect(null, mapDispatchToProps)
)(Reminder);

export function Tag() {}
