import React, { useEffect, useState } from 'react';
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
export default function ContainerContainer({
  elements,
  groups,
  onClickOutsideOfElements,
  dndEnabled,
}) {
  const [overlappedItem, setOverlappedItem] = useState(null);
  const onOverlap = (id) => {
    setOverlappedItem(id);
  };
  const onDragEnd = (/* id */) => {
    if (overlappedItem) {
      // console.log(`note ${id} was dropped on note ${overlappedNote}`);
      setOverlappedItem(null);
    }
  };

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

  // refs must be stable across renders
  const [elementsRefs, setElementsRefs] = useState(() =>
    Array(elements.length)
      .fill()
      .map(() => React.createRef())
  );
  useEffect(() => {
    setElementsRefs((prev) =>
      Array(elements.length)
        .fill()
        .map((_, i) => prev[i] || React.createRef())
    );
  }, [elements.length]);

  const elementGroups = elements.reduce((elGroups, id, index) => {
    /* eslint-disable no-param-reassign */
    const elemRef = elementsRefs[index];
    for (let i = 0; i < groupKeys.length; i += 1) {
      const groupKey = groupKeys[i];
      const group = groups[groupKey];
      const elemProps = {
        neighbourRef: elGroups.neighbourRef,
        [group.refPropName]: elemRef,
        ...group.extraProps,
        ...(dndEnabled
          ? {
              isOverlapped: id === overlappedItem,
              onOverlap: () => onOverlap(id),
              onDragEnd: () => onDragEnd(id),
            }
          : {}),
      };
      if (group.test(id)) {
        if (dndEnabled) {
          elemProps.groupName = groupKey;
          const gindex = elGroups[groupKey].length;
          elemProps.overlapNext = () => {
            setTimeout(() => {
              const nextEl = elGroups[groupKey][gindex + 1];
              let itemToOverlapId;
              if (nextEl && nextEl.id !== id) {
                itemToOverlapId = nextEl.id;
              } else if (elGroups[groupKey][gindex + 2]) {
                itemToOverlapId = elGroups[groupKey][gindex + 2].id;
              } else {
                itemToOverlapId = 'end';
              }
              setOverlappedItem(itemToOverlapId);
            }, 0);
          };
        }
        const Component = group.component;
        elGroups[groupKey].push({
          id,
          // eslint-disable-next-line react/jsx-props-no-spreading
          node: <Component id={id} {...elemProps} />,
        });
        elGroups.neighbourRef = elemRef;
        if (group.unique) break;
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
