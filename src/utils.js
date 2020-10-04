/* eslint-disable import/prefer-default-export */

import { useEffect, useState, useCallback } from 'react';

/* handleClickOutside function are used to detect click inside an element
 * when its child is clicked and then removed
 * it's not considered as a part of element anymore
 * so using Element.closest() or Node.contains() makes no sense
 */
export function useEffectOnMouseDownOutside(onClickOutside, dependencies) {
  const [startCondition = true] = dependencies;
  // click inside
  const [isTouched, setIsTouched] = useState(null);
  // handled by global handler
  const [globalClick, setGlobalClick] = useState(null);
  // function negates globalClick value
  const globalClickListener = useCallback(() => {
    setGlobalClick((prev) => !prev);
  }, []);
  // catching clicks outside
  useEffect(() => {
    if (globalClick === null) return; // return if globalClick is initial
    if (!isTouched) {
      onClickOutside();
      document.removeEventListener('mousedown', globalClickListener);
    } else {
      setIsTouched(false); // isTouched reset
    }
  }, [globalClick]);
  // setting globalClickListener by condition
  useEffect(() => {
    if (!startCondition) return undefined;
    setTimeout(() => {
      document.addEventListener('mousedown', globalClickListener);
    }, 0);
    return () => {
      document.removeEventListener('mousedown', globalClickListener);
    };
  }, dependencies);
  // return callback to pass to the element
  return () => {
    setIsTouched(true);
  };
}

const oneDayMs = 8.64e7;
export const months = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];
const monthsAbbreviated = [
  'янв.',
  'фев.',
  'мар.',
  'апр.',
  'мая',
  'июн.',
  'июл.',
  'авг.',
  'сен.',
  'окт.',
  'ноя.',
  'дек.',
];
export function getFormattedDate(
  date,
  {
    timeOnly = false,
    noDetails = false,
    noTime = false,
    includeYear = false,
    tomorrowText = 'Завтра, ',
    todayText = 'Сегодня, ',
    yesterdayText = 'Вчера, ',
  } = {}
) {
  let formattedDate;
  let hours = date.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  const time = `${hours}:${minutes}`;
  if (timeOnly) {
    formattedDate = time;
  } else if (noDetails) {
    formattedDate = `${date.getDate()} ${monthsAbbreviated[date.getMonth()]}`;
    if (includeYear) {
      formattedDate += ` ${date.getFullYear()} г.`;
    }
    if (!noTime) {
      formattedDate += ` ${time}`;
    }
  } else {
    const currentDate = new Date();
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const tomorrow = new Date(+today + oneDayMs);
    const yesterday = new Date(today - oneDayMs);

    if (date - tomorrow > 0 && date - tomorrow < oneDayMs) {
      formattedDate = `${tomorrowText}${time}`;
    } else if (date - today > 0 && date - today < oneDayMs) {
      formattedDate = `${todayText}${time}`;
    } else if (date - yesterday > 0 && date - yesterday < oneDayMs) {
      formattedDate = `${yesterdayText}${time}`;
    } else {
      formattedDate = `${date.getDate()} ${monthsAbbreviated[date.getMonth()]}`;
      if (includeYear) {
        formattedDate += ` ${date.getFullYear()} г.`;
      }
      if (!noTime) {
        formattedDate += ` ${time}`;
      }
    }
  }

  return formattedDate;
}

export function getDateParamsFromString(str) {
  const timeMatch = str.match(/^([0,1]?\d|2[0-3]):([0-5]\d)$/);
  if (timeMatch) {
    const [, hours, minutes] = timeMatch;
    return { hours, minutes, type: 'time' };
  }
  const dateRegexp = new RegExp(
    `^(\\d?\\d)\\s*(${monthsAbbreviated.join('|')})\\s*(\\d{4})\\s*г\\.$`,
    'u'
  );
  const dateMatch = str.match(dateRegexp);
  if (dateMatch) {
    const [, date, monthName, year] = dateMatch;
    const month = monthsAbbreviated.indexOf(monthName);

    const testingDate = new Date(year, month, date);
    // that date doesn't exist in that month (i.e. 30 feb.)
    if (testingDate.getDate() !== +date) return null;

    return { date, month, year, type: 'date', dateObj: testingDate };
  }
  return null;
}

const daysOfTheWeek = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
];

/*
period: {
  every: 1,
  or
  every: 'day',
  or
  every: {
    method: 'daily',
    count: 1,
    or
    method: 'weekly',
    count: 1,
    days: [0..6],
    or
    method: 'monthly',
    count: 1,
    keep: 'date' or 'day',
    or
    method: 'yearly',
    count: 1,
  }
  end: undefined,
  or
  end: {
    count: 2,
    // or
    date: new Date(2022, 7, 1),
  },
}, 
*/

export function getPeriodString(period) {
  let formattedPeriod;
  if (!period || !period.every) return 'Не повторять';
  const { every, end } = period;
  switch (every) {
    case 'day':
      formattedPeriod = 'Каждый день';
      break;
    case 'week':
      formattedPeriod = 'Каждую неделю';
      break;
    case 'month':
      formattedPeriod = 'Каждый месяц';
      break;
    case 'year':
      formattedPeriod = 'Каждый год';
      break;
    default:
      if (typeof every === 'number') {
        if (every === 1) {
          formattedPeriod = `Повторяется каждый день`;
        } else {
          formattedPeriod = `Повторяется раз в ${every} дня`;
        }
      } else {
        const { method, count } = every;
        if (method === 'daily') {
          if (count === 1) {
            formattedPeriod = `Повторяется каждый день`;
          } else {
            formattedPeriod = `Повторяется раз в ${count} дня`;
          }
        } else if (method === 'weekly') {
          if (count === 1) {
            formattedPeriod = `Повторяется каждую неделю`;
          } else {
            formattedPeriod = `Повторяется раз в ${count} недели`;
          }
          if (every.days.length) {
            const days = [...every.days].sort().map((i) => daysOfTheWeek[i]);
            if (days.length > 1)
              days[days.length - 1] = ` и ${days[days.length - 1]}`;
            formattedPeriod += ` (${
              days.slice(0, -1).join(', ') + days.slice(-1)
            })`;
          }
        } else if (method === 'monthly') {
          if (count === 1) {
            formattedPeriod = `Повторяется каждый месяц`;
          } else {
            formattedPeriod = `Повторяется раз в ${count} месяца`;
          }
          const { keep } = every;
          if (keep === 'date') {
            formattedPeriod += ` (в один и тот же день)`;
          } else if (keep === 'day') {
            formattedPeriod += ` (в тот же день недели месяца)`;
          }
        } else if (method === 'yearly') {
          if (count === 1) {
            formattedPeriod = `Повторяется ежегодно`;
          } else {
            formattedPeriod = `Повторяется раз в ${count} года`;
          }
        }

        if (end) {
          if (end.count) {
            formattedPeriod += `. Повторов: ${end.count}.`;
          } else if (end.date) {
            formattedPeriod += `. Повтор до ${getFormattedDate(end.date, {
              noDetails: true,
              includeYear: true,
              noTime: true,
            })}.`;
          }
        }
      }
  }
  return formattedPeriod;
}

export function isTimePassed(date, hours, minutes = 0) {
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes);
  return combinedDate - Date.now() < 0;
}

export function associativeArrToArr(arr) {
  if (typeof arr === 'object') {
    return Object.keys(arr).filter((el) => el !== 'length');
  }
  return [arr];
}
