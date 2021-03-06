import React from 'react';
import style from './CreationTime-cfg.module.scss';

const CreationTime = React.forwardRef(
  ({ text, onMouseEnter, onMouseLeave }, ref) => (
    <span
      className={style['creation-time']}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
    >
      {text}
    </span>
  )
);
export default CreationTime;
