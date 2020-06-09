import './AddNote-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
function AddNote({ onClick, buttonsParams = [] } = {}) {
  const addNoteButtons = buttonsParams.map((params) => IconButton(params));
  return setupBuilder('template-add-note')({
    '.addNote': {
      eventHandlers: {
        click: onClick,
      },
    },
    '.addNote__buttons': {
      append: addNoteButtons,
    },
  });
}

export default function AddNoteContainer(props) {
  const buttonsParams = [
    { iconSymbol: '&#xe800;', titleText: 'Создать список' },
    { iconSymbol: '&#xf1fc;', titleText: 'Создать заметку с рисунком' },
    { iconSymbol: '&#xe802;', titleText: 'Создать фотозаметку' },
  ];

  return AddNote({ ...props, buttonsParams });
}
