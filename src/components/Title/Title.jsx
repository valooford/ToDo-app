import React from 'react';
import style from './Title-cfg.module.scss';

// КОМПОНЕНТ ОКНА С ПОДСКАЗКОЙ / TITLE
// *
export default function Title({ text }) {
  return <div className={style.title}>{text}</div>;
}
