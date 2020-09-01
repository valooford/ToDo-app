import React from 'react';

import style from './Container-cfg.module.scss';

function getContainerItems(elements) {
  return elements.map((element) => {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div className={style.container__item} key={element.id}>
        {element.node}
      </div>
    );
  });
}

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({ elementGroups = [] }) {
  const groups = elementGroups.map((group) => {
    if (group.map) {
      if (!group || !group.length) return null;
      // anonymous group
      return getContainerItems(group);
    }
    if (!group.elements || !group.elements.length) return null;
    // named group
    return getContainerItems(group.elements);
  });

  return (
    <div className={style.container}>
      {groups.map((group, i) =>
        group ? (
          <div
            className={style.container__group}
            key={elementGroups[i].name || `unnamed${i}`}
          >
            {elementGroups[i].name && (
              <div className={style['container__group-name']}>
                {elementGroups[i].name}
              </div>
            )}
            {group}
          </div>
        ) : null
      )}
    </div>
  );
}

export { style };
