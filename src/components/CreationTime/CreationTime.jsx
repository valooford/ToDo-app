import React from 'react';
/* eslint-disable import/no-unresolved */
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */
import style from './CreationTime-cfg.module.scss';

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

function getFormattedDate(date) {
  const currentDate = new Date();
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const yesterday = new Date(today - oneDayMs);

  let formattedDate;
  let hours = date.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  if (today - date <= 0) {
    formattedDate = `${hours}:${minutes}`;
  } else if (yesterday - date <= 0) {
    formattedDate = `вчера в ${hours}:${minutes}`;
  } else {
    formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;
  }

  return formattedDate;
}

// КОМПОНЕНТ ВРЕМЕНИ СОЗДАНИЯ / CREATION-TIME
// *
export default function CreationTime({ creationDate, editingDate }) {
  return (
    <span className={style['creation-time']}>
      {`Изменено: ${getFormattedDate(editingDate)}`}
      <br />
      <span className={style['creation-time__title']}>
        <Title text={`Создано: ${getFormattedDate(creationDate)}`} />
      </span>
    </span>
  );
}
