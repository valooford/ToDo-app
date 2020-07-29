import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
/* eslint-disable import/no-unresolved */
import Header from '@components/Header/Header';
import Aside from '@components/Aside/Aside';
import Container from '@components/Container/Container.container';
import Modal from '@components/Modal/Modal.container';
/* eslint-enable import/no-unresolved */

function App() {
  const modalRef = useRef();
  return (
    <div>
      <Modal modalRef={modalRef} />
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
