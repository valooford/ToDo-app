import React, { useState } from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */

import IconButtonComponent from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './Label-cfg.module.scss';

// КОМПОНЕНТ МЕТКИ / LABEL
// *
function Label(
  {
    text,
    iconSymbol,
    isSecondary,
    onRemove,
    onClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    IconButton = IconButtonComponent,
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const handleClick = (e) => {
    if (e.target.closest(`.${style.label__close}`)) return;
    if (onClick) onClick();
  };
  // using span instead of button because of incorrect behavior
  // of event handlers of nested buttons in IE
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      className={cn(style.label, {
        [style.label_secondary]: isSecondary,
        [style.label_focused]: isFocused,
      })}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        // Enter
        if (e.keyCode === 13) {
          handleClick(e);
        }
      }}
      onFocus={() => {
        setIsFocused(true);
        if (onFocus) onFocus();
      }}
      onBlur={() => {
        setIsFocused(false);
        if (onBlur) onBlur();
      }}
      onMouseEnter={() => {
        setIsFocused(true);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsFocused(false);
        if (onMouseLeave) onMouseLeave();
      }}
      ref={ref}
    >
      {iconSymbol && <span className={style.label__icon}>{iconSymbol}</span>}
      {isFocused ? `${text.slice(0, -3)}...` : text}
      {onRemove && (
        <span className={style.label__close}>
          <IconButton
            iconSymbol="&#xe80c;"
            titleText="Удалить напоминание"
            modificators="icon-button_label"
            onClick={onRemove}
          />
        </span>
      )}
    </span>
  );
}

export default React.forwardRef(Label);
