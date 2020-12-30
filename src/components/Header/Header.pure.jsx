import React from 'react';

import IconButton from '@components/IconButton/IconButton.titled';
import Search from '@components/Search/Search.container';

import style from './Header-cfg.module.scss';

export default function Header({ buttonsParams, onMenuButtonClick }) {
  return (
    <div className={style.header}>
      <IconButton
        iconSymbol="&#xf0c9;"
        titleText="Главное меню"
        modificators="icon-button_bigger"
        onClick={onMenuButtonClick}
      />
      <span className={style.header__logo}>
        <i>&#xe80d;</i>
        ToDo
      </span>
      <span className={style.header__search}>
        <Search IconButton={IconButton} />
      </span>
      <span className={style.header__buttons}>
        {buttonsParams.map((params) => (
          <IconButton
            iconSymbol={params.iconSymbol}
            titleText={params.titleText}
            modificators={params.modificators}
            key={params.titleText}
          />
        ))}
      </span>
    </div>
  );
}
