import React from 'react';
import { compose } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { wrapWith } from '@/utils';
import NoteFocuser from '@components/Container/NoteFocuser';
import Page from '@components/Container/Page';
import Home from '@components/Container/Home';
import Reminiscent from '@components/Container/Reminiscent';
import Labeled from '@components/Container/Labeled';
import Archived from '@components/Container/Archived';
import Removed from '@components/Container/Removed';
import SearchResults from '@components/Container/SearchResults';
import { withSelectionClearing } from '@components/SelectionBar/SelectionBar.container';

import styles from './App.module.scss';

function AppMain({ onDirectClick }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <main
      className={styles.main}
      onClick={({ target, currentTarget }) => {
        if (target === currentTarget) {
          onDirectClick();
        }
      }}
    >
      <Switch>
        <Route
          path="/reminders"
          render={() => (
            <Page
              pageName="/reminders"
              key="/reminders"
              component={Reminiscent}
            />
          )}
        />
        <Route
          path="/label/:labelID"
          render={({
            match: {
              params: { labelID },
            },
          }) => (
            <Page
              label={labelID}
              pageName={`/label/${labelID}`}
              key="/label"
              component={Labeled}
            />
          )}
        />
        <Route
          path="/archive"
          render={() => (
            <Page pageName="/archive" key="/archive" component={Archived} />
          )}
        />
        <Route
          path="/trash"
          render={() => (
            <Page pageName="/trash" key="/trash" component={Removed} />
          )}
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
          path={[
            '/search/text":text?"/:filter?/:data?',
            '/search/:text?',
            '/search',
          ]}
          render={() => <Page quiet key="/search" component={SearchResults} />}
        />
        <Route
          path="*"
          render={() => <Page pageName="/home" key="/home" component={Home} />}
        />
      </Switch>
    </main>
  );
}

export default compose(
  wrapWith(DndProvider, { backend: HTML5Backend }),
  withSelectionClearing
)(AppMain);
