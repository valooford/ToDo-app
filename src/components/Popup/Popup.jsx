import React, { useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import {
  clearPopupData as clearPopupDataAC,
  setPopupData as setPopupDataAC,
} from '@store/appReducer';

import style from './Popup.module.scss';

export const PopupContext = React.createContext();

export default function Popup({ children, coords, isTopPreferred }) {
  const ref = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  useEffect(() => {
    const { left, right, top, bottom } = coords;
    const popup = ref.current;
    const popupWidth = popup.offsetWidth;
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
      popup.style.top = `${topBorder + pageYOffset}px`;
    } else {
      popup.style.top = `${bottom + pageYOffset}px`;
    }
  }, [children, coords]);
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
    const { setPopupData, clearPopupData } = useContext(PopupContext);
    return (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        setPopup={setPopupData}
        clearPopup={clearPopupData}
      />
    );
  };
}

function PopupProvider({ children, setPopupData, clearPopupData }) {
  return (
    <PopupContext.Provider value={{ setPopupData, clearPopupData }}>
      {children}
    </PopupContext.Provider>
  );
}

const PopupProviderWrapper = connect(null, {
  setPopupData: setPopupDataAC,
  clearPopupData: clearPopupDataAC,
})(PopupProvider);

export { PopupProviderWrapper as PopupProvider };
