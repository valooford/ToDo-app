import './MenuItem-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ПУНКТ МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
export default function IconedMenuItem(iconSymbol, text, isSelected) {
  return setupBuilder('template-iconed-menu-item')({
    '.iconed-menu-item': {
      append: text,
      modificators: isSelected && ['iconed-menu-item_selected'],
    },
    '.iconed-menu-item__icon': {
      html: iconSymbol,
    },
  });
}
