import React from 'react';
import cn from 'classnames';

import style from './ColorButton.module.scss';

export default React.forwardRef(function ColorButton(
  { color, onMouseEnter, onMouseLeave },
  ref
) {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      type="button"
      className={cn(style['color-button'], {
        [style[`color-button_${color}`]]: color,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
    />
  );
});
