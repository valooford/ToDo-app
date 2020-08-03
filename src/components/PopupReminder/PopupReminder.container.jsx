import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnClickOutside } from '@/utils';

import PopupReminder from '@components/PopupReminder/PopupReminder';
// import {} from '@store/mainReducer';
import {
  // AC - action creator
  setDateReminder as setDateReminderAC,
  setPlaceReminder as setPlaceReminderAC,
  getPlaces,
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
  getPlacesByQuery,
  setFoundPlaces,
}) {
  const { creationDate } = notes[index];
  const noteId = creationDate.getTime();
  const noteReminder = getReminderById(reminders, noteId);
  const reminderDate = noteReminder && noteReminder.date;
  const reminderPlace = noteReminder && noteReminder.place;

  // detecting click inside popupMenu
  const setIsTouched = useEffectOnClickOutside(() => {
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
      reminderDate={reminderDate}
      setDate={(date, period) => {
        setDateReminder(noteId, date, period);
      }}
      reminderPlace={reminderPlace}
      setPlace={(place) => {
        setPlaceReminder(noteId, place);
      }}
      getPlacesByQuery={getPlacesByQuery}
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
  getPlacesByQuery: getPlaces,
  setFoundPlaces: setFoundPlacesAC,
})(PopupReminderContainer);
