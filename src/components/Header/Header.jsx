import './Header-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import Search from '@components/Search/Search';
/* eslint-enable import/no-unresolved */

const headerButtonParams = {
  iconSymbol: '\uf0c9',
  titleText: 'Главное меню',
  modificators: 'icon-button_bigger',
};
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
export default function Header() {
  return (
    <div className="header">
      <IconButton
        iconSymbol={headerButtonParams.iconSymbol}
        titleText={headerButtonParams.titleText}
        modificators={headerButtonParams.modificators}
      />
      <span className="header__logo">
        <i>&#xe80d;</i>
        ToDo
      </span>
      <span className="header__search">
        <Search />
      </span>
      <span className="header__buttons">
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