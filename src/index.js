import './styles/index.scss';
/* eslint-disable import/no-unresolved */
import initializeApp from './App';
/* eslint-enable import/no-unresolved */

const root = document.getElementById('todo-app');
if (!root) {
  console.error('Unable to find root element (#todo-app)');
}
initializeApp(root);
