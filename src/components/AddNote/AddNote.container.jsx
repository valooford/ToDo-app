import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote';

import { focusNote } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ ADD-NOTE
// *
function AddNoteContainer({ onNoteFocus }) {
  return (
    <AddNote
      onClick={() => {
        onNoteFocus(0);
      }}
    />
  );
}

export default connect(null, { onNoteFocus: focusNote })(AddNoteContainer);
