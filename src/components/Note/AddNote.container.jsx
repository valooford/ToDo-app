import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { focusNote, updateNoteText } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */
import Note from './Note.container';
import AddNote from './AddNote';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ ADD-NOTE
// *
function AddNoteContainer({ id, isFocused, onNoteFocus, onInput }) {
  if (isFocused) {
    return <Note id={id} />;
  }
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <AddNote
      onClick={() => {
        onNoteFocus(id);
      }}
      onInput={(text) => {
        onNoteFocus(id);
        onInput(id, text);
      }}
      ref={inputRef}
    />
  );
}

function mapStateToProps(state) {
  const id = state.main.notesOrder[0];
  return {
    id,
    isFocused: state.main.focusedNoteId === id,
  };
}

export default connect(mapStateToProps, {
  onNoteFocus: focusNote,
  onInput: updateNoteText,
})(AddNoteContainer);
