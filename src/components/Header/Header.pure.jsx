import React from 'react';

import IconButton from '@components/IconButton/IconButton.titled';
import Search from '@components/Search/Search';

import style from './Header-cfg.module.scss';

export default function Header({
  pageName = 'ToDo',
  buttonsParams,
  onMenuButtonClick,
}) {
  return (
    <div className={style.header}>
      <span className={style.pageNameWrapper}>
        <IconButton
          iconSymbol="&#xf0c9;"
          titleText="Главное меню"
          modificators="icon-button_bigger"
          onClick={onMenuButtonClick}
        />
        <span className={style.pageName}>
          {pageName === 'ToDo' && <i className={style.icon}>&#xe80d;</i>}
          {pageName}
        </span>
      </span>
      <span className={style.buttons}>
        {buttonsParams.map((params) => (
          <IconButton
            iconSymbol={params.iconSymbol}
            titleText={params.titleText}
            modificators={params.modificators}
            key={params.titleText}
          />
        ))}
      </span>
      <div className={style.search}>
        <Search />
      </div>
    </div>
  );
}
