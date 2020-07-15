import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote.container';
import Note from '@components/Note/Note.container';

import { blurNote } from '@store/mainReducer';
import { readyModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
function ContainerContainer({ notes, modalRef, onModalReady, onNoteBlur }) {
  const add = {
    key: 'add',
    node: notes[0].isFocused ? <Note index={0} /> : <AddNote />,
  };
  let focusedNoteIndex;
  // заметка с индексом 0 используется для добавления
  // контейнеру может передаваться только индекс в пределах [1,...)
  // в модальном окне могут редактироваться только уже добавленные заметки
  const noteElements = notes.slice(1).map((note, i) => {
    const index = i + 1;
    if (note.isFocused) {
      focusedNoteIndex = index;
    }
    return {
      // assume that creationDate is unique for every note
      key: note.creationDate.getTime(),
      node: <Note index={index} />,
    };
  });
  return (
    <Container
      elements={[add, ...noteElements]}
      portal={[
        focusedNoteIndex,
        () => {
          onNoteBlur(focusedNoteIndex);
        },
        modalRef.current,
      ]}
      onModalReady={onModalReady}
    >
      {[add, ...noteElements]}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
  };
}

export default connect(mapStateToProps, {
  onNoteBlur: blurNote,
  onModalReady: readyModal,
})(ContainerContainer);
