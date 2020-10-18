import React, { useEffect, useState } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';

import { setNoteTag, removeNoteTag } from '@store/notesReducer';
import { getAddingNoteId } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Labeled({
  addingNoteId,
  pinnedNotes,
  regularNotes,
  archivedNotes,
  removedNotes,
  labeledNotes,
  isSelectionMode,
  setLabel,
  removeLabel,
  onClickOutsideOfElements,
}) {
  // setting label on addingNote
  useEffect(() => {
    setLabel();
  }, [addingNoteId]);
  // cleaning up on page switching
  const [storedRemoveLabel] = useState({ func: removeLabel });
  useEffect(() => {
    storedRemoveLabel.func = removeLabel;
  });
  useEffect(() => {
    return () => {
      storedRemoveLabel.func();
    };
  }, []);
  return (
    <Container
      elements={[addingNoteId, ...regularNotes.order, ...archivedNotes.order]}
      groups={{
        addition: {
          test: (noteId) => noteId === addingNoteId,
          component: AddNote,
          refPropName: 'addNoteRef',
          unique: true,
        },
        pinned: {
          test: (noteId) => labeledNotes[noteId] && pinnedNotes[noteId],
          name: 'Закрепленные',
          isNameRequired: true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
        archived: {
          test: (noteId) =>
            labeledNotes[noteId] &&
            archivedNotes[noteId] &&
            !removedNotes[noteId],
          name: 'Архив',
          isNameRequired: true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
        unpinned: {
          test: (noteId) =>
            labeledNotes[noteId] &&
            !pinnedNotes[noteId] &&
            !removedNotes[noteId],
          name: 'Другие заметки',
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
    />
  );
}

function mapStateToProps(state, { label }) {
  return {
    addingNoteId: getAddingNoteId(state),
    pinnedNotes: state.main.pinnedNotes,
    regularNotes: state.main.regularNotes,
    archivedNotes: state.main.archivedNotes,
    removedNotes: state.main.removedNotes,
    labeledNotes: state.main.labeledNotes[label],
  };
}
function mapDispatchToProps(dispatch, { addingNoteId, label }) {
  return bindActionCreators(
    {
      setLabel: () => setNoteTag(addingNoteId, label),
      removeLabel: () => removeNoteTag(addingNoteId, label),
    },
    dispatch
  );
}
export default compose(
  connect(mapStateToProps, null),
  connect(null, mapDispatchToProps)
)(Labeled);
