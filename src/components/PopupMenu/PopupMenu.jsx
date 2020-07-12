import React from 'react';

import style from './PopupMenu-cfg.module.scss';

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ / POPUP-MENU
// *
export default function PopupMenu({ items }) {
  return (
    <ul className={style['popup-menu']}>
      {items.map((item) => (
        <li className={style['popup-menu__item']}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <span onClick={item.onClick}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
