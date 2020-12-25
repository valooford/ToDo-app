import React from 'react';
import cn from 'classnames';

import style from './ColorButton.module.scss';

function ColorButton({ color, onClick, onMouseEnter, onMouseLeave }, ref) {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      type="button"
      className={cn(style['color-button'], {
        [style[`color-button_${color}`]]: color,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
    />
  );
}

export default React.forwardRef(ColorButton);
