import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import Title from './Title';

export const TitleContext = React.createContext();

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ TITLE
// *
const TitleContainer = React.forwardRef(
  ({ children, isHidden, onUnmount }, ref) => {
    useEffect(
      () => () => {
        onUnmount();
      },
      []
    );
    const titleRef = useContext(TitleContext);
    // titleRef.current must be mounted
    return ReactDOM.createPortal(
      <Title text={children} isHidden={isHidden} ref={ref} />,
      titleRef.current
    );
  }
);
export default TitleContainer;

// HOC for adding Titles to components
export function withTitle(Component) {
  // some onHover etc. logic
  const WrappedComponent = (
    { titleText, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props },
    ref = React.createRef()
  ) => {
    const componentRef = ref || React.createRef();
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isVisible = isHovered || isFocused;
    const [isPlaced, setIsPlaced] = useState(false);
    const componentTitleRef = useRef(null);
    useEffect(() => {
      if (!isVisible) {
        setIsPlaced(false);
        return;
      }
      const coords = componentRef.current.getBoundingClientRect();
      const { left, bottom, width } = coords;
      const title = componentTitleRef.current;
      const titleWidth = title.offsetWidth;
      title.style.top = `${bottom}px`;
      title.style.left = `${left + width / 2 - titleWidth / 2}px`;
      setIsPlaced(true);
    }, [isVisible]);
    return (
      <>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          onMouseEnter={(e) => {
            if (onMouseEnter) onMouseEnter(e);
            setIsHovered(true);
          }}
          onMouseLeave={(e) => {
            if (onMouseLeave) onMouseLeave(e);
            setIsHovered(false);
          }}
          onFocus={(e) => {
            if (onFocus) onFocus(e);
            setIsFocused(true);
          }}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
            setIsFocused(false);
          }}
          ref={componentRef}
        />
        {isVisible && (
          <TitleContainer
            isHidden={!isPlaced}
            onUnmount={() => {
              setIsHovered(false);
              setIsFocused(false);
            }}
            ref={componentTitleRef}
          >
            {titleText}
          </TitleContainer>
        )}
      </>
    );
  };
  return React.forwardRef(WrappedComponent);
}
