import { hot } from 'react-hot-loader/root';
import React, { useRef, useState } from 'react';
import { compose } from 'redux';
import { HashRouter, withRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ModalContext } from '@components/Modal/Modal.container';
import { wrapWithTitled } from '@components/Title/Title.container';
import Popup, {
  PopupContext,
  getPopupContextValue,
} from '@components/Popup/Popup';

import AppTitleLayer from './App.titleLayer';
import AppHeader from './App.header';
import AppAside from './App.aside';
import AppMain from './App.main';

function AppContainer() {
  const modalRef = useRef(null);
  const [popupData, setPopupData] = useState(null);
  return (
    <DndProvider backend={HTML5Backend}>
      <ModalContext.Provider value={modalRef}>
        <PopupContext.Provider value={getPopupContextValue(setPopupData)}>
          <div ref={modalRef} key="modal" />
          <AppTitleLayer />
          {popupData && (
            <Popup
              coords={popupData.coords}
              isTopPreferred={popupData.isTopPreferred}
              key="popup"
            >
              {popupData.popupElement}
            </Popup>
          )}
          <AppHeader />
          <AppAside />
          <AppMain />
        </PopupContext.Provider>
      </ModalContext.Provider>
    </DndProvider>
  );
}

function wrapWithHashRouter(Component) {
  return () => (
    <HashRouter hashType="noslash">
      <Component />
    </HashRouter>
  );
}

export default compose(
  hot,
  wrapWithHashRouter,
  withRouter,
  wrapWithTitled
)(AppContainer);
