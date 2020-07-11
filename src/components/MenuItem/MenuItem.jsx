import React from 'react';
import style from './MenuItem-cfg.module.scss';

// КОМПОНЕНТ ПУНКТА МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
export default function IconedMenuItem({ isSelected, iconSymbol, text }) {
  return (
    <li
      className={`${style['iconed-menu-item']}${
        isSelected ? ` ${style['iconed-menu-item_selected']}` : ''
      }`}
    >
      <i className={style['iconed-menu-item__icon']}>{iconSymbol}</i>
      {text}
    </li>
  );
}
