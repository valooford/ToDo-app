import './MenuItem-cfg.scss';
import React from 'react';

// КОМПОНЕНТ ПУНКТА МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
export default function IconedMenuItem({ isSelected, iconSymbol, text }) {
  return (
    <li
      className={`iconed-menu-item${
        isSelected ? ' iconed-menu-item_selected' : ''
      }`}
    >
      <i className="iconed-menu-item__icon">{iconSymbol}</i>
      {text}
    </li>
  );
}
