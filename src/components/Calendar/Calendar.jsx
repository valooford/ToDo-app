import React from 'react';

import style from './Calendar-cfg.module.scss';

const daysOfTheWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const month = [
  [29, 30, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 1, 2],
];

export default function Calendar() {
  return (
    <span className={style.calendar}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <table className={style.calendar__days} tabIndex={0}>
        <caption className={style.calendar__caption}>
          <button type="button" className={style['calendar__prev-button']}>
            &#xe821;
          </button>
          июль 2020 г.
          <button type="button" className={style['calendar__next-button']}>
            &#xe806;
          </button>
        </caption>
        <thead>
          <tr>
            {daysOfTheWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {month.map((week) => (
            <tr>
              {week.map((day) => (
                <td>
                  <button type="button">{day}</button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </span>
  );
}
