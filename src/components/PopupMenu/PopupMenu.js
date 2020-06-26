import './PopupMenu-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';

import store from '@store/store';
import {
  removeNote,
  copyNote,
  uncheckAllListItems,
  removeCheckedListItems,
  textNoteToList,
  listNoteToText,
  setNotePopup,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

function getMenuItems({ isFieldsFilled, isList, hasMarkedItems } = {}) {
  const menuItems = [{ text: 'Добавить ярлык' }, { text: 'Добавить рисунок' }];
  if (isFieldsFilled) {
    menuItems.unshift({
      text: 'Удалить заметку',
      onClick(index) {
        return () => {
          dispatch(removeNote([index]));
        };
      },
    });
    menuItems.push({
      text: 'Создать копию',
      onClick(index) {
        return () => {
          dispatch(setNotePopup(index, ''));
          dispatch(copyNote(index));
        };
      },
    });
  }
  if (isList) {
    if (hasMarkedItems) {
      menuItems.push(
        {
          text: 'Снять все флажки',
          onClick(index) {
            return () => {
              dispatch(uncheckAllListItems(index));
            };
          },
        },
        {
          text: 'Удалить отмеченные пункты',
          onClick(index) {
            return () => {
              dispatch(removeCheckedListItems(index));
            };
          },
        }
      );
    }
    menuItems.push({
      text: 'Обычный текст',
      onClick(index) {
        return () => {
          dispatch(listNoteToText(index));
        };
      },
    });
  } else {
    menuItems.push({
      text: 'В виде списка',
      onClick(index) {
        return () => {
          dispatch(textNoteToList(index));
        };
      },
    });
  }
  if (isFieldsFilled) {
    menuItems.push({ text: 'Скопировать в Google Документы' });
  }

  return menuItems;
}

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
function PopupMenu({ index, items } = {}) {
  return setupBuilder('template-popup-menu')({
    '.popup-menu__item': {
      clone: items.length - 1,
      append: items.map((item) => item.text),
      eventHandlers: {
        click: items.map((item) => {
          return item.onClick ? item.onClick(index) : null;
        }),
      },
    },
  });
}

export default function PopupMenuContainer(props) {
  const { type, headerText, text, items, markedItems, index } = props;
  let isFieldsFilled = false;
  if (
    (headerText && headerText !== '') ||
    (type === 'default' && text && text !== '') ||
    (type === 'list' &&
      ((items && !!items.length) || (markedItems && !!markedItems.length)))
  ) {
    isFieldsFilled = true;
  }
  const newProps = {
    index,
    items: getMenuItems({
      isList: type === 'list',
      isFieldsFilled,
      hasMarkedItems: markedItems && !!markedItems.length,
    }),
  };
  return PopupMenu(newProps);
}
