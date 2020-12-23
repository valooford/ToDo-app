import React from 'react';
import cn from 'classnames';

import Option from '@components/Option/Option';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';

import style from './PopupReminder-cfg.module.scss';

export default function PopupReminderMain({
  setDate,
  onClose,
  onChoosingDate,
  onChoosingPlace,
  autofocusRef,
}) {
  const optionParams = [
    {
      details: '20:00',
      text: 'Сегодня',
      disabled: new Date().getHours() >= 20,
      onClick() {
        const today = new Date();
        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          20
        );
        setDate(date);
        onClose();
      },
      ref: autofocusRef,
    },
    {
      details: '08:00',
      text: 'Завтра',
      onClick() {
        const today = new Date();
        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1,
          8
        );
        setDate(date);
        onClose();
      },
    },
    // monday of the next week
    {
      details: 'пн, 08:00',
      text: 'На следующей неделе',
      onClick() {
        const today = new Date();
        let day = today.getDay() - 1;
        if (day === -1) day = 6;
        // now 0 - monday, 6 - sunday
        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 7 - day,
          8
        );
        setDate(date);
        onClose();
      },
    },
    {
      iconSymbol: '\ue809',
      text: 'Выбрать дату и время',
      onClick: onChoosingDate,
    },
    {
      iconSymbol: '\ue80a',
      text: 'Выбрать место',
      onClick: onChoosingPlace,
    },
  ];
  return (
    <KeyboardTrap autofocus usingArrows key="main">
      <fieldset className={style['popup-reminder__main']}>
        <legend className={cn(style['popup-reminder__legend'])}>
          Напоминание:
        </legend>
        <div className={style['popup-reminder__fields']}>
          {optionParams.map((params) => (
            <Option
              details={params.details}
              iconSymbol={params.iconSymbol}
              disabled={params.disabled}
              onClick={params.onClick}
              key={params.text}
              ref={params.ref}
            >
              {params.text}
            </Option>
          ))}
        </div>
      </fieldset>
    </KeyboardTrap>
  );
}
