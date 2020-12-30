import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { focusNote, updateNoteText } from '@store/notesReducer';
import { getAddingNoteId } from '@store/selectors';

import IconButtonTitled from '@components/IconButton/IconButton.titled';

import Note from './Note';
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
      IconButton={IconButtonTitled}
      ref={inputRef}
    />
  );
}

function mapStateToProps(state) {
  const id = getAddingNoteId(state);
  return {
    id,
    isFocused: state.main.focusedNoteId === id,
  };
}

export default connect(mapStateToProps, {
  onNoteFocus: focusNote,
  onInput: updateNoteText,
})(AddNoteContainer);
