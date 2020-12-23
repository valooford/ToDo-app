import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setPage as setPageAC } from '@store/appReducer';
import { clearSelectedNotes as clearSelectedNotesAC } from '@store/notesReducer';

function Page({
  component: Component,
  setPage,
  isSelectionMode,
  clearSelectedNotes,
  ...oldProps
}) {
  useEffect(() => {
    if (setPage) setPage();
  }, []);

  const { pageName, ...props } = oldProps;
  return (
    <Component
      isSelectionMode={isSelectionMode}
      onClickOutsideOfElements={isSelectionMode ? clearSelectedNotes : null}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

function mapStateToProps(state) {
  return {
    isSelectionMode: !!state.main.selectedNotes.length,
  };
}
function mapDispatchToProps(dispatch, { quiet, pageName }) {
  return bindActionCreators(
    {
      setPage: !quiet ? () => setPageAC(pageName) : null,
      clearSelectedNotes: clearSelectedNotesAC,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Page);
