import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NoteFocuser from '@components/Container/NoteFocuser';
import Page from '@components/Container/Page';
import Home from '@components/Container/Home';
import Reminiscent from '@components/Container/Reminiscent';
import Labeled from '@components/Container/Labeled';
import Archived from '@components/Container/Archived';
import Removed from '@components/Container/Removed';
import SearchResults from '@components/Container/SearchResults';

// import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';

import styles from './App.module.scss';

// onDirectMainClick, // ---not good--- better to include this in Container
export default function AppMain() {
  return (
    <main className={styles.main}>
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
  /* <main
    onClick={({ target, currentTarget }) => {
      if (target === currentTarget) {
        onDirectMainClick();
      }
    }}
  > */
}

// connect(null, {
//   onDirectMainClick: clearSelectedNotesAC,
// })
