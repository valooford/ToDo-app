import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { setPage as setPageAC } from '@store/appReducer';
import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';
/* eslint-enable import/no-unresolved */

function Page({
  component: Component,
  setPage,
  isSelectionMode,
  clearSelectedNotes,
}) {
  useEffect(() => {
    setPage();
  }, []);

  return (
    <Component
      isSelectionMode={isSelectionMode}
      onClickOutsideOfElements={isSelectionMode ? clearSelectedNotes : null}
    />
  );
}

function mapStateToProps(state) {
  return {
    isSelectionMode: !!state.main.selectedNotes.length,
  };
}
function mapDispatchToProps(dispatch, { pageName }) {
  return bindActionCreators(
    {
      setPage: () => setPageAC(pageName),
      clearSelectedNotes: clearSelectedNotesAC,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Page);
