import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupAddNote from '@components/AddNote/AddNote';
import Note from '@components/Note/Note';

import store from '@store/store';
import {
  focusNote,
  blurNote,
  addNewNote,
  updateNoteHeader,
  updateNoteText,
  // updateNoteListItem,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

let focusedContainerItem;
function handleContainerFocus(e) {
  function unfocusContainerItem(ev) {
    const closestContainerItem = ev.target.closest('.container__item');
    if (!closestContainerItem) {
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

function confirmNote() {
  function blurNoteHandler(e) {
    if (!e.target.closest('.container__item:first-of-type .note')) {
      dispatch(blurNote(0)); // потом прячем addNote
      dispatch(addNewNote());

      document.removeEventListener('click', blurNoteHandler);
    }
  }
  // во избежание перехвата во время всплытия текущего события
  setTimeout(() => {
    document.addEventListener('click', blurNoteHandler);
  }, 0);
}

function handleNoteBlur(index) {
  function onNoteBlur(e) {
    const possibleContainerItem = e.target.closest(
      `.container__item:nth-of-type(${index + 1})`
    );
    if (!possibleContainerItem) {
      dispatch(blurNote(index));
      document.removeEventListener('click', onNoteBlur);
    }
  }
  return onNoteBlur;
}

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
export default function setupContainer(state) {
  const notes = state.notes
    .map((note, index) => ({
      setup: Note,
      set: [
        [
          {
            ...note,
            index,
            /* eslint-disable indent */
            onClick: note.isFocused
              ? null
              : () => {
                  const handleBlurFunc = handleNoteBlur(index);
                  dispatch(focusNote(index, handleBlurFunc));
                  setTimeout(() => {
                    document.addEventListener('click', handleBlurFunc);
                  }, 0);
                },
            /* eslint-enable indent */
            /* eslint-disable indent */
            onHeaderBlur: note.isFocused
              ? ({ target: { value: headerText } }) => {
                  dispatch(updateNoteHeader(index, headerText));
                }
              : undefined,
            /* eslint-enable indent */
            /* eslint-disable indent */
            onTextFieldBlur: note.isFocused
              ? ({ target: { value: text } }) => {
                  dispatch(updateNoteText(index, text));
                }
              : undefined,
            /* eslint-enable indent */
          },
        ],
      ],
    }))
    .slice(1);
  return setupBuilder('template-container')({
    clone: {
      '.container__item': notes.length,
    },
    insert: {
      '.container__item': [
        /* eslint-disable indent */
        state.notes[0].isFocused
          ? {
              setup: Note,
              set: [
                [
                  {
                    ...state.notes[0],
                    onConfirm: confirmNote,
                    // onTextFieldBlur:,
                    onHeaderBlur: ({ target: { value: headerText } }) => {
                      dispatch(updateNoteHeader(0, headerText));
                    },
                    onTextFieldBlur: ({ target: { value: text } }) => {
                      dispatch(updateNoteText(0, text));
                    },
                  },
                ],
              ],
            }
          : {
              setup: setupAddNote,
              set: [
                [
                  {
                    onClick() {
                      dispatch(focusNote(0));
                    },
                  },
                ],
              ],
            },
        /* eslint-enable indent */
        ...notes,
      ],
    },
    eventHandlers: {
      click: handleContainerFocus,
    },
  });
}
