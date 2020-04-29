import './styles/index.scss';
/* eslint-disable import/no-unresolved */
import initializeApp from './App';
/* eslint-enable import/no-unresolved */

const root = document.getElementById('todo-app');
if (!root) {
  console.error('Unable to find root element (#todo-app)');
}
initializeApp(root);

const containerElement = document.getElementById('container');

function handleNoteFieldInput(e) {
  if (!e.target.classList.contains('textarea')) {
    return;
  }
  if (e.target.value === '') {
    e.target.style.fontWeight = 'bold';
  } else {
    e.target.style.fontWeight = 'normal';
  }
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight}px`;
  const computedStyle = getComputedStyle(e.target);
  if (e.target.scrollHeight >= parseInt(computedStyle.maxHeight, 10)) {
    e.target.style.overflowY = 'scroll';
  } else {
    e.target.style.overflowY = 'hidden';
  }
}

containerElement.addEventListener('input', handleNoteFieldInput, false);
