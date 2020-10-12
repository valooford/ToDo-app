import React from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import {
  getFormattedDate,
  getPeriodString,
  getDateParamsFromString,
  isTimePassed,
} from '@/utils';

import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
import IconButtonComponent from '@components/IconButton/IconButton';
import DropdownComponent from '@components/Dropdown/Dropdown';
import Calendar from '@components/Calendar/Calendar';
import Option from '@components/Option/Option';
import Button from '@components/Button/Button';
/* eslint-enable import/no-unresolved */
import style from './PopupReminder-cfg.module.scss';

export default function PopupReminderDate({
  fieldsetData,
  dateValidator,
  autofocusRef,
  onDateInput,
  onTimeInput,
  onPeriodInput,
  setAsValid,
  setAsInvalid,
  onSave,
  onBack,
  onChoosingPeriod,
  IconButton = IconButtonComponent,
  Dropdown = { DropdownComponent },
}) {
  const timeValidator = (time) => {
    const dateParams = getDateParamsFromString(time);
    if (dateParams && dateParams.type === 'time') {
      const { type, ...params } = dateParams;
      if (isTimePassed(fieldsetData.date, ...Object.values(params))) {
        setAsInvalid();
        return false;
      }
      setAsValid();
      return Object.values(params);
    }
    setAsInvalid();
    return false;
  };
  const timeOptions = [
    {
      details: '08:00',
      value: '08:00',
      children: 'Утро',
      disabled: isTimePassed(fieldsetData.date, 8),
      key: 'morning',
    },
    {
      details: '13:00',
      value: '13:00',
      children: 'День',
      disabled: isTimePassed(fieldsetData.date, 13),
      key: 'day',
    },
    {
      details: '18:00',
      value: '18:00',
      children: 'Вечер',
      disabled: isTimePassed(fieldsetData.date, 18),
      key: 'evening',
    },
    {
      details: '20:00',
      value: '20:00',
      children: 'Ночь',
      disabled: isTimePassed(fieldsetData.date, 20),
      key: 'night',
    },
    { children: 'Другое', key: 'other', focusOnClick: true },
  ];
  const periodOptions = [
    { children: 'Не повторять', key: 'no period' },
    {
      children: 'Каждый день',
      value: { every: { method: 'daily', count: 1 } },
      key: 'daily',
    },
    {
      children: 'Каждую неделю',
      value: { every: { method: 'weekly', count: 1 } },
      key: 'weekly',
    },
    {
      children: 'Каждый месяц',
      value: { every: { method: 'monthly', count: 1 } },
      key: 'monthly',
    },
    {
      children: 'Каждый год',
      value: { every: { method: 'yearly', count: 1 } },
      key: 'yearly',
    },
    {
      children: 'Другое',
      key: 'other',
      onClick: onChoosingPeriod,
    },
  ];

  const setTimeRef = React.createRef();
  const setPeriodRef = React.createRef();
  return (
    <KeyboardTrap key="date">
      <fieldset className={style['popup-reminder__date']}>
        <legend
          className={cn(
            style['popup-reminder__legend'],
            style['popup-reminder__legend_sub']
          )}
        >
          <span className={style['popup-reminder__back-button']}>
            <IconButton
              iconSymbol="&#xe813;"
              titleText="Назад"
              modificators={['icon-button_tiny']}
              onClick={onBack}
            />
          </span>
          Выбрать дату и время
        </legend>
        <div className={style['popup-reminder__fields']}>
          <Dropdown
            defaultValue={getFormattedDate(fieldsetData.date, {
              noDetails: true,
              includeYear: true,
              noTime: true,
            })}
            titleText="Выбрать дату"
            validate={dateValidator}
            onInput={onDateInput}
            component={Calendar}
            componentsParams={[{ date: fieldsetData.date, key: 'calendar' }]}
            componentActionPropertyName="onSelect"
            extraordinaryFocusRef={autofocusRef}
            keepChildWidth
            ref={autofocusRef}
          />
          <Dropdown
            defaultValue={getFormattedDate(fieldsetData.date, {
              timeOnly: true,
            })}
            titleText="Выбрать время"
            validate={timeValidator}
            initialValidationDependencies={[fieldsetData.date]}
            onInput={onTimeInput}
            component={Option}
            componentsParams={timeOptions}
            extraordinaryFocusRef={setTimeRef}
            ref={setTimeRef}
          />
          <Dropdown
            noInput
            defaultValue={getPeriodString(fieldsetData.period)}
            titleText="Выбрать частоту"
            onInput={onPeriodInput}
            component={Option}
            componentsParams={periodOptions}
            componentActionValueParser={getPeriodString}
            extraordinaryFocusRef={setPeriodRef}
            ref={setPeriodRef}
          />
        </div>
        <span className={style['popup-reminder__ready-button']}>
          <Button disabled={!fieldsetData.isValid} onClick={onSave}>
            Сохранить
          </Button>
        </span>
      </fieldset>
    </KeyboardTrap>
  );
}
