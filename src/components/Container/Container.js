import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupAddNote from '@components/AddNote/AddNote';
import Note from '@components/Note/Note';

import store from '@store/store';
import {
  focusAddNote,
  blurAddNote,
  focusNote,
  blurNote,
  addNewNote,
  updateNote,
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

// обработчик клика по addNote
function focusNoteHandler() {
  dispatch(focusAddNote());
}

// объекты для ссылок (refs) на элементы DOM
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

// не могут быть частью setupContainer(), так как фокусировка приведет
// к созданию новых объектов noteHeader и noteTextField, что сломает рефы
const noteHeader = {};
const noteTextField = {};

function handleNoteBlur(index, noteType) {
  function onNoteBlur(e) {
    let headerText;
    let text;
    const possibleContainerItem = e.target.closest(
      `.container__item:nth-of-type(${index + 2})`
    );
    if (!possibleContainerItem) {
      switch (noteType) {
        case 'list':
          headerText = noteHeader.ref.value;
          dispatch(blurNote(index));
          dispatch(updateNote(index, { headerText }));
          document.removeEventListener('click', onNoteBlur);
          break;
        default:
          headerText = noteHeader.ref.value;
          text = noteTextField.ref.value;
          dispatch(blurNote(index));
          dispatch(updateNote(index, { text, headerText }));
          document.removeEventListener('click', onNoteBlur);
      }
    }
  }
  return onNoteBlur;
}

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
export default function setupContainer(state) {
  const notes = state.notes.map((note, index) => {
    let noteRefs;
    if (note.type === 'list') {
      noteRefs = { header: noteHeader };
    } else {
      noteRefs = { header: noteHeader, textField: noteTextField };
    }
    return {
      setup: Note,
      set: [
        [
          {
            ...note,
            index,
            onClick:
              /* eslint-disable indent */
              note.isFocused
                ? null
                : () => {
                    const handleBlurFunc = handleNoteBlur(index, note.type);
                    dispatch(focusNote(index, handleBlurFunc));
                    setTimeout(() => {
                      document.addEventListener('click', handleBlurFunc);
                    }, 0);
                  },
            /* eslint-enable indent */
            refs: note.isFocused ? noteRefs : undefined,
          },
        ],
      ],
    };
  });
  return setupBuilder('template-container')({
    clone: {
      '.container__item': notes.length,
    },
    insert: {
      '.container__item': [
        /* eslint-disable indent */
        state.isAddPostFocused
          ? {
              setup: Note,
              set: [
                [
                  {
                    type: 'add',
                    onConfirm: confirmNote,
                    refs: { header, textField },
                  },
                ],
              ],
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
