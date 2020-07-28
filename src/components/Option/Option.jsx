import React from 'react';

import style from './Option-cfg.module.scss';

export default function Option({ children, iconSymbol, details, disabled }) {
  return (
    <button className={style.option} type="button" disabled={disabled}>
      {iconSymbol && <i className={style.option__icon}>{iconSymbol}</i>}
      {children}
      {details && <small className={style.option__details}>{details}</small>}
    </button>
  );
}
