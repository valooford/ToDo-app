/* eslint-disable no-underscore-dangle */
import mainReducer from './mainReducer';

const store = {
  _state: {
    // initial state
    main: {
      notes: [
        { type: 'default', headerText: '', text: '' },
        {
          type: 'default',
          headerText: 'Мой заголовок',
          text: 'Привет\nПока',
          creationDate: new Date(2020, 5, 30, 10),
          editingDate: new Date(2020, 6, 1, 1, 12),
        },
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
              sub: [
                {
                  text: 'nested',
                },
              ],
              isMarked: true,
            },
            {
              text: 'third',
              sub: [],
            },
          ],
          creationDate: new Date(2020, 5, 30, 10),
          editingDate: new Date(2020, 6, 1, 1, 12),
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
    // next statement redraw app asynchronously
    // because sync redraw breaks event listeners behaviour in IE
    // (e.g. Element.closest(..) unable to find DOM elements)
    setTimeout(() => {
      this._renderApp(this._state);
    }, 0);
  },
};

// save context
store.setStateCallback = store.setStateCallback.bind(store);
store.dispatch = store.dispatch.bind(store);

export default store;
export const { dispatch } = store;
