import React from 'react';
/* eslint-disable import/no-unresolved */
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
/* eslint-enable import/no-unresolved */

import style from './PopupMenu-cfg.module.scss';

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ / POPUP-MENU
// *
export default function PopupMenu({ items, onClick, onKeyDown }) {
  return (
    <KeyboardTrap inline autofocus usingArrows>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <ul
        className={style['popup-menu']}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {items.map((item) => (
          <li key={item.key}>
            <button
              className={style['popup-menu__item']}
              type="button"
              onClick={item.onClick}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </KeyboardTrap>
  );
}