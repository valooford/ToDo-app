import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import Aside from '@components/Aside/Aside.container';

import styles from './App.module.scss';

function AppAside({ isExpanded }) {
  return (
    <aside
      className={cn(styles.aside, { [styles.aside_minified]: !isExpanded })}
    >
      <Aside isExpanded={isExpanded} />
    </aside>
  );
}

function mapStateToProps(state) {
  return { isExpanded: state.app.isAsideExpanded };
}
export default connect(mapStateToProps, null)(AppAside);
