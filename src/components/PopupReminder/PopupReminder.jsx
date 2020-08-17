import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import {
  getFormattedDate,
  getFormattedPeriod,
  getDateParamsFromString,
  isTimePassed,
} from '@/utils';

import Button from '@components/Button/Button';
import IconButton from '@components/IconButton/IconButton';
import Option from '@components/Option/Option';
import LocationOption from '@components/LocationOption/LocationOption';
import Dropdown from '@components/Dropdown/Dropdown';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
import Calendar from '@components/Calendar/Calendar';
/* eslint-enable import/no-unresolved */
import style from './PopupReminder-cfg.module.scss';

function handleEscWith(cb) {
  return (e) => {
    e.stopPropagation(); // prevent other event listeners from triggering
    if (e.keyCode === 27) cb();
  };
}

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ НАСТРОЙКИ НАПОМИНАНИЙ / POPUP-REMINDER
// *
export default function PopupReminder({
  onMouseDown,
  onClose,
  onKeyDown,
  reminderDate,
  setDate,
  reminderPlace,
  setPlace,
  reminderPeriod,
  findPlacesByQuery,
  foundPlaces = [],
  resetFoundPlaces,
}) {
  useEffect(() => {
    return () => {
      resetFoundPlaces();
    };
  }, []);

  let initialFieldset;
  if (reminderDate) {
    initialFieldset = 'date';
  } else if (reminderPlace != null) {
    initialFieldset = 'place';
  } else {
    initialFieldset = 'main';
  }
  const [currentFieldset, setCurrentFieldset] = useState(initialFieldset);

  const switchToMainOnEsc = handleEscWith(() => setCurrentFieldset('main'));
  const switchToDateOnEsc = handleEscWith(() => setCurrentFieldset('date'));
  // autofocus
  // *
  const autofocusRef = useRef(null);
  useEffect(() => {
    if (autofocusRef.current) {
      autofocusRef.current.focus();
    }
  }, [currentFieldset]);
  // *

  const [fieldsetData, setFieldsetData] = useState({
    date: reminderDate,
    period: reminderPeriod,
    place: reminderPlace,
    isValid: true,
  });
  useEffect(() => {
    let date;
    if (!reminderDate) {
      const currentDate = new Date();
      let hours = Math.ceil(currentDate.getHours()) + 1;
      if (currentDate.getMinutes() > 30) {
        hours += 1;
      }
      date = new Date(currentDate);
      date.setHours(hours, 0, 0, 0);
    } else {
      date = reminderDate;
    }
    setFieldsetData((prev) => ({
      ...prev,
      date,
      isValid: true,
    }));
  }, [currentFieldset]);

  const [periodFieldsetData, setPeriodFieldsetData] = useState({
    every: { method: 'daily', count: 1, days: [], keep: 'date' },
    end: { type: 'never', count: 2 },
  });
  useEffect(() => {
    const period = {
      every: { method: 'daily', count: 1, days: [], keep: 'date' },
      end: { type: 'never', count: 2 },
    };
    if (fieldsetData.period) {
      // period = { ...period, ...fieldsetData.period };
      let { every } = fieldsetData.period;
      if (typeof every === 'number') {
        every = { method: 'daily', count: period.every };
      } else if (typeof every === 'string') {
        let method;
        if (every === 'day') method = 'daily';
        else if (every === 'week') method = 'weekly';
        else if (every === 'month') method = 'monthly';
        else if (every === 'year') method = 'yearly';
        every = { method, count: 1 };
      }
      period.every = { ...period.every, ...every };
      if (fieldsetData.period.end)
        period.end = {
          ...fieldsetData.period.end,
          type: fieldsetData.period.end.count ? 'count' : 'date',
        };
    }
    if (!period.end.date) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      period.end.date = endDate;
    }
    setPeriodFieldsetData(period);
  }, [fieldsetData.period]);

  const setPeriodEveryKeep = (keep) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.every.keep = keep;
      return period;
    });
  };
  const setPeriodEveryCount = (count) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.every.count = count;
      return period;
    });
  };
  const setPeriodEndCount = (count) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.end.count = count;
      return period;
    });
  };
  const setPeriodEndType = (type) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.end.type = type;
      return period;
    });
  };

  const now = new Date();
  let optionParams;
  const fieldset = {};
  const setTimeRef = useRef(null);
  const setPeriodRef = useRef(null);
  const readyButtonRef = useRef(null);

  const neverRadioButtonRef = useRef(null);
  const countRadioButtonRef = useRef(null);
  const dateRadioButtonRef = useRef(null);
  useEffect(() => {
    if (currentFieldset === 'period') {
      if (periodFieldsetData.end.type === 'never')
        neverRadioButtonRef.current.checked = true;
      else if (periodFieldsetData.end.type === 'count')
        countRadioButtonRef.current.checked = true;
      else if (periodFieldsetData.end.type === 'date')
        dateRadioButtonRef.current.checked = true;
    }
  }, [currentFieldset]);
  const keepDateRadioButtonRef = useRef(null);
  const keepDayRadioButtonRef = useRef(null);
  useEffect(() => {
    if (currentFieldset !== 'period') return;
    if (periodFieldsetData.every.method !== 'monthly') return;
    const { keep } = periodFieldsetData.every;
    if (keep === 'date') {
      keepDateRadioButtonRef.current.checked = true;
    } else if (keep === 'day') {
      keepDayRadioButtonRef.current.checked = true;
    }
  }, [currentFieldset, periodFieldsetData.every.method]);

  const dateValidator = (date) => {
    const dateParams = getDateParamsFromString(date);
    if (dateParams && dateParams.type === 'date') {
      const { type, dateObj, ...params } = dateParams;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // past days ↓
      if (dateObj - today >= 0) {
        setFieldsetData((prev) => ({ ...prev, isValid: true }));
        return Object.values(params);
      }
    }
    setFieldsetData((prev) => ({ ...prev, isValid: false }));
    return false;
  };

  const [isPeriodEveryCountInvalid, setIsPeriodEveryCountInvalid] = useState(
    false
  );
  const [isPeriodEndCountInvalid, setIsPeriodEndCountInvalid] = useState(false);

  const getCleanPeriod = (period) => {
    const cleanPeriod = { every: { ...period.every }, end: { ...period.end } };
    const { method } = cleanPeriod.every;
    if (method === 'daily' || method === 'yearly') {
      delete cleanPeriod.every.days;
      delete cleanPeriod.every.keep;
    } else if (method === 'weekly') {
      delete cleanPeriod.every.keep;
    } else if (method === 'monthly') {
      delete cleanPeriod.every.days;
    }
    const { type } = cleanPeriod.end;
    delete cleanPeriod.end.type;
    if (type === 'never') {
      delete cleanPeriod.end;
    } else if (type === 'count') {
      delete cleanPeriod.end.date;
    } else if (type === 'date') {
      delete cleanPeriod.end.count;
    }
    return cleanPeriod;
  };

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

  switch (currentFieldset) {
    case 'main':
      optionParams = [
        {
          details: '20:00',
          text: 'Сегодня',
          disabled: now.getHours() >= 20,
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
          onClick() {
            setCurrentFieldset('date');
          },
        },
        {
          iconSymbol: '\ue80a',
          text: 'Выбрать место',
          onClick() {
            setCurrentFieldset('place');
          },
        },
      ];
      fieldset.content = (
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
                >
                  {params.text}
                </Option>
              ))}
            </div>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = onKeyDown;
      break;
    case 'date':
      fieldset.content = (
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
                  onClick={() => {
                    setCurrentFieldset('main');
                  }}
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
                onInput={(date, month, year) => {
                  setFieldsetData((prev) => {
                    const { date: dateObj } = prev;
                    const newDate = new Date(dateObj);
                    newDate.setFullYear(year, month, date);
                    return {
                      ...prev,
                      date: newDate,
                    };
                  });
                }}
                component={Calendar}
                componentsParams={[
                  { date: fieldsetData.date, key: 'calendar' },
                ]}
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
                validate={(time) => {
                  const dateParams = getDateParamsFromString(time);
                  if (dateParams && dateParams.type === 'time') {
                    const { type, ...params } = dateParams;
                    if (
                      isTimePassed(fieldsetData.date, ...Object.values(params))
                    ) {
                      setFieldsetData((prev) => ({ ...prev, isValid: false }));
                      return false;
                    }
                    setFieldsetData((prev) => ({ ...prev, isValid: true }));
                    return Object.values(params);
                  }
                  setFieldsetData((prev) => ({ ...prev, isValid: false }));
                  return false;
                }}
                initialValidationDependencies={[fieldsetData.date]}
                onInput={(hours, minutes) => {
                  setFieldsetData((prev) => {
                    const { date } = prev;
                    const newDate = new Date(date);
                    newDate.setHours(hours, minutes);
                    return {
                      ...prev,
                      date: newDate,
                    };
                  });
                }}
                component={Option}
                componentsParams={[
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
                ]}
                extraordinaryFocusRef={setTimeRef}
                ref={setTimeRef}
              />
              <Dropdown
                noInput
                defaultValue={getFormattedPeriod(fieldsetData.period)}
                titleText="Выбрать частоту"
                onInput={(period) => {
                  setFieldsetData((prev) => ({
                    ...prev,
                    period,
                  }));
                }}
                component={Option}
                componentsParams={[
                  { children: 'Не повторять', key: 'no period' },
                  {
                    children: 'Каждый день',
                    value: { every: 'day' },
                    key: 'daily',
                  },
                  {
                    children: 'Каждую неделю',
                    value: { every: 'week' },
                    key: 'weekly',
                  },
                  {
                    children: 'Каждый месяц',
                    value: { every: 'month' },
                    key: 'monthly',
                  },
                  {
                    children: 'Каждый год',
                    value: { every: 'year' },
                    key: 'yearly',
                  },
                  {
                    children: 'Другое',
                    key: 'other',
                    onClick() {
                      setCurrentFieldset('period');
                    },
                  },
                ]}
                componentActionValueParser={getFormattedPeriod}
                extraordinaryFocusRef={setPeriodRef}
                ref={setPeriodRef}
              />
            </div>
            <span className={style['popup-reminder__ready-button']}>
              <Button
                disabled={!fieldsetData.isValid}
                onClick={() => {
                  setDate(fieldsetData.date, fieldsetData.period);
                  onClose();
                  resetFoundPlaces();
                }}
              >
                Сохранить
              </Button>
            </span>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = switchToMainOnEsc;
      break;
    case 'place':
      fieldset.content = (
        <KeyboardTrap key="place">
          <fieldset className={style['popup-reminder__place']}>
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
                  onClick={() => {
                    setCurrentFieldset('main');
                    resetFoundPlaces();
                  }}
                />
              </span>
              Выбрать место
            </legend>
            <div className={style['popup-reminder__fields']}>
              <Dropdown
                useAsSearch
                defaultValue={fieldsetData.place}
                placeholder="Укажите место"
                onInput={(place) => {
                  setFieldsetData({ place });
                  findPlacesByQuery(place);
                }}
                ref={autofocusRef}
                component={LocationOption}
                componentsParams={foundPlaces}
                extraordinaryFocusRef={readyButtonRef}
              />
            </div>
            <span className={style['popup-reminder__ready-button']}>
              <Button
                disabled={!fieldsetData.place}
                onClick={() => {
                  setPlace(fieldsetData.place);
                  onClose();
                  resetFoundPlaces();
                }}
                ref={readyButtonRef}
              >
                Сохранить
              </Button>
            </span>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = switchToMainOnEsc;
      break;
    case 'period':
      fieldset.content = (
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
                  onClick={() => {
                    setCurrentFieldset('date');
                  }}
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
                  defaultValue={getUnitsByMethod(
                    periodFieldsetData.every.method
                  )}
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
                    className={
                      style['popup-reminder__every-keep-radio-buttons']
                    }
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
                    defaultValue={getFormattedDate(
                      periodFieldsetData.end.date,
                      {
                        noDetails: true,
                        includeYear: true,
                        noTime: true,
                      }
                    )}
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
              <Button
                disabled={!fieldsetData.isValid}
                onClick={() => {
                  setFieldsetData((prev) => ({
                    ...prev,
                    period: getCleanPeriod(periodFieldsetData),
                  }));
                  setCurrentFieldset('date');
                }}
              >
                Готово
              </Button>
            </span>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = switchToDateOnEsc;
      break;
    default:
      return null;
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <fieldset
      className={style['popup-reminder']}
      onMouseDown={onMouseDown}
      onKeyDown={fieldset.onKeyDown}
    >
      {fieldset.content}
    </fieldset>
  );
}
