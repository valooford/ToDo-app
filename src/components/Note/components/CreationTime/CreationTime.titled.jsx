import React from 'react';
/* eslint-disable import/no-unresolved */
import { getFormattedDate } from '@/utils';
import { withTitle } from '@components/Title/Title.container';
/* eslint-enable import/no-unresolved */
import CreationTime from './CreationTime';

const CreationTimeTitled = withTitle(CreationTime);

export default function CreationTimeContainer({
  creationDate,
  editingDate,
  extraText,
}) {
  const dateFormanCfg = {
    todayText: '',
    yesterdayText: 'вчера в ',
    noTime: true,
  };
  const formattedCreationDate = getFormattedDate(creationDate, dateFormanCfg);
  const formattedEditingDate = getFormattedDate(editingDate, dateFormanCfg);
  const text = `${
    extraText ? `${extraText} • ` : ''
  }Изменено: ${formattedEditingDate}`;
  const titleText = `Создано: ${formattedCreationDate}`;
  return <CreationTimeTitled text={text} titleText={titleText} />;
}
