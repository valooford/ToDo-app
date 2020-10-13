import { hot } from 'react-hot-loader/root';
import React, { useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
/* eslint-disable import/no-unresolved */
import { ModalContext } from '@components/Modal/Modal.container';
import Title, {
  TitleContext,
  getTitleContextValue,
} from '@components/Title/Title.container';
import Popup, {
  PopupContext,
  getPopupContextValue,
} from '@components/Popup/Popup';
import Header from '@components/Header/Header.container';
import SelectionBar from '@components/SelectionBar/SelectionBar.container';
import Aside from '@components/Aside/Aside';
import Page from '@components/Container/Page';
import Home from '@components/Container/Home';
import Reminiscent from '@components/Container/Reminiscent';
import Archived from '@components/Container/Archived';
import Removed from '@components/Container/Removed';

import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
import { getCurrentPage } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import App from './App';

function AppContainer({
  currentPage,
  // location: { pathname },
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  const modalRef = useRef(null);
  // const titleRef = useRef(null);
  const [titleData, setTitleData] = useState(null);
  const [popupData, setPopupData] = useState(null);
  return (
    <ModalContext.Provider value={modalRef}>
      <TitleContext.Provider value={getTitleContextValue(setTitleData)}>
        <PopupContext.Provider value={getPopupContextValue(setPopupData)}>
          <App
            prepend={[
              <div ref={modalRef} key="modal" />,
              titleData && (
                <Title coords={titleData.coords} key="title">
                  {titleData.text}
                </Title>
              ),
              popupData && (
                <Popup
                  coords={popupData.coords}
                  isTopPreferred={popupData.isTopPreferred}
                  key="popup"
                >
                  {popupData.popupElement}
                </Popup>
              ),
            ]}
            header={[<Header key="header" />, <SelectionBar key="bar" />]}
            aside={<Aside currentPage={currentPage} />}
            main={
              <Switch>
                <Route
                  path="/reminders"
                  render={() => {
                    return (
                      <Page
                        pageName="/reminders"
                        key="/reminders"
                        component={Reminiscent}
                      />
                    );
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
                <Route
                  path="/archive"
                  render={() => (
                    <Page
                      pageName="/archive"
                      key="/archive"
                      component={Archived}
                    />
                  )}
                />
                <Route
                  path="/trash"
                  render={() => {
                    return (
                      <Page
                        pageName="/trash"
                        key="/trash"
                        component={Removed}
                      />
                    );
                  }}
                />
                <Route
                  path={['/NOTE/:noteID', '/LIST/:noteID']}
                  render={({
                    match: {
                      params: { noteID },
                    },
                  }) => `page with note: ${noteID}`}
                />
                <Route
                  path="*"
                  render={() => (
                    <Page pageName="/home" key="/home" component={Home} />
                  )}
                />
              </Switch>
            }
            onDirectMainClick={onDirectMainClick}
          />
        </PopupContext.Provider>
      </TitleContext.Provider>
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
