import React from 'react';

import IconButtonComponent from '@components/IconButton/IconButton';
import Search from '@components/Search/Search.container';

import style from './Header-cfg.module.scss';

const buttonsParams = [
  {
    iconSymbol: '\ue815',
    titleText: 'Обновить',
    modificators: 'icon-button_bigger',
  },
  {
    iconSymbol: '\ue819',
    titleText: 'Сетка',
    modificators: 'icon-button_bigger',
  },
  {
    iconSymbol: '\ue818',
    titleText: 'Настройки',
    modificators: 'icon-button_bigger',
  },
  {
    iconSymbol: '\ue816',
    titleText: 'Приложения Google',
  },
  {
    iconSymbol: 'V',
    titleText: 'Аккаунт Google',
  },
];

// КОМПОНЕНТ ШАПКИ / HEADER
// *
export default function Header({
  onMenuButtonClick,
  IconButton = IconButtonComponent,
}) {
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
