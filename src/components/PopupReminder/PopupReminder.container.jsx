import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { handleClickOutside } from '@/utils';

import PopupReminder from '@components/PopupReminder/PopupReminder';
// import {} from '@store/mainReducer';
import {
  // AC - action creator
  setDateReminder as setDateReminderAC,
  setPlaceReminder as setPlaceReminderAC,

  // getReminderById,
} from '@store/notificationReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ POPUP-REMINDER
// *
function PopupReminderContainer({
  index,
  callerRef,
  handleClose,
  notes,
  // reminders,
  setDateReminder,
  setPlaceReminder,
}) {
  const { creationDate } = notes[index];
  const noteId = creationDate.getTime();
  // const noteReminder = getReminderById(reminders, noteId);
  // detecting click inside popupMenu
  const setIsTouched = handleClickOutside(() => {
    handleClose();
  }, []);

  const keyDownHandler = (e) => {
    // Tab or Esc
    if (e.keyCode === 9 || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation(); // prevent a focused note from blurring
      callerRef.current.focus();
      handleClose(true);
    }
  };
  return (
    <PopupReminder
      onClick={() => {
        setIsTouched();
      }}
      onClose={() => {
        handleClose(true);
      }}
      onKeyDown={keyDownHandler}
      setDate={(date, period) => {
        setDateReminder(noteId, date, period);
      }}
      setPlace={(place) => {
        setPlaceReminder(noteId, place);
      }}
    />
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
    reminders: state.notification.reminders,
  };
}

export default connect(mapStateToProps, {
  setDateReminder: setDateReminderAC,
  setPlaceReminder: setPlaceReminderAC,
})(PopupReminderContainer);
