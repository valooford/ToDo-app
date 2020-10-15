import React from 'react';
/* eslint-disable import/no-unresolved */
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
/* eslint-enable import/no-unresolved */

import style from './PopupMenu-cfg.module.scss';

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ / POPUP-MENU
// *
function PopupMenu({ items, onMouseDown, onKeyDown }, ref) {
  return (
    <KeyboardTrap inline autofocus usingArrows>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <ul
        className={style['popup-menu']}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        ref={ref}
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

export default React.forwardRef(PopupMenu);
