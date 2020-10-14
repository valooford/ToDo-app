import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import style from './Popup.module.scss';

export const PopupContext = React.createContext();

export default function Popup({ children, childRef, isTopPreferred }) {
  const ref = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  useEffect(() => {
    const coords = childRef.current.getBoundingClientRect();
    const { left, right, top, bottom } = coords;
    const popup = ref.current;
    const popupWidth = popup.offsetHeight;
    // horizontal
    const documentWidth = document.documentElement.clientWidth;
    const leftBorder = right - popupWidth;
    const rightBorder = left + popupWidth;
    if (rightBorder > documentWidth && leftBorder >= 0) {
      popup.style.left = `${leftBorder}px`;
    } else {
      popup.style.left = `${left}px`;
    }
    // vertical
    const documentHeight = document.documentElement.clientHeight;
    const { pageYOffset } = window;
    const popupHeight = popup.offsetHeight;
    const topBorder = top - popupHeight;
    const bottomBorder = bottom + popupHeight;
    if (
      topBorder >= 0 &&
      (isTopPreferred || bottomBorder - pageYOffset >= documentHeight)
    ) {
      popup.style.top = `${topBorder}px`;
    } else {
      popup.style.top = `${top}px`;
    }
  }, [children, childRef]);
  return (
    <div
      className={cn(style.popup, { [style.popup_hidden]: !isInitialized })}
      ref={ref}
    >
      {children}
    </div>
  );
}

export function withPopup(Component) {
  return (props) => {
    const { setPopup, clearPopup } = useContext(PopupContext);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} setPopup={setPopup} clearPopup={clearPopup} />;
  };
}

export function getPopupContextValue(setPopupData) {
  return {
    setPopup(popupElement, coords, isTopPreferred) {
      setPopupData({ popupElement, coords, isTopPreferred });
    },
    clearPopup() {
      setPopupData(null);
    },
  };
}
