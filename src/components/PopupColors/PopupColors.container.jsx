import React, { useRef } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { associativeArrToArr } from '@/utils';

import PopupColors from '@components/PopupColors/PopupColors';
import IconButtonTitled from '@components/IconButton/IconButton.titled';

import { setNoteColor } from '@store/notesReducer';
/* eslint-enable import/no-unresolved */

function PopupColorsContainer(
  { itemToFocusRef, handleClose, onMouseEnter, currentColor, onColorSelection },
  ref
) {
  const firstButtonRef = itemToFocusRef || React.createRef();
  const lastButtonRef = useRef(null);
  const keyDownHandler = (e) => {
    // Tab(9) or Esc
    if (e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation(); // prevent a focused note from blurring
      handleClose();
    } else if (e.keyCode === 9) {
      if (e.shiftKey) {
        if (document.activeElement === firstButtonRef.current) {
          e.preventDefault();
          handleClose();
        }
      } else if (document.activeElement === lastButtonRef.current) {
        e.preventDefault();
        handleClose();
      }
    }
  };

  return (
    <PopupColors
      onColorSelection={onColorSelection}
      selectedColor={currentColor}
      firstButtonRef={firstButtonRef}
      lastButtonRef={lastButtonRef}
      onKeyDown={keyDownHandler}
      onMouseEnter={onMouseEnter}
      onMouseQuit={() => {
        handleClose(true);
      }}
      IconButton={IconButtonTitled}
      ref={ref}
    />
  );
}

function mapStateToProps(state, { id }) {
  const [noteId] = associativeArrToArr(id);
  return {
    currentColor: state.main.notes[noteId].color,
  };
}

function mapDispatchToProps(dispatch, { id }) {
  return bindActionCreators(
    { onColorSelection: (color) => setNoteColor(id, color) },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(PopupColorsContainer);
