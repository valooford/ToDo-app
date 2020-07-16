import './styles/index.module.scss';
import React from 'react';
import { Provider } from 'react-redux';
/* eslint-disable import/no-unresolved */
import ReactDOM from 'react-dom';

import App from '@components/App/App.container';
/* eslint-enable import/no-unresolved */
import store from './store/redux-store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('todo-app')
);
