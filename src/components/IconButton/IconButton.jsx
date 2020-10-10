import React from 'react';
import cn from 'classnames';
import style from './IconButton-cfg.module.scss';

// КОМПОНЕНТ КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
function IconButton(
  {
    iconSymbol = '',
    modificators = [],
    disabled,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  },
  ref
) {
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <button
      type="button"
      className={cn(
        style['icon-button'],
        modificators.map
          ? modificators.map((m) => style[m])
          : style[modificators]
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      ref={ref}
    >
      <span className={style['icon-button__icon']}>{iconSymbol}</span>
    </button>
  );
}

export default React.forwardRef(IconButton);
