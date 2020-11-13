import React, { useState } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.dnd';

import { getAddingNoteId } from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Container from './Container.container';

function Home({
  addingNoteId,
  regularNotesOrder,
  pinnedNotes,
  removedNotes,
  isSelectionMode,
  onClickOutsideOfElements,
}) {
  const [overlappedItem, setOverlappedItem] = useState(123);
  const onOverlap = (id) => {
    setOverlappedItem(id);
  };
  // useEffect(() => {
  //   console.log(`overlappedItem: ${overlappedItem}`);
  // }, [overlappedItem]);

  return (
    <Container
      elements={[addingNoteId, ...regularNotesOrder]}
      groups={{
        addition: {
          test: (noteId) => noteId === addingNoteId,
          component: AddNote,
          refPropName: 'addNoteRef',
          unique: true,
        },
        pinned: {
          test: (noteId) => pinnedNotes[noteId],
          name: 'Закрепленные',
          isNameRequired: true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode, overlappedItem, onOverlap },
        },
        unpinned: {
          test: (noteId) => !pinnedNotes[noteId] && !removedNotes[noteId],
          name: 'Другие заметки',
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode, overlappedItem, onOverlap },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
    />
  );
}

function mapStateToProps(state) {
  return {
    addingNoteId: getAddingNoteId(state),
    regularNotesOrder: state.main.regularNotes.order,
    pinnedNotes: state.main.pinnedNotes,
    removedNotes: state.main.removedNotes,
  };
}
export default connect(mapStateToProps)(Home);
