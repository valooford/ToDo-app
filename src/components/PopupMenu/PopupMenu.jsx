import React from 'react';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';

import style from './PopupMenu-cfg.module.scss';

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ / POPUP-MENU
// *
export default function PopupMenu({ items, onMouseDown, onKeyDown }) {
  return (
    <KeyboardTrap inline autofocus usingArrows>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <ul
        className={style['popup-menu']}
        onMouseDown={onMouseDown}
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
