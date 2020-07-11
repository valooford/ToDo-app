import React from 'react';
/* eslint-disable import/no-unresolved */
import Textarea from '@components/Textarea/Textarea';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './ListItem-cfg.module.scss';

// КОМПОНЕНТ ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
export default function ListItem({
  isAddItem,
  isChecked,
  text = '',
  onInput,
  onBlur,
  onRemove,
  onCheck,
}) {
  return (
    <li
      className={`${style.listItem}${
        isAddItem ? ` ${style.listItem_add}` : ''
      }`}
    >
      {!isAddItem ? (
        [
          <span className={style.listItem__drag} key="drag">
            &#xe811;
          </span>,
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
          <span
            className={style.listItem__checkbox}
            key="checkbox"
            onClick={onCheck}
          >
            {isChecked && '\ue800'}
          </span>,
          <span className={style.listItem__remove} key="remove">
            <IconButton
              iconSymbol="&#xe80c;"
              titleText="Удалить"
              modificators="icon-button_tiny"
              onClick={onRemove}
            />
          </span>,
        ]
      ) : (
        <span className={style.listItem__add}>&#xe810;</span>
      )}
      <span className={style.listItem__text}>
        {isAddItem ? (
          <Textarea placeholder="Новый пункт" onInput={onInput} />
        ) : (
          <Textarea value={text} onBlur={onBlur} />
        )}
      </span>
    </li>
  );
}
