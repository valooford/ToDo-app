import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './Search-cfg.module.scss';

// КОМПОНЕНТ ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
export default function Search() {
  return (
    <span className={style.search}>
      <i className={style.search__icon}>
        <IconButton iconSymbol="&#xe814;" titleText="Поиск" />
      </i>
      <input type="text" placeholder="Поиск" />
      <i className={style.search__clean}>
        <IconButton
          iconSymbol="&#xe80c;"
          titleText="Удалить поисковый запрос"
        />
      </i>
    </span>
  );
}
