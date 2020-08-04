import React from 'react';

import style from './Button-cfg.module.scss';

function Button({ children, onClick, disabled }, ref) {
  return (
    <button
      className={style.button}
      type="button"
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      {children}
    </button>
  );
}

export default React.forwardRef(Button);
