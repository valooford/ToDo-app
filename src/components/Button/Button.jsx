import React from 'react';

import style from './Button-cfg.module.scss';

export default function Button({ children, onClick, disabled }) {
  return (
    <button
      className={style.button}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
