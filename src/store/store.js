/* eslint-disable no-underscore-dangle */
import mainReducer from './mainReducer';

const store = {
  _state: {
    // initial state
    main: {
      notes: [
        { type: 'default', headerText: '', text: '' },
        { type: 'default', headerText: 'Мой заголовок', text: 'Привет\nПока' },
        {
          type: 'list',
          headerText: 'Список',
          items: [
            {
              text: 'first',
              sub: [],
            },
            {
              text: 'second',
              sub: [],
              isMarked: true,
            },
            {
              text: 'third',
              sub: [],
            },
            {
              text: 'fourth',
              sub: [],
              isMarked: true,
            },
          ],
        },
      ],
      removedNotes: [],
    },
  },
  getState() {
    return this._state;
  },
  // placeholder function
  _renderApp() {},
  // subscribe function
  setStateCallback(callback) {
    this._renderApp = callback;
  },
  dispatch(action) {
    this._state.main = mainReducer(this._state.main, action);
    this._renderApp(this._state);
  },
};

// save context
store.setStateCallback = store.setStateCallback.bind(store);
store.dispatch = store.dispatch.bind(store);

export default store;
export const { dispatch } = store;
