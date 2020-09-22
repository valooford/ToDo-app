import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
/* eslint-disable import/no-unresolved */
import { ModalContext } from '@components/Modal/Modal.container';
import Header from '@components/Header/Header';
import SelectionBar from '@components/SelectionBar/SelectionBar.container';
import Aside from '@components/Aside/Aside';
import Container from '@components/Container/Container.container';

import { clearSelectedNotes as clearSelectedNotesAC } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */
import App from './App';

function AppContainer({
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  const modalRef = useRef();
  return (
    <HashRouter hashType="noslash">
      <ModalContext.Provider value={modalRef}>
        <App
          prepend={<div id="modal" ref={modalRef} />}
          header={[<Header key="header" />, <SelectionBar key="bar" />]}
          aside={<Aside />}
          main={<Container modalRef={modalRef} />}
          onDirectMainClick={onDirectMainClick}
        />
      </ModalContext.Provider>
    </HashRouter>
  );
}

const ConnectedAppContainer = connect(null, {
  onDirectMainClick: clearSelectedNotesAC,
})(AppContainer);

export default hot(ConnectedAppContainer);
