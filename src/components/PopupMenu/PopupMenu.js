import './PopupMenu-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';

import store from '@store/store';
import {
  removeNote,
  copyNote,
  textNoteToList,
  listNoteToText,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

function getMenuItems({ isExpanded, isList, hasMarkedItems } = {}) {
  const menuItems = [{ text: 'Добавить ярлык' }, { text: 'Добавить рисунок' }];
  if (isList) {
    if (hasMarkedItems) {
      menuItems.push(
        { text: 'Снять все флажки' },
        { text: 'Удалить отмеченные пункты' }
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
  if (isExpanded) {
    menuItems.unshift({
      text: 'Удалить заметку',
      onClick(index) {
        return () => {
          dispatch(removeNote([index]));
        };
      },
    });
    menuItems.splice(2, 0, {
      text: 'Создать копию',
      onClick(index) {
        return () => {
          dispatch(copyNote(index));
        };
      },
    });
    menuItems.push({ text: 'Скопировать в Google Документы' });
  }
  return menuItems;
}

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function setupPopupMenu({
  index,
  isExpanded,
  isList,
  hasMarkedItems,
} = {}) {
  const menuItems = getMenuItems({ isExpanded, isList, hasMarkedItems });
  return setupBuilder('template-popup-menu')({
    clone: {
      '.popup-menu__item': menuItems.length - 1,
    },
    insert: {
      '.popup-menu__item': menuItems.map((item) => item.text),
    },
    elementsEventHandlers: {
      '.popup-menu__item': {
        click: menuItems.map((item) => {
          if (item.onClick) {
            return item.onClick(index);
          }
          return null;
        }),
      },
    },
  });
}
