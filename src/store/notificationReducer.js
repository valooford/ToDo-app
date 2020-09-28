/* eslint-disable import/no-unresolved */
import { getPlaces } from '@api/places';
import { associativeArrToArr } from '@/utils';
/* eslint-enable import/no-unresolved */

import {
  SET_NOTE_REMINDER,
  REMOVE_REMINDER,
  SET_FOUND_PLACES,
} from './actionsTypes';

const handlers = {
  [SET_NOTE_REMINDER]: (state, { noteIds, place, date, period }) => {
    const noteRemindersData = noteIds.reduce(
      (data, noteId) => {
        /* eslint-disable no-param-reassign */
        const reminderId = `note-${noteId}`;
        data.reminders[reminderId] = {
          id: reminderId,
          noteId,
          place,
          date,
          period,
        };
        if (!data.noteReminders[noteId]) {
          data.noteReminders.order.push(noteId);
        }
        data.noteReminders[noteId] = reminderId;
        return data;
        /* eslint-enable no-param-reassign */
      },
      {
        reminders: { ...state.reminders },
        noteReminders: {
          ...state.noteReminders,
          order: [...state.noteReminders.order],
        },
      }
    );
    // sorting note reminders
    const { reminders } = noteRemindersData;
    noteRemindersData.noteReminders.order.sort((noteId1, noteId2) => {
      const {
        [noteId1]: reminderId1,
        [noteId2]: reminderId2,
      } = noteRemindersData.noteReminders;
      if (reminders[reminderId1].date) {
        if (reminders[reminderId2].date)
          return reminders[reminderId1].date - reminders[reminderId2].date;
        return -1;
      }
      if (reminders[reminderId2].date) return -1;
      return reminders[reminderId2].place - reminders[reminderId1].place;
    });
    return {
      ...state,
      reminders,
      noteReminders: noteRemindersData.noteReminders,
    };
  },
  [REMOVE_REMINDER]: (state, { reminderId }) => {
    const { [reminderId]: removingReminder, ...reminders } = state.reminders;
    const noteReminders = { ...state.noteReminders };
    delete noteReminders[removingReminder.noteId];
    noteReminders.order = noteReminders.order.filter(
      (noteId) => noteReminders[noteId]
    );
    return { ...state, reminders, noteReminders };
  },
  [SET_FOUND_PLACES]: (state, { foundPlaces }) => {
    return { ...state, foundPlaces };
  },
};

const initialState = {
  reminders: {
    'note-111': {
      id: 'note-111',
      noteId: 111,
      // place: 'shopping mall',
      // or
      date: new Date(2020, 7, 1, 1),
      // period: {
      //   every: 365,
      //   end: {
      //     count: 2,
      //     // or
      //     date: new Date(2022, 7, 1),
      //   },
      // },
    },
  },
  noteReminders: {
    111: 'note-111',
    order: [111],
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
  if (handlers[action.type]) return handlers[action.type](state, action);
  return state;
}

/* SET_NOTE_REMINDER
 * noteId: actual id / array of ids
 */
export function setDateReminder(noteId, date, period) {
  const noteIds = associativeArrToArr(noteId);
  return { type: SET_NOTE_REMINDER, noteIds, date, period };
}
export function setPlaceReminder(noteId, place) {
  const noteIds = associativeArrToArr(noteId);
  return { type: SET_NOTE_REMINDER, noteIds, place };
}

// REMOVE_REMINDER
export function removeReminder(reminderId) {
  return { type: REMOVE_REMINDER, reminderId };
}

// SET_FOUND_PLACES
export function setFoundPlaces(foundPlaces) {
  return { type: SET_FOUND_PLACES, foundPlaces };
}

// promise for calling setFoundPlaces in order
let setFoundPlacesPromise = Promise.resolve(1);

export function findPlaces(query) {
  return async (dispatch) => {
    setFoundPlacesPromise = setFoundPlacesPromise.then(async () => {
      if (query == null || query === '') {
        dispatch(setFoundPlaces([]));
        return;
      }
      const places = (await getPlaces(query)) || [];
      dispatch(
        setFoundPlaces(
          places.map((place) => {
            const {
              id,
              name,
              location: { address, city, state, country },
            } = place;
            const location = [city, state, country].filter((v) => v).join(', ');
            return {
              name,
              address,
              location,
              key: id,
            };
          })
        )
      );
    });
  };
}
