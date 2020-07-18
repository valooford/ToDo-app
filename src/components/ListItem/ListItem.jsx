import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import Textarea from '@components/Textarea/Textarea';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './ListItem-cfg.module.scss';

// КОМПОНЕНТ ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
function ListItem(
  {
    isAddItem,
    isChecked,
    isPreview,
    value,
    onChange,
    onRemove,
    onCheck,
    onFocus,
  },
  ref
) {
  const listItemInteractiveElements = [
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <span className={style.listItem__checkbox} key="checkbox" onClick={onCheck}>
      {isChecked && '\ue800'}
    </span>,
  ];
  if (!isPreview) {
    listItemInteractiveElements.push(
      <span className={style.listItem__drag} key="drag">
        &#xe811;
      </span>,
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
    <li className={cn(style.listItem, { [style.listItem_add]: isAddItem })}>
      {isAddItem ? (
        <span className={style.listItem__add}>&#xe810;</span>
      ) : (
        listItemInteractiveElements
      )}
      <span className={style.listItem__text}>
        <Textarea
          value={value}
          placeholder={isAddItem ? 'Новый пункт' : ''}
          onChange={onChange}
          onFocus={onFocus}
          tabIndex={isPreview ? -1 : 0}
          ref={ref}
        />
      </span>
    </li>
  );
}

export default React.forwardRef(ListItem);
