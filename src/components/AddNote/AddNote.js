import './AddNote-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

const addNoteButtons = [
  [{ iconSymbol: '&#xe800;', titleText: 'Создать список' }],
  [{ iconSymbol: '&#xf1fc;', titleText: 'Создать заметку с рисунком' }],
  [{ iconSymbol: '&#xe802;', titleText: 'Создать фотозаметку' }],
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