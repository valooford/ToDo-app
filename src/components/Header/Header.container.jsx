import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButtonTitled from '@components/IconButton/IconButton.titled';
/* eslint-enable import/no-unresolved */
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
