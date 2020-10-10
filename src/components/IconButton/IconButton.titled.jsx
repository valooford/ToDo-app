import React from 'react';
/* eslint-disable import/no-unresolved */
import { withTitle } from '@components/Title/Title.container';
/* eslint-enable import/no-unresolved */
import IconButton from './IconButton';

function IconButtonTitledReferenced(props, ref) {
  const IconButtonTitled = withTitle(IconButton);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButtonTitled {...props} ref={ref} />;
}

export default React.forwardRef(IconButtonTitledReferenced);

// export default withTitle(IconButton);

// export default IconButton;
