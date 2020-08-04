import React, { useRef, useEffect, useCallback, useState } from 'react';

export default function KeyboardTrap({
  children,
  inline,
  usingArrows,
  autofocus,
}) {
  const trapRef = useRef(null);
  // handle modal focus
  const [focusableElements, setFocusableElements] = useState([]);
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  setTimeout(() => {
    if (trapRef.current) {
      const elements = Array.from(
        trapRef.current.querySelectorAll(
          'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
      );
      if (elements[0] !== first || elements[elements.length - 1] !== last) {
        setFocusableElements(elements);
      }
    }
  }, 0);

  useEffect(() => {}, [focusableElements]);

  useEffect(() => {
    if (!autofocus) return;
    const elements = Array.from(
      trapRef.current.querySelectorAll(
        'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
      )
    );
    if (elements[0]) {
      // focus is asynchronous because sometimes
      // events can propagate through KeyboardTrap elements
      // and trigger event handlers on focused element
      // (ex. pressing Enter on Reminder triggers pressing
      //  first button of PopupReminder; stopPropagation didn't work)
      setTimeout(() => {
        elements[0].focus();
      }, 0);
    }
  }, [trapRef.current]);

  const keyDownHandler = useCallback(
    (e) => {
      const forwardKey = usingArrows ? 40 : 9; // down arrow or Tab
      const backwardKey = usingArrows ? 38 : 9; // up arrow or Tab
      const isForward = e.keyCode === forwardKey;
      const isBackward =
        e.keyCode === backwardKey && (usingArrows || e.shiftKey);

      if (isBackward) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (usingArrows) {
          e.preventDefault(); // exclude scrolling
          const index = focusableElements.indexOf(document.activeElement);
          focusableElements[index - 1].focus();
        }
      } else if (isForward) {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (usingArrows) {
          e.preventDefault(); // exclude scrolling
          const index = focusableElements.indexOf(document.activeElement);
          focusableElements[index + 1].focus();
        }
      }
    },
    [first, last]
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={trapRef}
      style={{ display: inline ? 'inline-block' : 'block' }}
      onKeyDown={keyDownHandler}
    >
      {children}
    </div>
  );
}
