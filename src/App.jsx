/* eslint-disable import/no-unresolved */
// import store from '@store/store';
import React from 'react';

// import setupHeader from '@components/Header/Header';
// import setupAside from '@components/Aside/Aside';
import Aside from '@components/Aside/Aside';
// import setupContainer from '@components/Container/Container';

// import setupPopupMenu from '@components/PopupMenu/PopupMenu';
/* eslint-enable import/no-unresolved */

// const App = {
//   localState: {},
//   root: null,
//   render(state) {
//     if (!this.root) {
//       console.error(
//         'App.root is not defined. Initialize it by passing it to initializeApp() function'
//       );
//     }

//     // HEADER
//     const header = this.root.querySelector('header');
//     header.innerHTML = '';
//     header.append(setupHeader());

//     // ASIDE
//     const aside = this.root.querySelector('aside');
//     aside.innerHTML = '';
//     aside.append(setupAside());

//     // MAIN
//     if (this.localState.main !== state.main) {
//       const main = this.root.querySelector('main');
//       main.innerHTML = '';
//       main.append(setupContainer(state.main));
//     }

//     this.localState = { ...state };
//   },
// };

// App.render = App.render.bind(App);
// store.setStateCallback(App.render);

// export default function initializeApp(root) {
//   App.root = root;
//   App.render(store.getState());
// }

export default function App() {
  return (
    <div>
      {/* <header>{setupHeader()}</header> */}
      <aside>
        <Aside />
      </aside>
      {/* <main>{setupContainer()}</main> */}
    </div>
  );
}
