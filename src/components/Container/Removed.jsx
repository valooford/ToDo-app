import React from 'react';
import { connect } from 'react-redux';

import Note from '@components/Note/Note.container';

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
