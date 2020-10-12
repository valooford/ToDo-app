import React from 'react';
import cn from 'classnames';
import style from './Title-cfg.module.scss';

// КОМПОНЕНТ ОКНА С ПОДСКАЗКОЙ / TITLE
// *
function Title({ text, isHidden }, ref) {
  return (
    <div
      className={cn(style.title, { [style.title_hidden]: isHidden })}
      ref={ref}
    >
      {text}
    </div>
  );
}
export default React.forwardRef(Title);
