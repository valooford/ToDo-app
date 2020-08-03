import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import mainReducer from './mainReducer';
import modalReducer from './modalReducer';
import notificationReducer from './notificationReducer';

const store = createStore(
  combineReducers({
    main: mainReducer,
    modal: modalReducer,
    notification: notificationReducer,
  }),
  applyMiddleware(thunkMiddleware)
);

export default store;
