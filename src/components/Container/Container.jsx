import React, { useEffect, useRef } from 'react';
/* eslint-disable import/no-unresolved */
import ReactDOM from 'react-dom';
/* eslint-enable import/no-unresolved */
import cn from 'classnames';
import style from './Container-cfg.module.scss';

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({
  elements = [],
  portal: [focusedIndex, portalNode, modalCallback, modal],
  onModalReady,
  itemToFocusIndex,
}) {
  useEffect(() => {
    if (portalNode) {
      onModalReady(modalCallback);
    }
  }, [portalNode]);
  const containerItemToFocusRef = useRef(null);
  useEffect(() => {
    if (typeof itemToFocusIndex === 'number') {
      if (containerItemToFocusRef.current) {
        containerItemToFocusRef.current.focus();
      }
    }
  }, [itemToFocusIndex]);

  return (
    <div className={style.container}>
      {elements.map((element, index) => {
        return (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className={cn(
              style.container__item,
              {
                [style.container__item_focused]: element.isItemFocused,
              },
              {
                [style.container__item_hidden]: element.isFiller,
              },
              {
                [style[`container__item_style-${element.color}`]]:
                  element.color,
              }
            )}
            onFocus={element.onItemFocus}
            onBlur={element.onItemBlur}
            onKeyDown={element.onItemKeyDown}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={element.isFocusable ? 0 : -1}
            ref={index === itemToFocusIndex ? containerItemToFocusRef : null}
            key={element.key}
          >
            {element.node}
          </div>
        );
      })}
      {portalNode &&
        ReactDOM.createPortal(
          <div
            className={cn(style.container__item, style.container__item_modal, {
              [style[`container__item_style-${elements[focusedIndex].color}`]]:
                elements[focusedIndex].color,
            })}
          >
            {portalNode}
          </div>,
          modal
        )}
    </div>
  );
}

export { style };
