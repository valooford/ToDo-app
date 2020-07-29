import React from 'react';

import style from './LocationOption-cfg.module.scss';

export default function LocationOption({ postcode, street, region }) {
  return (
    <button className={style['location-option']} type="button">
      <i className={style['location-option__icon']}>&#xe80a;</i>
      {`${postcode} `}
      {`${street} `}
      <small className={style['location-option__region']}>{region}</small>
    </button>
  );
}
