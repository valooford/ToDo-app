import React from 'react';

import style from './Container-cfg.module.scss';

function getContainerItems(elements) {
  return elements.map((element) => {
    return (
      <div className={style.container__item} key={element.id}>
        {element.node}
      </div>
    );
  });
}

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({ groups, onClickOutsideOfElements }) {
  const groupsElements = Object.keys(groups).reduce((result, groupKey) => {
    const group = groups[groupKey];
    const { name } = group;
    if (group.length > 0) {
      result.push({ items: getContainerItems(group), name, key: groupKey });
    }
    return result;
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={style.container}
      onClick={
        onClickOutsideOfElements
          ? ({ target, currentTarget }) => {
              if (
                target === currentTarget ||
                target.classList.contains(style.container__group)
              )
                onClickOutsideOfElements();
            }
          : null
      }
    >
      {groupsElements.map(({ items, name, key }) => (
        <div className={style.container__group} key={key}>
          {name && <div className={style['container__group-name']}>{name}</div>}
          {items}
        </div>
      ))}
    </div>
  );
}
