import React, { useEffect } from 'react';
/* eslint-disable import/no-unresolved */
import ReactDOM from 'react-dom';
/* eslint-enable import/no-unresolved */
import cn from 'classnames';
import style from './Container-cfg.module.scss';

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({
  elements = [],
  portal: [focusedIndex, modalCallback, modal],
  onModalReady,
}) {
  useEffect(() => {
    if (focusedIndex) {
      onModalReady(modalCallback);
    }
  });

  return (
    <div className={style.container}>
      {elements.map((element, index) => {
        return (
          <div
            className={cn(style.container__item, {
              [style.container__item_hidden]: index === focusedIndex,
            })}
            onFocus={element.onItemFocus}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            key={element.key}
          >
            {element.node}
          </div>
        );
      })}
      {focusedIndex &&
        ReactDOM.createPortal(
          <div
            className={cn(style.container__item, style.container__item_focused)}
          >
            {elements[focusedIndex].node}
          </div>,
          modal
        )}
    </div>
  );
}

export { style };
