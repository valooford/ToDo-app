import React from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './Dropdown-cfg.module.scss';

export default function Dropdown({
  value,
  titleText,
  children,
  noInput,
  keepChildWidth,
}) {
  return (
    <span
      className={cn(style.dropdown, {
        [style['dropdown_keep-width']]: keepChildWidth,
      })}
    >
      <input
        className={style.dropdown__input}
        type="text"
        defaultValue={value}
        disabled={noInput}
      />
      <i className={style['dropdown__drop-button']}>
        <IconButton
          iconSymbol="&#xe81a;"
          titleText={titleText}
          modificators={['icon-button_tiny']}
        />
      </i>
      {children && <div className={style.dropdown__options}>{children}</div>}
    </span>
  );
}
