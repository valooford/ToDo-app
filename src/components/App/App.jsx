import React from 'react';
import cn from 'classnames';

import style from '../../styles/index.module.scss';

export default function App({
  prepend,
  header,
  aside,
  main,
  isAsideMinified,
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  return (
    <div>
      {prepend}
      <header>{header}</header>
      <aside className={cn({ [style.aside_minified]: isAsideMinified })}>
        {aside}
      </aside>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <main
        onClick={({ target, currentTarget }) => {
          if (target === currentTarget) {
            onDirectMainClick();
          }
        }}
      >
        {main}
      </main>
    </div>
  );
}
