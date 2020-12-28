import React, { useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import {
  clearTitleData as clearTitleDataAC,
  setTitleData as setTitleDataAC,
} from '@/store/appReducer';

import Title from './Title';

export const TitleContext = React.createContext();

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ TITLE
// *
const TitleContainer = ({ children, coords }) => {
  const ref = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  useEffect(() => {
    const { left, top, bottom, width } = coords;
    const title = ref.current;
    // horizontal
    const documentWidth = document.documentElement.clientWidth;
    const leftToCenter = left + width / 2;
    const titleWidth = title.offsetWidth;
    const leftBorder = leftToCenter - titleWidth / 2;
    const rightBorder = leftToCenter + titleWidth / 2;
    if (rightBorder > documentWidth && titleWidth <= documentWidth) {
      title.style.right = '0px';
      title.style.left = undefined;
    } else if (leftBorder >= 0) {
      title.style.left = `${leftBorder}px`;
    } else {
      title.style.left = '0px';
    }
    // vertical
    const titleHeight = title.offsetHeight;
    const { pageYOffset } = window;
    const topBorder = top - titleHeight;
    const bottomBorder = bottom + titleHeight;
    if (
      bottomBorder - pageYOffset > document.documentElement.clientHeight &&
      topBorder >= 0
    ) {
      title.style.top = `${topBorder + pageYOffset}px`;
    } else {
      title.style.top = `${bottom + pageYOffset}px`;
    }
  }, [children, coords]);

  return <Title text={children} isHidden={!isInitialized} ref={ref} />;
};

export default TitleContainer;

// HOC for adding Titles to components
export function withTitle(Component) {
  // some onHover etc. logic
  const WrappedComponent = (
    { titleText, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props },
    ref
  ) => {
    const { setTitleData, clearTitleData } = useContext(TitleContext);
    useEffect(() => clearTitleData, []);
    const componentRef = ref || React.createRef();

    return (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onMouseEnter={(e) => {
          if (onMouseEnter) onMouseEnter(e);
          setTitleData(titleText, componentRef.current.getBoundingClientRect());
        }}
        onMouseLeave={(e) => {
          if (onMouseLeave) onMouseLeave(e);
          clearTitleData();
        }}
        onFocus={(e) => {
          if (onFocus) onFocus(e);
          setTitleData(titleText, componentRef.current.getBoundingClientRect());
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
          clearTitleData();
        }}
        ref={componentRef}
      />
    );
  };
  return React.forwardRef(WrappedComponent);
}

function Titled({ children, setTitleData, clearTitleData }) {
  return (
    <TitleContext.Provider value={{ setTitleData, clearTitleData }}>
      {children}
    </TitleContext.Provider>
  );
}

const TitledWrapper = connect(null, {
  setTitleData: setTitleDataAC,
  clearTitleData: clearTitleDataAC,
})(Titled);

export function wrapWithTitled(Component) {
  return () => (
    <TitledWrapper>
      <Component />
    </TitledWrapper>
  );
}
