import React from 'react';

import style from './Option-cfg.module.scss';

function Option({ children, iconSymbol, details, disabled, onClick }, ref) {
  return (
    <button
      className={style.option}
      type="button"
      disabled={disabled}
      onClick={() => {
        onClick(details || children); //! add internal property to pass to onClick
      }}
      ref={ref}
    >
      {iconSymbol && <i className={style.option__icon}>{iconSymbol}</i>}
      {children}
      {details && <small className={style.option__details}>{details}</small>}
    </button>
  );
}

export default React.forwardRef(Option);
