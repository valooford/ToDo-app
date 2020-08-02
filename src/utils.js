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
    tomorrowText = 'Завтра, ',
    todayText = 'Сегодня, ',
    yesterdayText = 'Вчера, ',
    timeAlways = true,
  } = {}
) {
  const currentDate = new Date();
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const tomorrow = new Date(+today + oneDayMs);
  const yesterday = new Date(today - oneDayMs);

  let formattedDate;
  let hours = date.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  const time = `${hours}:${minutes}`;
  if (date - tomorrow > 0 && date - tomorrow < oneDayMs) {
    formattedDate = `${tomorrowText}${time}`;
  } else if (date - today > 0 && date - today < oneDayMs) {
    formattedDate = `${todayText}${time}`;
  } else if (date - yesterday > 0 && date - yesterday < oneDayMs) {
    formattedDate = `${yesterdayText}${time}`;
  } else {
    formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;
    if (timeAlways) {
      formattedDate += ` ${time}`;
    }
  }

  return formattedDate;
}
