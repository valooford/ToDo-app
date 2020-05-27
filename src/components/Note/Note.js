import './Note-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
import setupTextarea from '@components/Textarea/Textarea';
import setupNotification from '@components/Notification/Notification';
import setupCreationTime from '@components/CreationTime/CreationTime';
import setupListItem from '@components/ListItem/ListItem';
import setupPopupMenu from '@components/PopupMenu/PopupMenu';

import store from '@store/store';
import {
  addNoteListItem,
  removeNoteListItem,
  markNoteListItem,
  unmarkNoteListItem,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

function showPopupMenu({
  type = 'expanded',
  index,
  isList = false,
  hasMarkedItems = false,
}) {
  return (e) => {
    const button = e.currentTarget;
    let popupMenu = button.querySelector('.popup-menu');
    function blurPopupMenuHandler(ev) {
      const popup = ev.target.closest('.popup-menu');
      if (!popup || popup !== popupMenu) {
        popupMenu.remove();
        button.classList.remove('icon-button_no-hover');
        document.removeEventListener('click', blurPopupMenuHandler);
      }
    }
    if (!popupMenu) {
      popupMenu = setupPopupMenu({
        index,
        isExpanded: type === 'expanded',
        isList,
        hasMarkedItems,
      });
      button.append(popupMenu);
      button.classList.add('icon-button_no-hover');
      setTimeout(() => {
        document.addEventListener('click', blurPopupMenuHandler);
      }, 0);
    }
    button.blur();
  };
}

function getNoteButtons({ index, type = 'default', hasMarkedItems = false }) {
  return [
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
        onClick: showPopupMenu({
          type: type === 'add' ? 'tight' : 'expanded',
          index,
          isList: type === 'list',
          hasMarkedItems,
        }),
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
}

// ШАБЛОН ЗАМЕТКИ / NOTE
// *
export function setupNote({
  type = 'default',
  headerText = '',
  text = '',
  items = [],
  markedItems = [],
  onClick = null,
  onConfirm,
  onListItemAdd,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  refs = { header: {}, textField: {} },
  index,
} = {}) {
  const { header = {}, textField = {} } = refs;

  const NoteElement = setupBuilder('template-note')({
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
        set: getNoteButtons({
          type,
          index,
          hasMarkedItems: !!markedItems.length,
        }),
      },
    },
    modificators: type === 'default' ? ['default'] : [`note_${type}`],
    cut: {
      default: ['.note__listWrapper', '.note__button'],
      note_list: ['.note__text', '.note__button'],
      note_add: ['.note__listWrapper'],
    },
    add: {
      default: {},
      note_list: {
        '.note__list': [
          // not marked
          {
            setup: setupListItem,
            set: [
              ...items.map((item) => [
                {
                  text: item.text,
                  onRemove: onListItemRemove(index, item.index),
                  onCheck: onListItemCheck(index, item.index),
                },
              ]),
              [{ type: 'add', onInput: onListItemAdd(index) }],
            ],
          },
          // inside markedList
          {
            setup: setupListItem,
            set: [
              ...markedItems.map((item) => [
                {
                  isChecked: true,
                  text: item.text,
                  onRemove: onListItemRemove(index, item.index),
                  onCheck: onListItemUncheck(index, item.index),
                },
              ]),
            ],
          },
        ],
      },
    },
    elementsProps: {
      '.note__header': { value: headerText },
    },
    eventHandlers: {
      click: onClick,
    },
    refs: {
      '.note__header': header,
    },
  });

  if (onConfirm) {
    onConfirm();
  }

  return NoteElement;
}

const { dispatch } = store;

export default function Note(params) {
  const { items, ...newParams } = params;
  let itemsCopy;
  let unmarkedItems;
  let markedItems;
  if (items) {
    // adding indexes to items and sub items
    itemsCopy = items.map((item, index) => ({ ...item, index }));
    itemsCopy.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.map((subItem, index) => ({ ...subItem, index }));
    });
    unmarkedItems = itemsCopy.filter((item) => !item.isMarked);
    unmarkedItems.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.filter((subItem) => !subItem.isMarked);
    });
    markedItems = itemsCopy.filter((item) => item.isMarked);
    markedItems.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.filter((subItem) => subItem.isMarked);
    });
  }
  return setupNote({
    ...newParams,
    items: unmarkedItems,
    markedItems,
    onListItemAdd: (index) => (text) => {
      dispatch(addNoteListItem(index, text));
    },
    onListItemRemove: (index, itemNum) => () => {
      dispatch(removeNoteListItem(index, itemNum));
    },
    onListItemCheck: (index, itemNum) => () => {
      dispatch(markNoteListItem(index, itemNum));
    },
    onListItemUncheck: (index, itemNum) => () => {
      dispatch(unmarkNoteListItem(index, itemNum));
    },
  });
}
