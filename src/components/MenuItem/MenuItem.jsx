import React from 'react';
import cn from 'classnames';
import style from './MenuItem-cfg.module.scss';

// КОМПОНЕНТ ПУНКТА МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
export default function IconedMenuItem({ isSelected, iconSymbol, text }) {
  return (
    <li
      className={cn(style['iconed-menu-item'], {
        [style['iconed-menu-item_selected']]: isSelected,
      })}
    >
      <i className={style['iconed-menu-item__icon']}>{iconSymbol}</i>
      {text}
    </li>
  );
}
