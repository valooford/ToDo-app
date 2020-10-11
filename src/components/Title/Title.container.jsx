import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Title from './Title';

export const TitleContext = React.createContext();

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ TITLE
// *
function TitleContainer({ children, onUnmount }) {
  useEffect(
    () => () => {
      onUnmount();
    },
    []
  );
  const titleRef = useContext(TitleContext);
  // titleRef.current must be mounted
  return ReactDOM.createPortal(<Title text={children} />, titleRef.current);
}
export default TitleContainer;

// HOC for adding Titles to components
export function withTitle(Component) {
  // some onHover etc. logic
  const WrappedComponent = (
    { titleText, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props },
    ref = React.createRef()
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isVisible = isHovered || isFocused;
    // useEffect(() => {
    //   if (isVisible) {
    //   }
    // }, [isVisible]);
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
          ref={ref}
        />
        {isVisible && (
          <TitleContainer
            onUnmount={() => {
              setIsHovered(false);
              setIsFocused(false);
            }}
          >
            {titleText}
          </TitleContainer>
        )}
      </>
    );
  };
  return React.forwardRef(WrappedComponent);
}
