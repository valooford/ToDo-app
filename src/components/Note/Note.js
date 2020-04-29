import './Note-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
import setupTextarea from '@components/Textarea/Textarea';
import setupNotification from '@components/Notification/Notification';
import setupCreationTime from '@components/CreationTime/CreationTime';
import setupListItem from '@components/ListItem/ListItem';
import setupPopupMenu from '@components/PopupMenu/PopupMenu';
/* eslint-enable import/no-unresolved */

function showPopupMenu(e) {
  const button = e.currentTarget;
  let popupMenu = button.querySelector('.popup-menu');
  if (!popupMenu) {
    popupMenu = setupPopupMenu();
    button.append(popupMenu);
    button.classList.add('icon-button_no-hover');
    setTimeout(() => {
      document.addEventListener('click', blurPopupMenuHandler);
    }, 0);
  }
  function blurPopupMenuHandler(ev) {
    const popup = ev.target.closest('.popup-menu');
    if (!popup || popup !== popupMenu) {
      popupMenu.remove();
      button.classList.remove('icon-button_no-hover');
      document.removeEventListener('click', blurPopupMenuHandler);
    }
  }
  button.blur();
}

const noteButtons = [
  [
    {
      iconSymbol: '&#xf0f3;',
      titleText: 'Сохранить напоминание',
      modificator: 'icon-button_smaller',
    },
  ],
  [
    {
      iconSymbol: '&#xe803;',
      titleText: 'Соавторы',
      modificator: 'icon-button_smaller',
    },
  ],
  [
    {
      iconSymbol: '&#xe804;',
      titleText: 'Изменить цвет',
      modificator: 'icon-button_smaller',
    },
  ],
  [
    {
      iconSymbol: '&#xe802;',
      titleText: 'Добавить картинку',
      modificator: 'icon-button_smaller',
    },
  ],
  [
    {
      iconSymbol: '&#xe805;',
      titleText: 'Архивировать',
      modificator: 'icon-button_smaller',
    },
  ],
  [
    {
      iconSymbol: '&#xe81f;',
      titleText: 'Ещё',
      modificator: 'icon-button_smaller',
      onClick: showPopupMenu,
    },
  ],
  [
    {
      iconSymbol: '&#xe807;',
      titleText: 'Отменить',
      modificator: 'icon-button_smaller',
      disabled: true,
    },
  ],
  [
    {
      iconSymbol: '&#xe808;',
      titleText: 'Повторить',
      modificator: 'icon-button_smaller',
      disabled: true,
    },
  ],
];

// ШАБЛОН ЗАМЕТКИ / NOTE
// *
export default function setupNote({
  type = 'default',
  headerText = '',
  text = '',
  onConfirm,
  refs = { header: {}, textField: {} },
} = {}) {
  const { header, textField } = refs;

  const Note = setupBuilder('template-note')({
    insert: {
      '.note__check': {
        setup: setupIconButton,
        set: [
          [
            {
              iconSymbol: '&#xe80b;',
              titleText: 'Выбрать заметку',
              modificator: 'icon-button_no-padding',
            },
          ],
        ],
      },
      '.note__cornerButtons': {
        setup: setupIconButton,
        set: [
          [
            {
              iconSymbol: '&#xe812;',
              titleText: 'Закрепить заметку',
              modificator: 'icon-button_smaller',
            },
          ],
        ],
      },
      '.note__text': {
        setup: setupTextarea,
        set: [
          [
            {
              placeholder: 'Заметка...',
              value: text,
              refs: { textarea: textField },
            },
          ],
        ],
      },
      '.note__info': {
        setup: setupNotification,
      },
      '.note__creationTime': {
        setup: setupCreationTime,
        set: [['Изменено: вчера, 20:30', 'Создано 8 апр.']],
      },
      '.note__buttons': {
        setup: setupIconButton,
        set: noteButtons,
      },
    },
    modificators: [type],
    cut: {
      list: ['.note__text'],
      default: ['.note__listWrapper'],
    },
    add: {
      list: {
        '.note__list': [
          {
            setup: setupListItem,
            set: [[], [{ type: 'add' }]],
          },
          {
            setup: setupListItem,
          },
        ],
      },
    },
    elementsProps: {
      '.note__header': { value: headerText },
    },
    refs: {
      '.note__header': header,
    },
  });

  if (onConfirm) {
    onConfirm('text', header.ref.value);
  }

  return Note;
}
