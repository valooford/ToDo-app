import React from 'react';
import cn from 'classnames';

import style from './IconTile.module.scss';

export default function IconTile({ text, iconSymbol, accented, onClick }) {
  return (
    <button
      type="button"
      className={cn(style.tile, {
        [style.tile_accented]: accented,
      })}
      onClick={onClick}
    >
      <div className={style.square}>
        <div className={style.icon}>{iconSymbol}</div>
        <div className={style.text}>{text}</div>
      </div>
    </button>
  );
}
