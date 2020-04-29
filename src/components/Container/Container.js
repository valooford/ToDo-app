import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupAddNote from '@components/AddNote/AddNote';
import setupNote from '@components/Note/Note';

import store from '@store/store';
import { focusAddNote, blurAddNote, addNewNote } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

let focusedContainerItem;
function handleContainerFocus(e) {
  function unfocusContainerItem() {
    if (focusedContainerItem) {
      focusedContainerItem.classList.remove('container__item_focused');
      focusedContainerItem = null;
    }
    document.removeEventListener('click', unfocusContainerItem);
  }
  const newFocusedContainerItem = e.target.closest('.container__item');
  if (newFocusedContainerItem) {
    if (newFocusedContainerItem === focusedContainerItem) return;
    if (focusedContainerItem) {
      focusedContainerItem.classList.remove('container__item_focused');
    }
    newFocusedContainerItem.classList.add('container__item_focused');
    focusedContainerItem = newFocusedContainerItem;
    setTimeout(() => {
      document.addEventListener('click', unfocusContainerItem);
    }, 0);
  }
}

function focusNoteHandler() {
  dispatch(focusAddNote());
}

const header = {};
const textField = {};

function confirmNote() {
  function blurNoteHandler(e) {
    if (!e.target.closest('.container__item:first-of-type .note')) {
      const noteText = textField.ref.value; // сначала получаем value
      const headerText = header.ref.value;
      dispatch(blurAddNote()); // потом прячем addNote
      if (noteText || headerText) {
        dispatch(addNewNote(noteText, headerText));
      }

      document.removeEventListener('click', blurNoteHandler);
    }
  }
  // во избежание перехвата во время всплытия текущего события
  setTimeout(() => {
    document.addEventListener('click', blurNoteHandler);
  }, 0);
}

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
export default function setupContainer(state) {
  const notes = state.notes.map((note) => ({
    setup: setupNote,
    set: [[note]],
  }));
  return setupBuilder('template-container')({
    clone: {
      '.container__item': notes.length,
    },
    insert: {
      '.container__item': [
        /* eslint-disable indent */
        state.isAddPostFocused
          ? {
              setup: setupNote,
              set: [[{ onConfirm: confirmNote, refs: { header, textField } }]],
            }
          : { setup: setupAddNote, set: [[{ onClick: focusNoteHandler }]] },
        /* eslint-enable indent */
        ...notes,
      ],
    },
    eventHandlers: {
      click: handleContainerFocus,
    },
  });
}
