import { createStore, combineReducers } from 'redux';
import mainReducer from './mainReducer';
import modalReducer from './modalReducer';

const store = createStore(
  combineReducers({
    main: mainReducer,
    modal: modalReducer,
  })
);

export default store;
