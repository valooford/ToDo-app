import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside } from '@/utils';

import PopupReminder from '@components/PopupReminder/PopupReminder';

import {
  // AC - action creator
  setDateReminder as setDateReminderAC,
  setPlaceReminder as setPlaceReminderAC,
  findPlaces,
  setFoundPlaces as setFoundPlacesAC,
  getReminderById,
} from '@store/notificationReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ POPUP-REMINDER
// *
function PopupReminderContainer({
  index,
  callerRef,
  handleClose,
  notes,
  reminders,
  foundPlaces,
  setDateReminder,
  setPlaceReminder,
  findPlacesByQuery,
  setFoundPlaces,
}) {
  const { id: noteId } = notes[index];
  const noteReminder = getReminderById(reminders, noteId);
  const reminderDate = noteReminder && noteReminder.date;
  const reminderPeriod = noteReminder && noteReminder.period;
  const reminderPlace = noteReminder && noteReminder.place;

  // detecting click inside popupMenu
  const setIsTouched = useEffectOnMouseDownOutside(() => {
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
      onMouseDown={() => {
        setIsTouched();
      }}
      onClose={() => {
        handleClose(true);
      }}
      onKeyDown={keyDownHandler}
      reminderDate={reminderDate}
      setDate={(date, period) => {
        setDateReminder(noteId, date, period);
      }}
      reminderPlace={reminderPlace}
      setPlace={(place) => {
        setPlaceReminder(noteId, place);
      }}
      reminderPeriod={reminderPeriod}
      findPlacesByQuery={findPlacesByQuery}
      foundPlaces={foundPlaces}
      resetFoundPlaces={() => {
        setFoundPlaces([]);
      }}
    />
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
    reminders: state.notification.reminders,
    foundPlaces: state.notification.foundPlaces,
  };
}

export default connect(mapStateToProps, {
  setDateReminder: setDateReminderAC,
  setPlaceReminder: setPlaceReminderAC,
  findPlacesByQuery: findPlaces,
  setFoundPlaces: setFoundPlacesAC,
})(PopupReminderContainer);
