import React from 'react';
import style from './Container-cfg.module.scss';

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({ elements = [], focusedNoteIndex }) {
  return (
    <div className={style.container} id="container">
      {elements.map((element, i) => {
        const modificator =
          i === focusedNoteIndex ? ` ${style.container__item_focused}` : '';
        return (
          <div className={`${style.container__item}${modificator}`}>
            {element}
          </div>
        );
      })}
    </div>
  );
}

export { style };
