import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupAddNote from '@components/AddNote/AddNote';
import setupNote from '@components/Note/Note';

import store from '@store/store';
import { focusAddPost, blurAddPost, addNewNote } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

function focusNoteHandler() {
  dispatch(focusAddPost());
}

const header = {};
const textField = {};

function confirmNote() {
  function blurNoteHandler(e) {
    if (!e.target.closest('.container__item:first-of-type .note')) {
      dispatch(blurAddPost());
      /* eslint-disable operator-linebreak */
      const noteText = textField.ref.value;
      /* eslint-enable operator-linebreak */
      const headerText = header.ref.value;
      if (noteText) {
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
  });
}
