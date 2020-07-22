import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */
import style from './IconButton-cfg.module.scss';

// КОМПОНЕНТ КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
function IconButton(
  { iconSymbol = '', titleText = '', modificators = [], disabled, onClick },
  ref
) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <button
      type="button"
      className={cn(
        style['icon-button'],
        modificators.map
          ? modificators.map((m) => style[m])
          : style[modificators]
      )}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      <span className={style['icon-button__icon']}>{iconSymbol}</span>
      <br />
      <span className={style['icon-button__title']}>
        {titleText && <Title text={titleText} />}
      </span>
    </button>
  );
}

export default React.forwardRef(IconButton);
