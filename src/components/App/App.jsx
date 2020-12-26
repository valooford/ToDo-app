import React from 'react';
// import cn from 'classnames';

// import style from '../../styles/index.module.scss';
import styles from './App.module.scss';

export default function App({
  prepend,
  header,
  aside,
  main,
  // isAsideMinified,
  // onDirectMainClick, // ---not good--- better to include this in Container
}) {
  return (
    <>
      {prepend}
      <header className={styles.header}>{header}</header>
      <aside className={styles.aside}>{aside}</aside>
      <main className={styles.main}>{main}</main>
      {/* <aside className={cn({ [style.aside_minified]: isAsideMinified })}> */}
      {/* <main
        onClick={({ target, currentTarget }) => {
          if (target === currentTarget) {
            onDirectMainClick();
          }
        }}
      > */}
    </>
  );
}
