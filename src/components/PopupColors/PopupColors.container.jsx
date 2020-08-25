import React, { useRef } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import PopupColors from '@components/PopupColors/PopupColors';

import { setNoteColor } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

function PopupColorsContainer({
  id,
  callerRef,
  itemToFocusRef,
  handleClose,
  onHover,
  currentColor,
  onColorSelection,
}) {
  const firstButtonRef = itemToFocusRef || React.createRef();
  const lastButtonRef = useRef(null);
  const keyDownHandler = (e) => {
    // Tab(9) or Esc
    if (e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation(); // prevent a focused note from blurring
      callerRef.current.focus();
      handleClose(true);
    } else if (e.keyCode === 9) {
      if (e.shiftKey) {
        if (document.activeElement === firstButtonRef.current) {
          e.preventDefault();
          callerRef.current.focus(); // for IE
          handleClose(true);
        }
      } else if (document.activeElement === lastButtonRef.current) {
        e.preventDefault();
        callerRef.current.focus();
        handleClose(true);
      }
    }
  };

  return (
    <PopupColors
      onColorSelection={(c) => {
        onColorSelection(id, c);
      }}
      selectedColor={currentColor}
      firstButtonRef={firstButtonRef}
      lastButtonRef={lastButtonRef}
      onKeyDown={keyDownHandler}
      onHover={onHover}
      onMouseQuit={() => {
        handleClose(true);
      }}
    />
  );
}

function mapStateToProps(state, { id }) {
  const noteId = id.map ? id[0] : id;
  return {
    currentColor: state.main.notesDisplayInformation[noteId].color,
  };
}

export default connect(mapStateToProps, { onColorSelection: setNoteColor })(
  PopupColorsContainer
);
