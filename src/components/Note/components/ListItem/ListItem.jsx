import React from 'react';
import cn from 'classnames';

import Textarea from '@components/Textarea/Textarea';
import IconButton from '@components/IconButton/IconButton';

import style from './ListItem-cfg.module.scss';

export { style };

function ListItem(
  {
    isAddItem,
    isNested,
    isChecked,
    isPreview,
    isDragging,
    isHidden,
    value,
    onChange,
    onRemove,
    onCheck,
    onMouseUp,
    onInputConfirm,
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
        [style.listItem_dragging]: isDragging,
        [style.listItem_hidden]: isHidden,
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
          onKeyDown={(e) => {
            // Enter & !Shift
            if (e.keyCode === 13 && !e.shiftKey) {
              e.preventDefault();
              if (onInputConfirm) onInputConfirm();
            }
            // Backspace
            if (e.keyCode === 8 && value === '') {
              onRemove();
            }
          }}
          tabIndex={isPreview ? -1 : 0}
          ref={textareaRef}
        />
      </span>
    </li>
  );
}

export default React.memo(React.forwardRef(ListItem));
