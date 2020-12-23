import React from 'react';

import IconButtonTitled from '@components/IconButton/IconButton.titled';

import Dropdown from './Dropdown';

const DropdownContainer = (props, ref) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Dropdown {...props} ref={ref} IconButton={IconButtonTitled} />;
};

export default React.forwardRef(DropdownContainer);
