import React from 'react';
import { connect } from 'react-redux';

import Header from '@components/Header/Header';
import SelectionBar from '@components/SelectionBar/SelectionBar.container';

import { switchAsideExpansion as switchAsideExpansionAC } from '@/store/appReducer';

import styles from './App.module.scss';

function AppHeader({ switchAsideExpansion }) {
  return (
    <header className={styles.header}>
      <Header onMenuButtonClick={switchAsideExpansion} />,
      <SelectionBar />,
    </header>
  );
}

export default connect(null, { switchAsideExpansion: switchAsideExpansionAC })(
  AppHeader
);
