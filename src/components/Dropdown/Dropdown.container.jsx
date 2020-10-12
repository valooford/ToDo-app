import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButtonTitled from '@components/IconButton/IconButton.titled';
/* eslint-enable import/no-unresolved */
import Dropdown from './Dropdown';

const DropdownContainer = (props, ref) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Dropdown {...props} ref={ref} IconButton={IconButtonTitled} />;
};

export default React.forwardRef(DropdownContainer);
