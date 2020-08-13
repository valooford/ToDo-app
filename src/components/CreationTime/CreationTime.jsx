import React from 'react';
/* eslint-disable import/no-unresolved */
import { getFormattedDate } from '@/utils';

import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */
import style from './CreationTime-cfg.module.scss';

// КОМПОНЕНТ ВРЕМЕНИ СОЗДАНИЯ / CREATION-TIME
// *
export default function CreationTime({ creationDate, editingDate }) {
  const dateFormanCfg = {
    todayText: '',
    yesterdayText: 'вчера в ',
    noTime: true,
  };
  const formattedCreationDate = getFormattedDate(creationDate, dateFormanCfg);
  const formattedEditingDate = getFormattedDate(editingDate, dateFormanCfg);
  return (
    <span className={style['creation-time']}>
      {`Изменено: ${formattedEditingDate}`}
      <br />
      <span className={style['creation-time__title']}>
        <Title text={`Создано: ${formattedCreationDate}`} />
      </span>
    </span>
  );
}
