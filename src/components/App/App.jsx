import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
/* eslint-disable import/no-unresolved */
import Header from '@components/Header/Header';
import SelectionBar from '@components/SelectionBar/SelectionBar.container';
import Aside from '@components/Aside/Aside';
import Container from '@components/Container/Container.container';
import { ModalContext } from '@components/Modal/Modal.container';

import { clearSelectedNotes as clearSelectedNotesAC } from '@store/mainReducer';
import { connect } from 'react-redux';
/* eslint-enable import/no-unresolved */

function App({
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  const modalRef = useRef();

  return (
    <div>
      <div id="modal" ref={modalRef} />
      <ModalContext.Provider value={modalRef}>
        <header>
          <Header />
          <SelectionBar />
        </header>
        <aside>
          <Aside />
        </aside>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
        <main
          onClick={({ target, currentTarget }) => {
            if (target === currentTarget) {
              onDirectMainClick();
            }
          }}
        >
          <Container modalRef={modalRef} />
        </main>
      </ModalContext.Provider>
    </div>
  );
}

const AppContainer = connect(null, { onDirectMainClick: clearSelectedNotesAC })(
  App
);

export default hot(AppContainer);
