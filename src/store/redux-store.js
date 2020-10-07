import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from './appReducer';
import notesReducer from './notesReducer';
import notificationReducer from './notificationReducer';

const store = createStore(
  combineReducers({
    app: appReducer,
    notification: notificationReducer,
    main: notesReducer,
  }),
  applyMiddleware(thunkMiddleware)
);

export default store;
