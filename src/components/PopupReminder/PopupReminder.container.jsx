import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside, associativeArrToArr } from '@/utils';

import PopupReminder from '@components/PopupReminder/PopupReminder';

import {
  // AC - action creator
  setDateReminder as setDateReminderAC,
  setPlaceReminder as setPlaceReminderAC,
  findPlaces,
  setFoundPlaces as setFoundPlacesAC,
} from '@store/notificationReducer';
import { getReminder, getReminderIdByNoteId } from '@store/selectors';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ POPUP-REMINDER
// *
function PopupReminderContainer({
  handleClose,
  reminder: {
    date: reminderDate,
    period: reminderPeriod,
    place: reminderPlace,
  } = {},
  foundPlaces,
  setDateReminder,
  setPlaceReminder,
  findPlacesByQuery,
  resetFoundPlaces,
}) {
  // detecting click inside popupMenu
  const setIsTouched = useEffectOnMouseDownOutside(handleClose, []);

  const keyDownHandler = (e) => {
    // Tab or Esc
    if (e.keyCode === 9 || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation(); // prevent a focused note from blurring
      handleClose();
    }
  };
  return (
    <PopupReminder
      onMouseDown={() => {
        setIsTouched();
      }}
      onClose={handleClose}
      onKeyDown={keyDownHandler}
      reminderDate={reminderDate}
      setDate={setDateReminder}
      reminderPlace={reminderPlace}
      setPlace={setPlaceReminder}
      reminderPeriod={reminderPeriod}
      findPlacesByQuery={findPlacesByQuery}
      foundPlaces={foundPlaces}
      resetFoundPlaces={resetFoundPlaces}
    />
  );
}

function mapStateToProps(state, { id }) {
  const [noteId] = associativeArrToArr(id);
  return {
    reminder: getReminder(state, getReminderIdByNoteId(state, noteId)),
    foundPlaces: state.notification.foundPlaces,
  };
}

function mapDispatchToProps(dispatch, { id }) {
  return bindActionCreators(
    {
      setDateReminder: (date, period) => setDateReminderAC(id, date, period),
      setPlaceReminder: (place) => setPlaceReminderAC(id, place),
      findPlacesByQuery: findPlaces,
      resetFoundPlaces: () => setFoundPlacesAC([]),
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupReminderContainer);
