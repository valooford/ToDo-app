import React, { useRef } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import PopupColors from '@components/PopupColors/PopupColors';

import { setNoteColor } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

function PopupColorsContainer({
  index,
  callerRef,
  itemToFocusRef,
  handleClose,
  onHover,
  notes,
  onColorSelection,
}) {
  const { color } = notes[index];

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
        onColorSelection(index, c);
      }}
      selectedColor={color}
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

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
  };
}

export default connect(mapStateToProps, { onColorSelection: setNoteColor })(
  PopupColorsContainer
);
