import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote';

import { focusNote, updateNoteText } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ ADD-NOTE
// *
function AddNoteContainer({ onNoteFocus, onInput }) {
  return (
    <AddNote
      onClick={() => {
        onNoteFocus(0);
      }}
      onInput={({ target: { value: text }, keyCode }) => {
        // IE trigger an input event on creation
        if (text === '' && !keyCode) return;
        onNoteFocus(0);
        onInput(0, text);
      }}
    />
  );
}

export default connect(null, {
  onNoteFocus: focusNote,
  onInput: updateNoteText,
})(AddNoteContainer);
