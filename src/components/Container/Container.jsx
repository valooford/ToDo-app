import React, { useEffect } from 'react';
/* eslint-disable import/no-unresolved */
import ReactDOM from 'react-dom';
/* eslint-enable import/no-unresolved */
import cn from 'classnames';
import style from './Container-cfg.module.scss';

function getContainerItems(elements, [itemToFocusId, itemToFocusRef]) {
  return elements.map((element) => {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={cn(
          style.container__item,
          {
            [style.container__item_focused]: element.hasFocusStyling,
          },
          {
            [style.container__item_selected]: element.isSelected,
          },
          {
            [style.container__item_hidden]: element.isFiller,
          },
          {
            [style[`container__item_style-${element.color}`]]: element.color,
          }
        )}
        onFocus={element.onFocus}
        // onBlur={element.onItemBlur}
        onKeyDown={element.onKeyDown}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={element.isFocusable ? 0 : -1}
        ref={element.id === itemToFocusId ? itemToFocusRef : null}
        key={element.id}
      >
        {element.node}
      </div>
    );
  });
}

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
export default function Container({
  elementGroups = [],
  itemToFocus,
  portal: [{ node: portalNode, color }, onModalReady, modal],
}) {
  // informing the modal that the portal is incoming
  useEffect(() => {
    if (portalNode) {
      onModalReady();
    }
  }, [portalNode]);

  const groups = elementGroups.map((group) => {
    if (group.map) {
      if (!group || !group.length) return null;
      // anonymous group
      return getContainerItems(group, itemToFocus);
    }
    if (!group.elements || !group.elements.length) return null;
    // named group
    return getContainerItems(group.elements, itemToFocus);
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
      {portalNode &&
        ReactDOM.createPortal(
          <div
            className={cn(style.container__item, style.container__item_modal, {
              [style[`container__item_style-${color}`]]: color,
            })}
            key="modal"
          >
            {portalNode}
          </div>,
          modal
        )}
    </div>
  );
}

export { style };
