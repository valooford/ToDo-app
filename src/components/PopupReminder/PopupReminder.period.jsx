import React from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import { getFormattedDate, getFormattedPeriod } from '@/utils';

import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
import IconButton from '@components/IconButton/IconButton';
import Dropdown from '@components/Dropdown/Dropdown';
import Option from '@components/Option/Option';
import Calendar from '@components/Calendar/Calendar';
import Button from '@components/Button/Button';
/* eslint-enable import/no-unresolved */
import style from './PopupReminder-cfg.module.scss';

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
  fieldsetData,
  setFieldsetData,
  periodFieldsetData,
  setPeriodFieldsetData,
  setPeriodEveryCount,
  isPeriodEveryCountInvalid,
  setIsPeriodEveryCountInvalid,
  setPeriodEveryKeep,
  setPeriodEndType,
  setPeriodEndCount,
  isPeriodEndCountInvalid,
  setIsPeriodEndCountInvalid,
  dateValidator,
  autofocusRef,
  keepDateRadioButtonRef,
  keepDayRadioButtonRef,
  neverRadioButtonRef,
  countRadioButtonRef,
  dateRadioButtonRef,
  onReady,
  onBack,
  getCleanPeriod, //-
}) {
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
                const isInvalid =
                  Number.isNaN(Number(e.target.value)) ||
                  e.target.value.trim() === '';
                setIsPeriodEveryCountInvalid(isInvalid);
                setFieldsetData((prev) => ({
                  ...prev,
                  isValid: !isInvalid,
                }));
                if (!isInvalid) {
                  setPeriodEveryCount(Number(e.target.value));
                }
              }}
              ref={autofocusRef}
            />
            <Dropdown
              noInput
              defaultValue={getUnitsByMethod(periodFieldsetData.every.method)}
              titleText="Выбрать единицу измерения частоты"
              onInput={(method) => {
                setPeriodFieldsetData((prev) => ({
                  ...prev,
                  every: {
                    method,
                    count: prev.every.count,
                    days: prev.every.days,
                    keep: prev.every.keep,
                  },
                }));
              }}
              component={Option}
              componentsParams={[
                { children: 'дн.', value: 'daily', key: 'days' },
                { children: 'нед.', value: 'weekly', key: 'weeks' },
                { children: 'мес.', value: 'monthly', key: 'months' },
                { children: 'г.', value: 'yearly', key: 'years' },
              ]}
              componentActionValueParser={getUnitsByMethod}
            />
            {periodFieldsetData.every.method === 'weekly' && (
              <div className={style['popup-reminder__days-of-the-week']}>
                {[
                  { text: 'пн', day: 1 },
                  { text: 'вт', day: 2 },
                  { text: 'ср', day: 3 },
                  { text: 'чт', day: 4 },
                  { text: 'пт', day: 5 },
                  { text: 'сб', day: 6 },
                  { text: 'вс', day: 0 },
                ].map(({ text, day }) => {
                  return (
                    <button
                      className={cn(style['popup-reminder__day-button'], {
                        [style['popup-reminder__day-button_selected']]:
                          periodFieldsetData.every.days.indexOf(day) !== -1,
                      })}
                      type="button"
                      onClick={() => {
                        setPeriodFieldsetData((prev) => {
                          const period = { ...prev };
                          period.every.days = [...period.every.days];
                          const dayIndex = period.every.days.indexOf(day);
                          if (dayIndex !== -1) {
                            period.every.days.splice(dayIndex, 1);
                          } else {
                            period.every.days.push(day);
                          }
                          return period;
                        });
                      }}
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
          onClick={({ target }) => {
            if (target === neverRadioButtonRef.current) {
              setPeriodEndType('never');
            } else if (target === countRadioButtonRef.current) {
              setPeriodEndType('count');
            } else if (target === dateRadioButtonRef.current) {
              setPeriodEndType('date');
            }
          }}
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
                onFocus={() => {
                  // eslint-disable-next-line no-param-reassign
                  countRadioButtonRef.current.checked = true;
                  setPeriodEndType('count');
                }}
                onChange={(e) => {
                  const isInvalid =
                    Number.isNaN(Number(e.target.value)) ||
                    e.target.value.trim() === '';
                  setIsPeriodEndCountInvalid(isInvalid);
                  setFieldsetData((prev) => ({
                    ...prev,
                    isValid: !isInvalid,
                  }));
                  if (!isInvalid) {
                    setPeriodEndCount(Number(e.target.value));
                  }
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
                onInput={(date, month, year) => {
                  setPeriodFieldsetData((prev) => {
                    const { date: dateObj } = prev;
                    const newDate = new Date(dateObj);
                    newDate.setFullYear(year, month, date);
                    return {
                      ...prev,
                      end: {
                        ...prev.end,
                        date: newDate,
                      },
                    };
                  });
                }}
                onFocus={() => {
                  // eslint-disable-next-line no-param-reassign
                  dateRadioButtonRef.current.checked = true;
                  setPeriodEndType('date');
                }}
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
          {getFormattedPeriod(getCleanPeriod(periodFieldsetData))}
        </div>
        <span className={style['popup-reminder__ready-button']}>
          <Button disabled={!fieldsetData.isValid} onClick={onReady}>
            Готово
          </Button>
        </span>
      </fieldset>
    </KeyboardTrap>
  );
}
