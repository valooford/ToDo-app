/* eslint-disable import/no-unresolved */
import { getPlaces } from '@api/places';
/* eslint-enable import/no-unresolved */

const SET_REMINDER = 'notification/set-reminder';
const REMOVE_REMINDER = 'notification/remove-reminder';
const SET_FOUND_PLACES = 'notification/set-found-places';

const initialState = {
  reminders: {
    'note-123456': {
      place: 'shopping mall',
      // or
      date: new Date(2020, 7, 1, 1),
      period: {
        every: 365,
        end: {
          count: 2,
          // or
          date: new Date(2022, 7, 1),
        },
      },
    },
  },
  foundPlaces: [
    // {
    //   name: 1,
    //   address: 'Апл-Парк-уэй',
    //   location: 'Купертино, Калифорния, США',
    //   key: 123456,
    // },
  ],
};

export default function notificationReducer(state = initialState, action) {
  let reminders;
  switch (action.type) {
    case SET_REMINDER:
      reminders = { ...state.reminders };
      reminders[`note-${action.noteId}`] = {
        place: action.place,
        date: action.date,
        period: action.period,
      };
      return { ...state, reminders };
    case REMOVE_REMINDER:
      reminders = { ...state.reminders };
      delete reminders[`note-${action.noteId}`];
      return { ...state, reminders };
    case SET_FOUND_PLACES:
      return { ...state, foundPlaces: action.foundPlaces };
    default:
      return state;
  }
}

// ADD_NEW_REMINDER
export function setDateReminder(noteId, date, period) {
  return { type: SET_REMINDER, noteId, date, period };
}
export function setPlaceReminder(noteId, place) {
  return { type: SET_REMINDER, noteId, place };
}

// REMOVE_REMINDER
export function removeReminder(noteId) {
  return { type: REMOVE_REMINDER, noteId };
}

// REMINDER SELECTOR
export function getReminderById(reminders, noteId) {
  return reminders[`note-${noteId}`];
}

// SET_FOUND_PLACES
export function setFoundPlaces(foundPlaces) {
  return { type: SET_FOUND_PLACES, foundPlaces };
}

export function findPlaces(query) {
  if (query == null || query === '') {
    return setFoundPlaces([]);
  }
  return async (dispatch) => {
    const places = (await getPlaces(query)) || [];
    dispatch(
      setFoundPlaces(
        places.map((place) => {
          const { id, name, location } = place;
          const { address, city, state, country } = location;
          return {
            name,
            address,
            location: `${city}, ${state}, ${country}`,
            key: id,
          };
        })
      )
    );
  };
}
