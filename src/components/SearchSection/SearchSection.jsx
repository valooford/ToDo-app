import React from 'react';
import style from './SearchSection.module.scss';

export default function SearchSection({ name, children }) {
  return (
    <div className={style.section}>
      <div className={style.name}>{name}</div>
      {children}
    </div>
  );
}
