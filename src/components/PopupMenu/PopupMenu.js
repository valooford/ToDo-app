import './PopupMenu-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

const menuItems = [
  'Удалить заметку',
  'Добавить ярлык',
  'Добавить рисунок',
  'Создать копию',
  'В виде списка',
  'Скопировать в Google Документы',
];

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function setupPopupMenu() {
  return setupBuilder('template-popup-menu')({
    clone: {
      '.popup-menu__item': menuItems.length - 1,
    },
    insert: {
      '.popup-menu__item *': menuItems,
    },
  });
}
