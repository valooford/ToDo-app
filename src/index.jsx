import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
/* eslint-disable import/no-unresolved */
// import initializeApp from './App';
/* eslint-enable import/no-unresolved */

ReactDOM.render(<App />, document.getElementById('todo-app'));

// const root = document.getElementById('todo-app');
// if (!root) {
//   console.error('Unable to find root element (#todo-app)');
// }
// initializeApp(root);
