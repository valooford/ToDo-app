import './Search-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// КОМПОНЕНТ ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
export default function Search() {
  return (
    <span className="search">
      <i className="search__icon">
        <IconButton iconSymbol="&#xe814;" titleText="Поиск" />
      </i>
      <input type="text" placeholder="Поиск" />
      <i className="search__clean">
        <IconButton
          iconSymbol="&#xe80c;"
          titleText="Удалить поисковый запрос"
        />
      </i>
    </span>
  );
}
