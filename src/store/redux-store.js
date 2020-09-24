import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from './appReducer';
import mainReducer from './mainReducer';
import notificationReducer from './notificationReducer';

const store = createStore(
  combineReducers({
    app: appReducer,
    main: mainReducer,
    notification: notificationReducer,
  }),
  applyMiddleware(thunkMiddleware)
);

export default store;
