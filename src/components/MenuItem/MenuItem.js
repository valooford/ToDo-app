import './MenuItem-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ПУНКТ МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
export default function setupIconedMenuItem(iconSymbol, text, isSelected) {
  return setupBuilder('template-iconed-menu-item')({
    insert: {
      '.iconed-menu-item__icon': { html: iconSymbol },
    },
    append: [text],
    modificators: isSelected ? ['iconed-menu-item_selected'] : [],
  });
}
