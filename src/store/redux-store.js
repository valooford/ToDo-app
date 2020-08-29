import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import mainReducer from './mainReducer';
import notificationReducer from './notificationReducer';

const store = createStore(
  combineReducers({
    main: mainReducer,
    notification: notificationReducer,
  }),
  applyMiddleware(thunkMiddleware)
);

export default store;
