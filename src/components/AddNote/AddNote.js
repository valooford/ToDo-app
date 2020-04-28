import './AddNote-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

const addNoteButtons = [
  ['&#xe800;', 'Создать список'],
  ['&#xf1fc;', 'Создать заметку с рисунком'],
  ['&#xe802;', 'Создать фотозаметку'],
];

// ШАБЛОН БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
export default function setupAddNote({ onClick } = {}) {
  return setupBuilder('template-add-note')({
    insert: {
      '.addNote__buttons': {
        setup: setupIconButton,
        set: addNoteButtons,
      },
    },
    eventHandlers: {
      click: onClick,
    },
  });
}
