import React from 'react';

import IconButtonTitled from '@components/IconButton/IconButton.titled';

import Header from './Header';

export default function HeaderContainer({ onMenuButtonClick }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Header
      onMenuButtonClick={onMenuButtonClick}
      IconButton={IconButtonTitled}
    />
  );
}
