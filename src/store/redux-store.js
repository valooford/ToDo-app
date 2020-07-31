import { createStore, combineReducers } from 'redux';
import mainReducer from './mainReducer';
import modalReducer from './modalReducer';
import notificationReducer from './notificationReducer';

const store = createStore(
  combineReducers({
    main: mainReducer,
    modal: modalReducer,
    notification: notificationReducer,
  })
);

export default store;
