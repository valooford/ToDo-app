import React, { useContext, useEffect, useRef, useState } from 'react';

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

    const leftToCenter = left + width / 2;
    const titleHalfWidth = title.offsetWidth / 2;
    const leftBorder = leftToCenter - titleHalfWidth;
    const rightBorder = leftToCenter + titleHalfWidth;
    if (leftBorder < 0) {
      title.style.left = '0px';
    } else if (rightBorder > document.documentElement.clientWidth) {
      title.style.right = '0px';
    } else {
      title.style.left = `${leftBorder}px`;
    }

    const titleHeight = title.offsetHeight;
    const bottomBorder = bottom + titleHeight;
    if (
      bottomBorder - window.pageYOffset >
      document.documentElement.clientHeight
    ) {
      title.style.top = `${top - titleHeight}px`;
    } else {
      title.style.top = `${bottom}px`;
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
