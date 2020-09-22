import React from 'react';

export default function App({
  prepend,
  header,
  aside,
  main,
  onDirectMainClick, // ---not good--- better to include this in Container
}) {
  return (
    <div>
      {prepend}
      <header>{header}</header>
      <aside>{aside}</aside>
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
