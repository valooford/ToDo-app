import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
import { compose } from 'redux';
import { HashRouter, withRouter } from 'react-router-dom';

import { wrapWith } from '@/utils';
import { ModalContext } from '@components/Modal/Modal';
import { PopupProvider } from '@components/Popup/Popup';
import { TitleProvider } from '@components/Title/Title.container';

import AppModalLayer from './App.modalLayer';
import AppPopupLayer from './App.popupLayer';
import AppTitleLayer from './App.titleLayer';
import AppHeader from './App.header';
import AppAside from './App.aside';
import AppMain from './App.main';

function AppContainer() {
  const modalRef = useRef(null);
  return (
    <ModalContext.Provider value={modalRef}>
      <AppModalLayer modalRef={modalRef} />
      <AppPopupLayer />
      <AppTitleLayer />
      <AppHeader />
      <AppAside />
      <AppMain />
    </ModalContext.Provider>
  );
}

export default compose(
  hot,
  wrapWith(HashRouter, { hashType: 'noslash' }),
  withRouter,
  wrapWith(TitleProvider),
  wrapWith(PopupProvider)
)(AppContainer);
