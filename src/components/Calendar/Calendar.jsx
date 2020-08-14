import React, { useState } from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import { months, getFormattedDate } from '@/utils';
/* eslint-enable import/no-unresolved */

import style from './Calendar-cfg.module.scss';

const daysOfTheWeekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function Calendar({ date, onSelect }, ref) {
  const [displayedMonth, setDisplayedMonth] = useState(date);

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

  return (
    <span className={style.calendar}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <table className={style.calendar__days} tabIndex={0} ref={ref}>
        <caption className={style.calendar__caption}>
          <button
            type="button"
            className={style['calendar__prev-button']}
            onClick={() => {
              setDisplayedMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
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
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
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
