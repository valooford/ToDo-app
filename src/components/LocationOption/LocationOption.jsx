import React from 'react';

import style from './LocationOption-cfg.module.scss';

function LocationOption({ postcode, street, region, onClick, onKeyDown }, ref) {
  return (
    <button
      className={style['location-option']}
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      <i className={style['location-option__icon']}>&#xe80a;</i>
      {`${postcode} `}
      {`${street} `}
      <small className={style['location-option__region']}>{region}</small>
    </button>
  );
}

export default React.forwardRef(LocationOption);
