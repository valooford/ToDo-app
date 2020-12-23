import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { getFormattedDate, getPeriodString } from '@/utils';

import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
import IconButtonComponent from '@components/IconButton/IconButton';
import DropdownComponent from '@components/Dropdown/Dropdown';
import Option from '@components/Option/Option';
import Calendar from '@components/Calendar/Calendar';
import Button from '@components/Button/Button';

import style from './PopupReminder-cfg.module.scss';

const everyFieldsetUnitsOptions = [
  { children: 'дн.', value: 'daily', key: 'days' },
  { children: 'нед.', value: 'weekly', key: 'weeks' },
  { children: 'мес.', value: 'monthly', key: 'months' },
  { children: 'г.', value: 'yearly', key: 'years' },
];
const daysOfTheWeek = [
  { text: 'пн', day: 1 },
  { text: 'вт', day: 2 },
  { text: 'ср', day: 3 },
  { text: 'чт', day: 4 },
  { text: 'пт', day: 5 },
  { text: 'сб', day: 6 },
  { text: 'вс', day: 0 },
];

// transforming method into units
const getUnitsByMethod = (method) => {
  switch (method) {
    case 'daily':
      return 'дн.';
    case 'weekly':
      return 'нед.';
    case 'monthly':
      return 'мес.';
    case 'yearly':
      return 'г.';
    default:
      return undefined;
  }
};
export default function PopupReminderPeriod({
  isValid,
  periodFieldsetData,
  period,
  onEveryFieldsetUnitInput,
  onEndFieldsetDateInput,
  togglePeriodEveryDays,
  onEveryFieldsetInputChange,
  onEndFieldsetInputChange,
  setPeriodEveryKeep, // ~
  setPeriodEndType,
  dateValidator,
  autofocusRef,
  onReady,
  onBack,
  IconButton = IconButtonComponent,
  Dropdown = DropdownComponent,
}) {
  const neverRadioButtonRef = React.createRef();
  const countRadioButtonRef = React.createRef();
  const dateRadioButtonRef = React.createRef();
  const keepDateRadioButtonRef = React.createRef();
  const keepDayRadioButtonRef = React.createRef();

  // autofocusing the radio buttons
  useEffect(() => {
    if (periodFieldsetData.end.type === 'never')
      neverRadioButtonRef.current.checked = true;
    else if (periodFieldsetData.end.type === 'count')
      countRadioButtonRef.current.checked = true;
    else if (periodFieldsetData.end.type === 'date')
      dateRadioButtonRef.current.checked = true;
  }, []);
  useEffect(() => {
    if (periodFieldsetData.every.method !== 'monthly') return;
    const { keep } = periodFieldsetData.every;
    if (keep === 'date') {
      keepDateRadioButtonRef.current.checked = true;
    } else if (keep === 'day') {
      keepDayRadioButtonRef.current.checked = true;
    }
  }, [periodFieldsetData.every.method]);

  // the period field's validity states
  const [isPeriodEveryCountInvalid, setIsPeriodEveryCountInvalid] = useState(
    false
  );
  const [isPeriodEndCountInvalid, setIsPeriodEndCountInvalid] = useState(false);

  // handling radio buttons selection
  const onEndFieldsetClick = ({ target }) => {
    if (target === neverRadioButtonRef.current) {
      setPeriodEndType('never');
    } else if (target === countRadioButtonRef.current) {
      setPeriodEndType('count');
    } else if (target === dateRadioButtonRef.current) {
      setPeriodEndType('date');
    }
  };
  const onEndFieldsetInputFocus = () => {
    // eslint-disable-next-line no-param-reassign
    countRadioButtonRef.current.checked = true;
    setPeriodEndType('count');
  };
  const onEndFieldsetDateFocus = () => {
    // eslint-disable-next-line no-param-reassign
    dateRadioButtonRef.current.checked = true;
    setPeriodEndType('date');
  };

  return (
    <KeyboardTrap key="period">
      <fieldset className={style['popup-reminder__period']}>
        <legend
          className={cn(
            style['popup-reminder__legend'],
            style['popup-reminder__legend_sub']
          )}
        >
          <span className={style['popup-reminder__back-button']}>
            {' '}
            <IconButton
              iconSymbol="&#xe813;"
              titleText="Назад"
              modificators={['icon-button_tiny']}
              onClick={onBack}
            />
          </span>
          Повторять
        </legend>
        <fieldset className={style['popup-reminder__every']}>
          <legend>Кажд.</legend>
          <div className={style['popup-reminder__fields']}>
            <input
              className={cn(style['popup-reminder__input'], {
                [style[
                  'popup-reminder__input_invalid'
                ]]: isPeriodEveryCountInvalid,
              })}
              type="text"
              defaultValue={periodFieldsetData.every.count}
              onChange={(e) => {
                const isInvalid = onEveryFieldsetInputChange(e.target.value);
                setIsPeriodEveryCountInvalid(isInvalid);
              }}
              ref={autofocusRef}
            />
            <Dropdown
              noInput
              defaultValue={getUnitsByMethod(periodFieldsetData.every.method)}
              titleText="Выбрать единицу измерения частоты"
              onInput={onEveryFieldsetUnitInput}
              component={Option}
              componentsParams={everyFieldsetUnitsOptions}
              componentActionValueParser={getUnitsByMethod}
            />
            {periodFieldsetData.every.method === 'weekly' && (
              <div className={style['popup-reminder__days-of-the-week']}>
                {daysOfTheWeek.map(({ text, day }) => {
                  return (
                    <button
                      className={cn(style['popup-reminder__day-button'], {
                        [style['popup-reminder__day-button_selected']]:
                          periodFieldsetData.every.days.indexOf(day) !== -1,
                      })}
                      type="button"
                      onClick={togglePeriodEveryDays(day)}
                      key={day}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            )}
            {periodFieldsetData.every.method === 'monthly' && (
              <div
                className={style['popup-reminder__every-keep-radio-buttons']}
              >
                <label htmlFor="keep-date">
                  <input
                    type="radio"
                    id="keep-date"
                    name="every-keep"
                    onClick={() => {
                      setPeriodEveryKeep('date');
                    }}
                    ref={keepDateRadioButtonRef}
                  />
                  Один и тот же день месяца
                </label>
                <label htmlFor="keep-day">
                  <input
                    type="radio"
                    id="keep-day"
                    name="every-keep"
                    onClick={() => {
                      setPeriodEveryKeep('day');
                    }}
                    ref={keepDayRadioButtonRef}
                  />
                  День недели месяца
                </label>
              </div>
            )}
          </div>
        </fieldset>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
        <fieldset
          className={style['popup-reminder__end']}
          onClick={onEndFieldsetClick}
        >
          <legend>Окончание</legend>
          <div className={style['popup-reminder__fields']}>
            <label htmlFor="end-never">
              <input
                type="radio"
                id="end-never"
                name="end-period"
                ref={neverRadioButtonRef}
              />
              Никогда
            </label>
            <label htmlFor="end-count">
              <input
                type="radio"
                id="end-count"
                name="end-period"
                ref={countRadioButtonRef}
              />
              После
              <input
                className={cn(style['popup-reminder__input'], {
                  [style[
                    'popup-reminder__input_invalid'
                  ]]: isPeriodEndCountInvalid,
                })}
                type="text"
                defaultValue={periodFieldsetData.end.count || 2}
                onFocus={onEndFieldsetInputFocus}
                onChange={(e) => {
                  const isInvalid = onEndFieldsetInputChange(e.target.value);
                  setIsPeriodEndCountInvalid(isInvalid);
                }}
              />
              повт.
            </label>
            <label htmlFor="end-date">
              <input
                type="radio"
                id="end-date"
                name="end-period"
                ref={dateRadioButtonRef}
              />
              Дата
              <Dropdown
                defaultValue={getFormattedDate(periodFieldsetData.end.date, {
                  noDetails: true,
                  includeYear: true,
                  noTime: true,
                })}
                titleText="Выбрать дату окончания"
                validate={dateValidator}
                onInput={onEndFieldsetDateInput}
                onFocus={onEndFieldsetDateFocus}
                component={Calendar}
                componentsParams={[
                  { date: periodFieldsetData.end.date, key: 'calendar' },
                ]}
                componentActionPropertyName="onSelect"
                keepChildWidth
              />
            </label>
          </div>
        </fieldset>
        <div className={style['popup-reminder__description']}>
          {getPeriodString(period)}
        </div>
        <span className={style['popup-reminder__ready-button']}>
          <Button disabled={!isValid} onClick={onReady}>
            Готово
          </Button>
        </span>
      </fieldset>
    </KeyboardTrap>
  );
}
