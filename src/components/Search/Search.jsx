import React from 'react';
import style from './Search-cfg.module.scss';

// КОМПОНЕНТ ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
export default function Search({ IconButton }) {
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
