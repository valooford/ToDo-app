import React, { useState } from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import { getFormattedDate } from '@/utils';

import IconButton from '@components/IconButton/IconButton';
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */
import style from './Reminder-cfg.module.scss';

// КОМПОНЕНТ НАПОМИНАНИЯ / REMINDER
// *
export default function Reminder({ date, period, place, onRemove, onClick }) {
  const fullText = (date && getFormattedDate(date)) || place;
  let text = fullText;
  const commaIndex = text.indexOf(',');
  if (!date && commaIndex !== -1) {
    text = text.slice(0, commaIndex);
  }
  let iconSymbol;
  if (date) {
    iconSymbol = period ? '\ue820' : '\ue809';
  } else {
    iconSymbol = '\ue80a';
  }
  const [isFocused, setIsFocused] = useState(false);
  if (isFocused) {
    text = `${text.slice(0, -3)}...`;
  }
  const handleClick = (e) => {
    if (e.target.closest(`.${style.reminder__close}`)) return;
    onClick();
  };
  // using span instead of button because of incorrect behavior
  // of event handlers of nested buttons in IE
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      className={cn(style.reminder, { [style.reminder_focused]: isFocused })}
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
      }}
      onMouseEnter={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      onMouseLeave={() => {
        setIsFocused(false);
      }}
    >
      <span className={style.reminder__icon}>{iconSymbol}</span>
      {text}
      <span className={style.reminder__close}>
        <IconButton
          iconSymbol="&#xe80c;"
          titleText="Удалить напоминание"
          modificators="icon-button_reminder"
          onClick={onRemove}
        />
      </span>
      {!date && commaIndex !== -1 && (
        <span className={style.reminder__title}>
          <Title text={fullText} />
        </span>
      )}
    </span>
  );
}
