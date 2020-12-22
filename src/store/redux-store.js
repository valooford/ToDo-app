import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from './appReducer';
import historyEnhancer from './historyEnhancer';
import notesReducer from './notesReducer';
import notificationReducer from './notificationReducer';

const store = createStore(
  historyEnhancer({
    app: appReducer,
    notification: notificationReducer,
    main: notesReducer,
  }),
  applyMiddleware(thunkMiddleware)
);

export default store;
