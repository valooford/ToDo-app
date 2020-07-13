import React from 'react';
import cn from 'classnames';
import style from './Container-cfg.module.scss';

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({ elements = [], focusedIndex }) {
  return (
    <div className={style.container}>
      {elements.map((element, i) => {
        return (
          <div
            className={cn(style.container__item, {
              [style.container__item_focused]: i === focusedIndex,
            })}
            key={element.key}
          >
            {element.node}
          </div>
        );
      })}
    </div>
  );
}

export { style };
