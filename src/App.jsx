/* eslint-disable import/no-unresolved */
import React from 'react';

import Header from '@components/Header/Header';
import Aside from '@components/Aside/Aside';
import Container from '@components/Container/Container.container';
/* eslint-enable import/no-unresolved */

export default function App() {
  return (
    <div>
      <header>
        <Header />
      </header>
      <aside>
        <Aside />
      </aside>
      <main>
        <Container />
      </main>
    </div>
  );
}
