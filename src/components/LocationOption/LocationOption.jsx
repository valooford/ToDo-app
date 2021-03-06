import React from 'react';

import style from './LocationOption-cfg.module.scss';

function LocationOption({ name, address, location, onClick }, ref) {
  return (
    <button
      className={style['location-option']}
      type="button"
      onClick={() => {
        const place = [name, address, location].filter((p) => p).join(', ');
        onClick(place);
      }}
      ref={ref}
    >
      <i className={style['location-option__icon']}>&#xe80a;</i>
      {`${name} `}
      <small className={style['location-option__region']}>{location}</small>
    </button>
  );
}

export default React.forwardRef(LocationOption);
