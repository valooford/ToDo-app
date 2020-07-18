import React, { useRef } from 'react';

export default function KeyboardTrap({ children }) {
  const trapRef = useRef();
  // handle modal focus
  let focusableElements = [];
  let first;
  let last;
  if (trapRef.current) {
    focusableElements = trapRef.current.querySelectorAll(
      'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    );
    [first] = focusableElements;
    last = focusableElements[focusableElements.length - 1];
  }
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
      onKeyDown={(e) => {
        // Tab
        if (e.keyCode === 9) {
          // Shift + Tab
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
            // Tab
          } else if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }}
    >
      {children}
    </div>
  );
}
