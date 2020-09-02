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
export default function Container({ groups }) {
  const groupsElements = groups.reduce((result, group) => {
    const { name, key } = group;
    let elements;
    if (group.map) {
      // an anonymous group
      if (group.length) {
        // contains elements
        elements = group;
      }
    } else if (group.elements.length) {
      // a named group containing elements
      elements = group.elements;
    }
    if (elements) {
      result.push({ items: getContainerItems(elements), name, key });
    }
    return result;
  }, []);

  return (
    <div className={style.container}>
      {groupsElements.map(({ items, name, key }, i) => (
        <div className={style.container__group} key={key || `anonymous-${i}`}>
          {name && <div className={style['container__group-name']}>{name}</div>}
          {items}
        </div>
      ))}
    </div>
  );
}
