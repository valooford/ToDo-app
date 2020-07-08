import { createStore, combineReducers } from 'redux';
import mainReducer from './mainReducer';

const store = createStore(
  combineReducers({
    main: mainReducer,
  })
);

export default store;
