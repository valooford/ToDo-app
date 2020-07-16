import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
/* eslint-disable import/no-unresolved */
import Header from '@components/Header/Header';
import Aside from '@components/Aside/Aside';
import Container from '@components/Container/Container.container';
import Modal from '@components/Modal/Modal';
/* eslint-enable import/no-unresolved */

function App({ modalCallback, closeModal }) {
  const modalRef = useRef();
  return (
    <div>
      <Modal ref={modalRef} callback={modalCallback} closeModal={closeModal} />
      <header>
        <Header />
      </header>
      <aside>
        <Aside />
      </aside>
      <main>
        <Container modalRef={modalRef} />
      </main>
    </div>
  );
}

export default hot(App);
