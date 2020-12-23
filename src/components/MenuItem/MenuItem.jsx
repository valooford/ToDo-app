import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import style from './MenuItem-cfg.module.scss';

// КОМПОНЕНТ ПУНКТА МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
function IconedMenuItem(
  { to, isSelected, isConcise, iconSymbol, text, onClick },
  ref
) {
  return (
    <li
      className={cn(style['iconed-menu-item'], {
        [style['iconed-menu-item_selected']]: isSelected,
        [style['iconed-menu-item_concise']]: isConcise,
      })}
    >
      {to ? (
        <Link to={to} className={style['iconed-menu-item__link']} ref={ref}>
          <i className={style['iconed-menu-item__icon']}>{iconSymbol}</i>
          <span className={style['iconed-menu-item__text']}>{text}</span>
        </Link>
      ) : (
        <button
          type="button"
          className={style['iconed-menu-item__link']}
          onClick={onClick}
          ref={ref}
        >
          <i className={style['iconed-menu-item__icon']}>{iconSymbol}</i>
          <span className={style['iconed-menu-item__text']}>{text}</span>
        </button>
      )}
    </li>
  );
}

export default React.forwardRef(IconedMenuItem);
