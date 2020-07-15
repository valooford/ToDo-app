import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
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
