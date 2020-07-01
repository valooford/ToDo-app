import './CreationTime-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

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

export default function CreationTime(creationDate, editingDate) {
  return setupBuilder('template-creation-time')({
    '.creation-time': {
      prepend: `Изменено: ${getFormattedDate(editingDate)}`,
    },
    '.creation-time__title': {
      append: Title(`Создано: ${getFormattedDate(creationDate)}`),
    },
  });
}
