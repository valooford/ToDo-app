import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
/* eslint-disable import/no-unresolved */
import { ModalContext } from '@components/Modal/Modal.container';
import Header from '@components/Header/Header';
import SelectionBar from '@components/SelectionBar/SelectionBar.container';
import Aside from '@components/Aside/Aside';
import Home from '@components/Container/Home';
import Reminiscent from '@components/Container/Reminiscent';

import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
import { getCurrentPage } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import App from './App';

function AppContainer({
  currentPage,
  // location: { pathname },
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  const modalRef = useRef();
  return (
    <ModalContext.Provider value={modalRef}>
      <App
        prepend={<div id="modal" ref={modalRef} />}
        header={[<Header key="header" />, <SelectionBar key="bar" />]}
        aside={<Aside currentPage={currentPage} />}
        main={
          <Switch>
            <Route
              path="/reminders"
              render={() => {
                return <Reminiscent pageName="/reminders" />;
              }}
            />
            <Route
              path="/label/:labelID"
              render={({
                match: {
                  params: { labelID },
                },
              }) => `label: ${labelID}`}
            />
            <Route path="/archive">archive</Route>
            <Route path="/trash">trash</Route>
            <Route
              path={['/NOTE/:noteID', '/LIST/:noteID']}
              render={({
                match: {
                  params: { noteID },
                },
              }) => `page with note: ${noteID}`}
            />
            <Route path="*" render={() => <Home pageName="/home" />} />
          </Switch>
        }
        onDirectMainClick={onDirectMainClick}
      />
    </ModalContext.Provider>
  );
}

function mapStateToProps(state) {
  return { currentPage: getCurrentPage(state) };
}

export default compose(
  hot,
  function wrapWithHashRouter(Component) {
    return () => (
      <HashRouter hashType="noslash">
        <Component />
      </HashRouter>
    );
  },
  withRouter,
  connect(mapStateToProps, {
    onDirectMainClick: clearSelectedNotesAC,
  })
)(AppContainer);
