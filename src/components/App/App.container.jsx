import { hot } from 'react-hot-loader/root';
import React, { useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import Aside from '@components/Aside/Aside.container';
import NoteFocuser from '@components/Container/NoteFocuser';
import Page from '@components/Container/Page';
import Home from '@components/Container/Home';
import Reminiscent from '@components/Container/Reminiscent';
import Labeled from '@components/Container/Labeled';
import Archived from '@components/Container/Archived';
import Removed from '@components/Container/Removed';
import SearchFilters from '@components/Container/SearchFilters';

import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
/* eslint-enable import/no-unresolved */
import App from './App';

function AppContainer({
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  const modalRef = useRef(null);
  const [titleData, setTitleData] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [isAsideExpanded, setIsAsideExpanded] = useState(true);
  const switchIsAsideExpanded = () => {
    setIsAsideExpanded((prev) => !prev);
  };
  return (
    <DndProvider backend={HTML5Backend}>
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
              header={[
                <Header
                  onMenuButtonClick={switchIsAsideExpanded}
                  key="header"
                />,
                <SelectionBar key="bar" />,
              ]}
              aside={<Aside isExpanded={isAsideExpanded} />}
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
                    }) => {
                      return (
                        <Page
                          label={labelID}
                          pageName={`/label/${labelID}`}
                          key="/label"
                          component={Labeled}
                        />
                      );
                    }}
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
                    }) => <NoteFocuser noteID={noteID} />}
                  />
                  <Route
                    path="/search"
                    render={() => {
                      return (
                        <Page quiet key="/search" component={SearchFilters} />
                      );
                    }}
                  />
                  <Route
                    path="*"
                    render={() => (
                      <Page pageName="/home" key="/home" component={Home} />
                    )}
                  />
                </Switch>
              }
              isAsideMinified={!isAsideExpanded}
              onDirectMainClick={onDirectMainClick}
            />
          </PopupContext.Provider>
        </TitleContext.Provider>
      </ModalContext.Provider>
    </DndProvider>
  );
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
  connect(null, {
    onDirectMainClick: clearSelectedNotesAC,
  })
)(AppContainer);
