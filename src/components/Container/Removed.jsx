import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import Note from '@components/Note/Note.container';

/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Removed({
  removedNotesOrder,
  isSelectionMode,
  onClickOutsideOfElements,
}) {
  return (
    <Container
      elements={removedNotesOrder}
      groups={{
        removed: {
          test: () => true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
    />
  );
}

function mapStateToProps(state) {
  return {
    removedNotesOrder: state.main.removedNotes.order,
  };
}
export default connect(mapStateToProps)(Removed);
