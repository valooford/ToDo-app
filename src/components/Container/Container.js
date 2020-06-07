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

function blurNoteHandler(e) {
  if (!e.target.closest('.container__item:first-of-type .note')) {
    dispatch(addNewNote());
    dispatch(blurNote(0)); // потом прячем addNote
    document.removeEventListener('click', blurNoteHandler);
  }
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
    .map((note, index) => {
      return Note({
        ...note,
        index,
        onClick: note.isFocused
          ? null
          : () => {
              const handleBlurFunc = handleNoteBlur(index);
              dispatch(focusNote(index, handleBlurFunc));
              setTimeout(() => {
                document.addEventListener('click', handleBlurFunc);
              }, 0);
            },
        onHeaderBlur: note.isFocused
          ? ({ target: { value: headerText } }) => {
              dispatch(updateNoteHeader(index, headerText));
            }
          : undefined,
        onTextFieldBlur:
          note.isFocused && note.type === 'default'
            ? ({ target: { value: text } }) => {
                dispatch(updateNoteText(index, text));
              }
            : undefined,
      });
    })
    .slice(1);
  return setupBuilder('template-container')({
    '.container': {
      eventHandlers: {
        click: handleContainerFocus,
      },
    },
    '.container__item': {
      clone: notes.length,
      append: [
        state.notes[0].isFocused
          ? Note({
              ...state.notes[0],
              index: 0,
              onHeaderBlur: ({ target: { value: headerText } }) => {
                dispatch(updateNoteHeader(0, headerText));
              },
              onTextFieldBlur: ({ target: { value: text } }) => {
                dispatch(updateNoteText(0, text));
              },
            })
          : setupAddNote({
              onClick() {
                dispatch(focusNote(0, blurNoteHandler));
                // во избежание перехвата во время всплытия текущего события
                setTimeout(() => {
                  document.addEventListener('click', blurNoteHandler);
                }, 0);
              },
            }),
        ...notes,
      ],
    },
  });
}
