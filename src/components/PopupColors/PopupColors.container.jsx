import React, { useRef } from 'react';
/* eslint-disable import/no-unresolved */
import PopupColors from '@components/PopupColors/PopupColors';
import { connect } from 'react-redux';
/* eslint-enable import/no-unresolved */

function PopupColorsContainer({
  /* index, */ callerRef,
  handleClose,
  onHover,
}) {
  const firstButtonRef = useRef(null);
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
      buttonsParams={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}
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

export default connect()(PopupColorsContainer);
