import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButtonTitled from '@components/IconButton/IconButton.titled';
/* eslint-enable import/no-unresolved */
import Header from './Header';

export default function HeaderContainer(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Header {...props} IconButton={IconButtonTitled} />;
}
