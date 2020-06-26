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

function getNoteButtons(noteProps) {
  const { index, popup } = noteProps;
  return [
    {
      iconSymbol: '&#xf0f3;',
      titleText: 'Сохранить напоминание',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe803;',
      titleText: 'Соавторы',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe804;',
      titleText: 'Изменить цвет',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe802;',
      titleText: 'Добавить картинку',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe805;',
      titleText: 'Архивировать',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '&#xe81f;',
      titleText: 'Ещё',
      modificators:
        popup === 'menu'
          ? ['icon-button_smaller', 'icon-button_no-hover']
          : 'icon-button_smaller',
      onClick() {
        function popupDisappearanceHandler() {
          // const closestPopup = e.target.closest(
          //   `*:nth-of-type(${index + 1}) > .note .popup-menu`
          // );
          // if (!closestPopup) {
          dispatch(setNotePopup(index, ''));
          document.removeEventListener('click', popupDisappearanceHandler);
          // }
        }

        dispatch(setNotePopup(index, 'menu'));
        if (popup !== 'menu') {
          setTimeout(() => {
            document.addEventListener('click', popupDisappearanceHandler);
          }, 0);
        }
      },
      append: popup === 'menu' && PopupMenu(noteProps),
    },
    {
      iconSymbol: '&#xe807;',
      titleText: 'Отменить',
      modificators: 'icon-button_smaller',
      disabled: true,
    },
    {
      iconSymbol: '&#xe808;',
      titleText: 'Повторить',
      modificators: 'icon-button_smaller',
      disabled: true,
    },
  ].map((params) => IconButton(params));
}

// ШАБЛОН ЗАМЕТКИ / NOTE
// *
export function Note({
  type = 'default',
  index,
  buttons,
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
    modificators: 'icon-button_no-padding',
  },
  cornerButtonsParams = {
    iconSymbol: '&#xe812;',
    titleText: 'Закрепить заметку',
    modificators: 'icon-button_smaller',
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
      append: buttons,
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

export default function NoteContainer(props) {
  const { items, ...newProps } = props;
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
    ...newProps,
    items: unmarkedItems,
    markedItems,
    buttons: getNoteButtons({ ...newProps, items, markedItems }),
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
