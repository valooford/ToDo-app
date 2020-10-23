import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import Textarea from '@components/Textarea/Textarea';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './ListItem-cfg.module.scss';

export { style };

// КОМПОНЕНТ ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
function ListItem(
  {
    isAddItem,
    isNested,
    isChecked,
    isPreview,
    value,
    onChange,
    onRemove,
    onCheck,
    onMouseUp,
    dragRef,
    textareaRef,
  },
  ref
) {
  const listItemInteractiveElements = [
    <button
      className={style.listItem__checkbox}
      type="button"
      key="checkbox"
      onClick={onCheck}
    >
      {isChecked && '\ue800'}
    </button>,
  ];
  if (!isPreview) {
    if (!isChecked) {
      listItemInteractiveElements.push(
        <span className={style.listItem__drag} key="drag" ref={dragRef}>
          &#xe811;
        </span>
      );
    }
    listItemInteractiveElements.push(
      <span className={style.listItem__remove} key="remove">
        <IconButton
          iconSymbol="&#xe80c;"
          titleText="Удалить"
          modificators="icon-button_tiny"
          onClick={onRemove}
        />
      </span>
    );
  }
  return (
    <li
      className={cn(style.listItem, {
        [style.listItem_add]: isAddItem,
        [style.listItem_nested]: isNested,
      })}
      ref={ref}
    >
      {isAddItem ? (
        <span className={style.listItem__add}>&#xe810;</span>
      ) : (
        listItemInteractiveElements
      )}
      <span className={style.listItem__text}>
        <Textarea
          value={value}
          placeholder={isAddItem ? 'Новый пункт' : ''}
          onChange={!isPreview ? onChange : null}
          onMouseUp={onMouseUp}
          tabIndex={isPreview ? -1 : 0}
          ref={textareaRef}
        />
      </span>
    </li>
  );
}

export default React.memo(React.forwardRef(ListItem));
