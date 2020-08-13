/* eslint-disable import/prefer-default-export */

import { useEffect, useState, useCallback } from 'react';

/* handleClickOutside function are used to detect click inside an element
 * when its child is clicked and then removed
 * it's not considered as a part of element anymore
 * so using Element.closest() or Node.contains() makes no sense
 */
export function useEffectOnClickOutside(onClickOutside, dependencies) {
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
      document.removeEventListener('click', globalClickListener);
    } else {
      setIsTouched(false); // isTouched reset
    }
  }, [globalClick]);
  // setting globalClickListener by condition
  useEffect(() => {
    if (!startCondition) return undefined;
    setTimeout(() => {
      document.addEventListener('click', globalClickListener);
    }, 0);
    return () => {
      document.removeEventListener('click', globalClickListener);
    };
  }, dependencies);
  // return callback to pass to the element
  return () => {
    setIsTouched(true);
  };
}

const oneDayMs = 8.64e7;
const months = [
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
    formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;
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
      formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;
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
    `^(\\d?\\d)\\s*(${months.join('|')})\\s*(\\d{4})\\s*г\\.$`,
    'u'
  );
  const dateMatch = str.match(dateRegexp);
  if (dateMatch) {
    const [, date, monthName, year] = dateMatch;
    const month = months.indexOf(monthName);

    const testingDate = new Date(year, month, date);
    // that date doesn't exist in that month (i.e. 30 feb.)
    if (testingDate.getDate() !== +date) return null;

    return { date, month, year, type: 'date', dateObj: testingDate };
  }
  return null;
}

/*
period: {
  every: 365,
  end: {
    count: 2,
    // or
    date: new Date(2022, 7, 1),
  },
}, 
*/

export function getFormattedPeriod(period) {
  if (!period) return 'Не повторять';
  switch (period.every) {
    case 1:
      return 'Каждый день';
    case 7:
      return 'Каждую неделю';
    case 28:
      return 'Каждый месяц';
    case 365:
      return 'Каждый год';
    default:
      return `Каждые ${period.every} дня`;
    // return 'Другое';
  }
}
