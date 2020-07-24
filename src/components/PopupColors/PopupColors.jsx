import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

import style from './PopupColors.module.scss';

export default function PopupColors({
  buttonsParams = [1],
  firstButtonRef,
  lastButtonRef,
  onKeyDown,
  onHover,
  onMouseQuit,
}) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
    <div
      className={style['popup-colors']}
      onKeyDown={onKeyDown}
      onMouseEnter={onHover}
      onMouseLeave={onMouseQuit}
    >
      {buttonsParams.map((params, i) => {
        let buttonRef;
        if (!i) {
          buttonRef = firstButtonRef;
        } else if (i === buttonsParams.length - 1) {
          buttonRef = lastButtonRef;
        } else {
          buttonRef = null;
        }
        return (
          <IconButton
            iconSymbol="K"
            titleText="По умолчанию"
            modificators="icon-button_colored"
            onClick={params.onClick}
            ref={buttonRef}
          />
        );
      })}
    </div>
  );
}
