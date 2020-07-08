import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/redux-store';

import App from './App';
/* eslint-disable import/no-unresolved */
// import initializeApp from './App';
/* eslint-enable import/no-unresolved */

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('todo-app')
);

// const root = document.getElementById('todo-app');
// if (!root) {
//   console.error('Unable to find root element (#todo-app)');
// }
// initializeApp(root);
