import React, { useRef, useEffect, useCallback } from 'react';

export default function KeyboardTrap({
  children,
  inline,
  usingArrows,
  autofocus,
}) {
  const trapRef = useRef();
  // handle modal focus
  let focusableElements = [];
  let first;
  let last;
  useEffect(() => {
    if (trapRef.current) {
      focusableElements = Array.from(
        trapRef.current.querySelectorAll(
          'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
      );
      [first] = focusableElements;
      last = focusableElements[focusableElements.length - 1];
    }
  }, [trapRef.current]);

  useEffect(() => {
    if (autofocus) {
      first.focus();
    }
  }, []);

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
          const index = focusableElements.indexOf(document.activeElement);
          focusableElements[index - 1].focus();
        }
      } else if (isForward) {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (usingArrows) {
          const index = focusableElements.indexOf(document.activeElement);
          focusableElements[index + 1].focus();
        }
      }
    },
    [first, last]
  );

  // const [edgeElements, setEdgeElements] = useState({});
  // useEffect(() => {
  //   console.log('wee-wee');
  //   if (first !== edgeElements.first || last !== edgeElements.last) {
  //     setEdgeElements({
  //       first,
  //       last,
  //     });
  //   }
  // }, [focusableElements.length, first, last]);
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
