import './AddNote-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';

import store from '@store/store';
import { focusAddPost, blurAddPost } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

const addNoteButtons = [
  ['&#xe800;', 'Создать список'],
  ['&#xf1fc;', 'Создать заметку с рисунком'],
  ['&#xe802;', 'Создать фотозаметку'],
];

// ШАБЛОН БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
export default function setupAddNote() {
  function blurNoteHandler(e) {
    if (!e.target.closest('.container__item:first-of-type .note')) {
      dispatch(blurAddPost());
      document.removeEventListener('click', blurNoteHandler);
    }
  }
  return setupBuilder('template-add-note')({
    insert: {
      '.addNote__buttons': {
        setup: setupIconButton,
        set: addNoteButtons,
      },
    },
    eventHandlers: {
      click: () => {
        dispatch(focusAddPost());
        // во избежание перехвата во время всплытия текущего события
        setTimeout(() => {
          document.addEventListener('click', blurNoteHandler);
        }, 0);
      },
    },
  });
}
