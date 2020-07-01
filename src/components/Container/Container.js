import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import AddNote from '@components/AddNote/AddNote';
import Note from '@components/Note/Note';

import { dispatch } from '@store/store';
import {
  focusNote,
  blurNote,
  addNewNote,
  updateNoteHeader,
  updateNoteText,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
function Container({ children = [], focusedNoteIndex } = {}) {
  return setupBuilder('template-container')({
    '.container__item': {
      clone: children.length - 1,
      append: children,
      modificators: focusedNoteIndex && {
        [focusedNoteIndex]: ['container__item_focused'],
      },
    },
  });
}

// функция для создания обработчиков расфокусировки заметок
function handleNoteBlur(index, extraAction) {
  function onNoteBlur(e) {
    const possibleContainerItem = e.target.closest(
      `.container__item:nth-of-type(${index + 1})`
    );
    if (!possibleContainerItem) {
      if (extraAction) dispatch(extraAction());
      dispatch(blurNote(index));
      document.removeEventListener('click', onNoteBlur);
    }
  }
  return onNoteBlur;
}

export default function ContainerContainer(state) {
  const add = state.notes[0].isFocused
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
    : AddNote({
        onClick() {
          const handleBlurFunc = handleNoteBlur(0, addNewNote);
          dispatch(focusNote(0, handleBlurFunc));
          // во избежание перехвата во время всплытия текущего события
          setTimeout(() => {
            document.addEventListener('click', handleBlurFunc);
          }, 0);
        },
      });
  let focusedNoteIndex;
  const notes = state.notes
    .map((note, index) => {
      if (note.isFocused) {
        focusedNoteIndex = index;
      }
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
          note.type === 'default'
            ? ({ target: { value: text } }) => {
                dispatch(updateNoteText(index, text));
              }
            : undefined,
      });
    })
    .slice(1);

  return Container({ children: [add, ...notes], focusedNoteIndex });
}
