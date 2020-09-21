/* eslint-disable import/no-unresolved */
import { getPlaces } from '@api/places';
import { associativeArrToArr } from '@/utils';
/* eslint-enable import/no-unresolved */

import {
  SET_REMINDER,
  REMOVE_REMINDER,
  SET_FOUND_PLACES,
} from './actionsTypes';

const handlers = {
  [SET_REMINDER]: (state, { ids, place, date, period }) => {
    return {
      ...state,
      reminders: {
        ...state.reminders,
        ...ids.reduce((reminders, id) => {
          // eslint-disable-next-line no-param-reassign
          reminders[`note-${id}`] = {
            place,
            date,
            period,
          };
          return reminders;
        }, {}),
      },
    };
  },
  [REMOVE_REMINDER]: (state, { id }) => {
    const { [`note-${id}`]: removingReminder, ...reminders } = state.reminders;
    return { ...state, reminders };
  },
  [SET_FOUND_PLACES]: (state, { foundPlaces }) => {
    return { ...state, foundPlaces };
  },
};

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
  if (handlers[action.type]) return handlers[action.type](state, action);
  return state;
}

/* ADD_NEW_REMINDER
 * id: actual id / array of ids
 */
export function setDateReminder(id, date, period) {
  const ids = associativeArrToArr(id);
  return { type: SET_REMINDER, ids, date, period };
}
export function setPlaceReminder(id, place) {
  const ids = associativeArrToArr(id);
  return { type: SET_REMINDER, ids, place };
}

// REMOVE_REMINDER
export function removeReminder(id) {
  return { type: REMOVE_REMINDER, id };
}

// REMINDER SELECTOR
export function getReminderById(reminders, id) {
  return reminders[`note-${id}`];
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
