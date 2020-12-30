import React from 'react';

import Header from './Header.pure';

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

export default function HeaderContainer({ onMenuButtonClick }) {
  return (
    <Header
      buttonsParams={buttonsParams}
      onMenuButtonClick={onMenuButtonClick}
    />
  );
}
