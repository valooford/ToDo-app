import React from 'react';
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
export default function ContainerContainer({
  elements,
  groups,
  onClickOutsideOfElements,
}) {
  // ELEMENT GROUPS GATHERING
  // *
  const groupKeys = Object.keys(groups);
  const initialElementGroups = groupKeys.reduce(
    (elementGroups, groupKey) => {
      /* eslint-disable no-param-reassign */
      elementGroups[groupKey] = [];
      elementGroups[groupKey].name = groups[groupKey].name;
      /* eslint-enable no-param-reassign */
      return elementGroups;
    },
    { neighbourRef: null }
  );
  const elementGroups = elements.reduce((elGroups, id) => {
    /* eslint-disable no-param-reassign */
    const elemRef = React.createRef(); // ? causing problems with drag&drop
    for (let i = 0; i < groupKeys.length; i += 1) {
      const groupKey = groupKeys[i];
      const elemProps = {
        neighbourRef: groups.neighbourRef,
        [groups[groupKey].refPropName]: elemRef,
        ...groups[groupKey].extraProps,
      };
      if (groups[groupKey].test(id)) {
        const Component = groups[groupKey].component;
        elGroups[groupKey].push({
          id,
          // eslint-disable-next-line react/jsx-props-no-spreading
          node: <Component id={id} {...elemProps} />,
        });
        elGroups.neighbourRef = elemRef;
        if (groups[groupKey].unique) break;
      }
    }
    /* eslint-enable no-param-reassign */
    return elGroups;
  }, initialElementGroups);
  delete elementGroups.neighbourRef;

  const namedGroupKeys = groupKeys.filter(
    (groupKey) => elementGroups[groupKey].name
  );
  const namedNotEmptyGroupKeys = namedGroupKeys.filter(
    (groupKey) => elementGroups[groupKey].length
  );
  if (
    namedNotEmptyGroupKeys.length === 0 ||
    (namedNotEmptyGroupKeys.length === 1 &&
      !groups[namedNotEmptyGroupKeys[0]].isNameRequired)
  ) {
    namedGroupKeys.forEach((groupKey) => {
      delete elementGroups[groupKey].name;
    });
  }

  return (
    <Container
      groups={elementGroups}
      onClickOutsideOfElements={onClickOutsideOfElements}
    />
  );
}
