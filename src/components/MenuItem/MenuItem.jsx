import './MenuItem-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
// import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// export default function IconedMenuItem(iconSymbol, text, isSelected) {
//   return setupBuilder('template-iconed-menu-item')({
//     '.iconed-menu-item': {
//       append: text,
//       modificators: isSelected && ['iconed-menu-item_selected'],
//     },
//     '.iconed-menu-item__icon': {
//       html: iconSymbol,
//     },
//   });
// }

// ПУНКТ МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
/* eslint-disable react/destructuring-assignment */
export default function IconedMenuItem(props) {
  return (
    <li
      className={`iconed-menu-item${
        props.isSelected ? ' iconed-menu-item_selected' : ''
      }`}
    >
      <i className="iconed-menu-item__icon">{props.iconSymbol}</i>
      {props.text}
    </li>
  );
}
