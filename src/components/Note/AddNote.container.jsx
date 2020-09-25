import React, { useEffect } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { focusNote, updateNoteText } from '@store/notesReducer';
/* eslint-enable import/no-unresolved */
import Note from './Note.container';
import AddNote from './AddNote';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ ADD-NOTE
// *
function AddNoteContainer({ id, isFocused, onNoteFocus, onInput, addNoteRef }) {
  // focusing
  const inputRef = addNoteRef || React.createRef();
  useEffect(() => {
    if (isFocused) return undefined;
    const timerId = setTimeout(() => {
      inputRef.current.focus();
    }, 0);
    return () => clearTimeout(timerId);
  }, [isFocused]);

  if (isFocused) {
    return <Note id={id} />;
  }
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
  const id = state.main.regularNotesOrder[0];
  return {
    id,
    isFocused: state.main.focusedNoteId === id,
  };
}

export default connect(mapStateToProps, {
  onNoteFocus: focusNote,
  onInput: updateNoteText,
})(AddNoteContainer);
