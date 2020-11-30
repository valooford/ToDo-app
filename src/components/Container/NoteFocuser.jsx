import React, { useEffect } from 'react';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import Page from '@components/Container/Page';
import Home from '@components/Container/Home';
import Archived from '@components/Container/Archived';
import Removed from '@components/Container/Removed';

import { focusNote } from '@store/notesReducer';
/* eslint-enable import/no-unresolved */
// import SearchResults from './SearchResults';

function NoteFocuser({
  // isSearching,
  isRegular,
  isArchived,
  isRemoved,
  onMount,
}) {
  useEffect(() => {
    onMount();
  }, []);
  let quiet;
  let pageName;
  let component;
  // if (isSearching) {
  //   quiet = true;
  //   component = SearchResults;
  // } else
  if (isRemoved) {
    pageName = '/trash';
    component = Removed;
  } else if (isRegular) {
    pageName = '/home';
    component = Home;
  } else if (isArchived) {
    pageName = '/archive';
    component = Archived;
  } else return null;
  return <Page quiet={quiet} pageName={pageName} component={component} />;
}

function mapStateToProps(state, { noteID }) {
  return {
    // isSearching: !!state.main.foundNotes.length,
    isRegular: state.main.regularNotes[noteID],
    isArchived: state.main.archivedNotes[noteID],
    isRemoved: state.main.removedNotes[noteID],
  };
}
function mapDispatchToProps(dispatch, { noteID }) {
  return {
    onMount: () => {
      dispatch(focusNote(noteID));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteFocuser);
