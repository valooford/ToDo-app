import React, { useState, useRef, useEffect, useCallback } from 'react';
import cn from 'classnames';

import { months, getFormattedDate } from '@/utils';

import style from './Calendar-cfg.module.scss';

const daysOfTheWeekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function Calendar({ date, onSelect }, ref) {
  const [displayedMonth, setDisplayedMonth] = useState(date);
  useEffect(() => {
    setDisplayedMonth(date);
  }, [date]);

  const selectedDateRef = useRef(null);
  const [isSelectionModeOn, setIsSelectionModeOn] = useState(false);
  useEffect(() => {
    if (isSelectionModeOn) {
      setTimeout(() => {
        selectedDateRef.current.focus();
      }, 0);
    }
  }, [date]);

  const lastDayOfTheMonth = new Date(displayedMonth);
  lastDayOfTheMonth.setMonth(displayedMonth.getMonth() + 1, 0);
  const daysCount = lastDayOfTheMonth.getDate();

  const lastDayOfPrevMonth = new Date(displayedMonth);
  lastDayOfPrevMonth.setDate(0);
  const dayOfTheWeek = lastDayOfPrevMonth.getDay(); // sunday or not
  const lastDay = lastDayOfPrevMonth.getDate();

  const daysArray = [];
  // prev month
  for (let i = lastDay - dayOfTheWeek + 1; i <= lastDay; i += 1) {
    daysArray.push(i);
  }
  // current month
  for (let i = 1; i <= daysCount; i += 1) {
    daysArray.push(i);
  }
  // next month
  for (let i = 1; daysArray.length % 7; i += 1) {
    daysArray.push(i);
  }

  const days = [];
  while (daysArray.length) {
    const week = daysArray.splice(0, 7);
    days.push(week);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // interval between displayed and today in months
  const fromTodayMonthInterval =
    displayedMonth.getMonth() -
    today.getMonth() +
    12 * (displayedMonth.getFullYear() - today.getFullYear());
  // interval between displayed and selected in months
  const fromSelectedDateMonthInterval =
    displayedMonth.getMonth() -
    date.getMonth() +
    12 * (displayedMonth.getFullYear() - date.getFullYear());

  let monthCounter = -1; // from -1 (prev) to 1 (next) months
  // displaying days from today and so on
  let presentFlag =
    fromTodayMonthInterval > 1 ||
    (fromTodayMonthInterval === 1 && today.getDate() < days[0][0]);

  const tbodyRef = useRef(null);
  const tbodyFocusHandler = useCallback(
    (e) => {
      if (!e.target.classList.contains(style['calendar__date-button'])) return;
      if (!isSelectionModeOn) setIsSelectionModeOn(true);
    },
    [displayedMonth]
  );
  useEffect(() => {
    tbodyRef.current.addEventListener('focusin', tbodyFocusHandler);
    return () => {
      tbodyRef.current.removeEventListener('focusin', tbodyFocusHandler);
    };
  }, [displayedMonth]);

  const captionRef = ref || React.createRef();
  const firstDayOfTheMonthRef = useRef(null);

  return (
    <span className={style.calendar}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <table
        className={style.calendar__days}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      >
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <caption
          className={style.calendar__caption}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onKeyDown={(e) => {
            switch (e.keyCode) {
              // arrow left
              case 37:
                e.stopPropagation();
                setDisplayedMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
                );
                break;
              // arrow right
              case 39:
                e.stopPropagation();
                setDisplayedMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
                );
                break;
              // arrow up or down
              case 38:
              case 40:
                e.stopPropagation();
                if (selectedDateRef.current) {
                  selectedDateRef.current.focus();
                  setIsSelectionModeOn(true);
                } else if (fromTodayMonthInterval === 0) {
                  onSelect(
                    getFormattedDate(today, {
                      noDetails: true,
                      includeYear: true,
                      noTime: true,
                    }),
                    true
                  );
                  setIsSelectionModeOn(true);
                } else if (fromTodayMonthInterval > 0) {
                  onSelect(
                    getFormattedDate(displayedMonth, {
                      noDetails: true,
                      includeYear: true,
                      noTime: true,
                    }),
                    true
                  );
                  setIsSelectionModeOn(true);
                }
                break;
              default:
                break;
            }
          }}
          ref={captionRef}
        >
          <button
            type="button"
            className={style['calendar__prev-button']}
            onClick={() => {
              setDisplayedMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
              );
            }}
          >
            &#xe821;
          </button>
          {`${
            months[displayedMonth.getMonth()]
          } ${displayedMonth.getFullYear()} г.`}
          <button
            type="button"
            className={style['calendar__next-button']}
            onClick={() => {
              setDisplayedMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
              );
            }}
          >
            &#xe806;
          </button>
        </caption>
        <thead>
          <tr>
            {daysOfTheWeekNames.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
        <tbody
          onClick={(e) => {
            if (!e.target.classList.contains(style['calendar__date-button']))
              return;
            const newDate = new Date(
              displayedMonth.getFullYear(),
              displayedMonth.getMonth()
            );
            if (
              e.target.classList.contains(
                style['calendar__date-button_prev-month']
              )
            ) {
              newDate.setMonth(displayedMonth.getMonth() - 1);
            } else if (
              e.target.classList.contains(
                style['calendar__date-button_next-month']
              )
            ) {
              newDate.setMonth(displayedMonth.getMonth() + 1);
            }
            newDate.setDate(e.target.innerText);
            onSelect(
              getFormattedDate(newDate, {
                noDetails: true,
                includeYear: true,
                noTime: true,
              })
            );
          }}
          onKeyDown={(e) => {
            switch (e.keyCode) {
              // Tab
              case 9:
                e.preventDefault();
                e.stopPropagation();
                setIsSelectionModeOn(false);
                captionRef.current.focus();
                break;
              default:
                // arrows
                if (e.keyCode >= 37 && e.keyCode <= 40) {
                  e.stopPropagation();
                  let shift;
                  switch (e.keyCode) {
                    case 37:
                      shift = -1; // left
                      break;
                    case 38:
                      shift = -7; // up
                      break;
                    case 39:
                      shift = 1; // right
                      break;
                    case 40:
                      shift = 7; // down
                      break;
                    default:
                  }
                  const newDate = new Date(date);
                  newDate.setDate(date.getDate() + shift);
                  if (newDate - today < 0) break;
                  onSelect(
                    getFormattedDate(newDate, {
                      noDetails: true,
                      includeYear: true,
                      noTime: true,
                    }),
                    true
                  );
                }
                break;
            }
          }}
          ref={tbodyRef}
        >
          {days.map((week) => {
            return (
              <tr key={week.join('')}>
                {week.map((day) => {
                  // check for displaying next month
                  if (day === 1) {
                    monthCounter += 1;
                  }
                  // check for nowadays
                  if (
                    !presentFlag &&
                    monthCounter === fromTodayMonthInterval &&
                    day === today.getDate()
                  ) {
                    presentFlag = true;
                  }
                  let buttonRef = null;
                  if (
                    monthCounter === -fromSelectedDateMonthInterval &&
                    day === date.getDate()
                  ) {
                    buttonRef = selectedDateRef;
                  } else if (day === 1 && monthCounter === 0) {
                    buttonRef = firstDayOfTheMonthRef;
                  }
                  return (
                    <td key={day}>
                      <button
                        type="button"
                        className={cn(style['calendar__date-button'], {
                          [style['calendar__date-button_prev-month']]:
                            monthCounter === -1,
                          [style['calendar__date-button_next-month']]:
                            monthCounter === 1,
                          [style['calendar__date-button_today']]:
                            monthCounter === -fromTodayMonthInterval &&
                            day === today.getDate(),
                          [style['calendar__date-button_selected']]:
                            monthCounter === -fromSelectedDateMonthInterval &&
                            day === date.getDate(),
                        })}
                        disabled={!presentFlag}
                        ref={buttonRef}
                      >
                        {day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </span>
  );
}

export default React.forwardRef(Calendar);
