/* eslint-disable no-underscore-dangle */
import mainReducer from './mainReducer';

const store = {
  _state: {
    // initial state
    main: {
      addPost: {},
      isAddPostFocused: false,
      notes: [{ type: 'default', header: 'Мой заголовок' }, { type: 'list' }],
      // notes: [],
    },
  },
  getState() {
    return this._state;
  },
  _renderApp() {
    // placeholder function
    console.log("renderApp(..) function hasn't been set");
  },
  setStateCallback(callback) {
    // subscribe function
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
