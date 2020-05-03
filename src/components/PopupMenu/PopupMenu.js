import './PopupMenu-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';

import store from '@store/store';
import { removeNote } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

const { dispatch } = store;

const menuItems = [
  {
    text: 'Удалить заметку',
    onClick(index) {
      return () => {
        dispatch(removeNote(index));
      };
    },
  },
  { text: 'Добавить ярлык', tight: true },
  { text: 'Добавить рисунок', tight: true },
  { text: 'Создать копию' },
  { text: 'В виде списка', tight: true },
  { text: 'Скопировать в Google Документы' },
];

const tightMenuItems = menuItems.filter((el) => el.tight);

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function setupPopupMenu({ index, type = 'expanded' } = {}) {
  switch (type) {
    case 'tight':
      return setupBuilder('template-popup-menu')({
        clone: {
          '.popup-menu__item': tightMenuItems.length - 1,
        },
        insert: {
          '.popup-menu__item': tightMenuItems.map((item) => item.text),
        },
        elementsEventHandlers: {
          '.popup-menu__item': {
            click: tightMenuItems.map((item) => {
              // ???
              if (item.onClick) {
                return item.onClick(index);
              }
              return null;
            }),
          },
        },
      });
    case 'expanded':
    default:
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
}
