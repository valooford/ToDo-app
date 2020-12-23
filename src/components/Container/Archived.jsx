import React from 'react';
import { connect } from 'react-redux';

import Note from '@components/Note/Note.container';

import Container from './Container.container';

function Archived({
  archivedNotesOrder,
  removedNotes,
  isSelectionMode,
  onClickOutsideOfElements,
}) {
  return (
    <Container
      elements={archivedNotesOrder}
      groups={{
        archived: {
          test: (noteId) => !removedNotes[noteId],
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
    archivedNotesOrder: state.main.archivedNotes.order,
    removedNotes: state.main.removedNotes,
  };
}
export default connect(mapStateToProps)(Archived);
