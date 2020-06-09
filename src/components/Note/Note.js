import './Note-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
import Notification from '@components/Notification/Notification';
import CreationTime from '@components/CreationTime/CreationTime';
import ListItem from '@components/ListItem/ListItem';
import PopupMenu from '@components/PopupMenu/PopupMenu';

import { dispatch } from '@store/store';
import {
  addNoteListItem,
  updateNoteListItem,
  removeNoteListItem,
  checkNoteListItem,
  uncheckNoteListItem,
  setNotePopup,
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
      popupMenu = PopupMenu({
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

    button.blur(); // ???
  };
}

function getNoteButtons({ index, popup, hasMarkedItems = false }) {
  return [
    {
      iconSymbol: '&#xf0f3;',
      titleText: 'Сохранить напоминание',
      modificator: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe803;',
      titleText: 'Соавторы',
      modificator: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe804;',
      titleText: 'Изменить цвет',
      modificator: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe802;',
      titleText: 'Добавить картинку',
      modificator: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe805;',
      titleText: 'Архивировать',
      modificator: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe81f;',
      titleText: 'Ещё',
      modificator: 'icon-button_smaller',
      // onClick: showPopupMenu({
      //   type: type.startsWith('add-') ? 'tight' : 'expanded',
      //   index,
      //   isList: type.endsWith('list'),
      //   hasMarkedItems,
      // }),
      onClick() {
        dispatch(setNotePopup(index, 'menu'));
      },
      append: popup === 'menu' && PopupMenu(),
    },
    {
      iconSymbol: '&#xe807;',
      titleText: 'Отменить',
      modificator: 'icon-button_smaller',
      disabled: true,
    },
    {
      iconSymbol: '&#xe808;',
      titleText: 'Повторить',
      modificator: 'icon-button_smaller',
      disabled: true,
    },
  ].map((params) => IconButton(params));
}

// ШАБЛОН ЗАМЕТКИ / NOTE
// *
export function Note({
  type = 'default',
  index,
  popup,
  headerText = '',
  text = '',
  items = [],
  markedItems = [],
  isFocused,
  onClick = null,
  onHeaderBlur = [],
  onTextFieldBlur,
  onListItemBlur,
  onListItemAdd,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  checkButtonParams = {
    iconSymbol: '&#xe80b;',
    titleText: 'Выбрать заметку',
    modificator: 'icon-button_no-padding',
  },
  cornerButtonsParams = {
    iconSymbol: '&#xe812;',
    titleText: 'Закрепить заметку',
    modificator: 'icon-button_smaller',
  },
} = {}) {
  const NoteElement = setupBuilder('template-note')({
    '.note': {
      eventHandlers: {
        click: onClick,
      },
    },
    '.note__check': {
      append: IconButton(checkButtonParams),
    },
    '.note__cornerButtons': {
      append: IconButton(cornerButtonsParams),
    },
    '.note__header': {
      props: { value: headerText },
      eventHandlers: { blur: onHeaderBlur },
    },
    '.note__text': {
      cut: type === 'list',
      append: Textarea({
        placeholder: 'Заметка...',
        value: text,
        onBlur: onTextFieldBlur,
      }),
    },
    '.note__info': {
      append: Notification(),
    },
    '.note__creationTime': {
      append: CreationTime('Изменено: вчера, 20:30', 'Создано 8 апр.'),
    },
    '.note__buttons': {
      append: getNoteButtons({
        // REPLACE!!!
        popup,
        index,
        hasMarkedItems: !!markedItems.length,
      }),
    },
    '.note__listWrapper': {
      cut: type === 'default',
    },
    '.note__list': {
      append: [
        ...items.map((item) =>
          ListItem({
            text: item.text,
            onBlur: onListItemBlur(index, item.index),
            onRemove: onListItemRemove(index, item.index),
            onCheck: onListItemCheck(index, item.index),
          })
        ),
        ListItem({ type: 'add', onInput: onListItemAdd(index) }),
      ],
    },
    '.note__markedList .note__list': {
      append: markedItems.map((item) =>
        ListItem({
          isChecked: true,
          text: item.text,
          onBlur: onListItemBlur(index, item.index),
          onRemove: onListItemRemove(index, item.index),
          onCheck: onListItemUncheck(index, item.index),
        })
      ),
    },
    '.note__button': {
      cut: !isFocused,
    },
  });

  return NoteElement;
}

export default function NoteContainer(params) {
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
  return Note({
    ...newParams,
    items: unmarkedItems,
    markedItems,
    onListItemBlur: (index, itemNum, subNum) => ({
      target: { value: itemText },
    }) => {
      dispatch(updateNoteListItem(index, itemText, itemNum, subNum));
    },
    onListItemAdd: (index) => ({ target: { value: itemText } }) => {
      if (itemText !== '') {
        dispatch(addNoteListItem(index, itemText));
      }
    },
    onListItemRemove: (index, itemNum) => () => {
      dispatch(removeNoteListItem(index, itemNum));
    },
    onListItemCheck: (index, itemNum) => () => {
      dispatch(checkNoteListItem(index, itemNum));
    },
    onListItemUncheck: (index, itemNum) => () => {
      dispatch(uncheckNoteListItem(index, itemNum));
    },
  });
}
