import React from 'react';
import { connect } from 'react-redux';

import Header from './Header.pure';

const pageNames = {
  '/home': 'ToDo',
  '/reminders': 'Напоминания',
  '/archive': 'Архив',
  '/trash': 'Корзина',
};

const buttonsParams = {
  update: {
    iconSymbol: '\ue815',
    titleText: 'Обновить',
    modificators: 'icon-button_bigger',
  },
  view: {
    iconSymbol: '\ue819',
    titleText: 'Сетка',
    modificators: 'icon-button_bigger',
  },
  settings: {
    iconSymbol: '\ue818',
    titleText: 'Настройки',
    modificators: 'icon-button_bigger',
  },
  more: {
    iconSymbol: '\ue816',
    titleText: 'Приложения Google',
  },
  account: {
    iconSymbol: 'V',
    titleText: 'Аккаунт Google',
  },
};

function HeaderContainer({ page, onMenuButtonClick }) {
  const pageName = page
    ? pageNames[page] || /.*\/(.+)$/.exec(page)[1]
    : undefined;
  const buttonsWithHandlersParams = { ...buttonsParams };
  return (
    <Header
      pageName={pageName}
      buttonsParams={Object.values(buttonsWithHandlersParams)}
      onMenuButtonClick={onMenuButtonClick}
    />
  );
}

const mapStateToProps = (state) => ({
  page: state.app.page,
});
export default connect(mapStateToProps, null)(HeaderContainer);
