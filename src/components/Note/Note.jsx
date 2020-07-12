import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
import Notification from '@components/Notification/Notification';
import CreationTime from '@components/CreationTime/CreationTime';
import ListItem from '@components/ListItem/ListItem';
/* eslint-enable import/no-unresolved */
import style from './Note-cfg.module.scss';

export default function Note({
  noteData: {
    type,
    headerText,
    text,
    items,
    markedItems,
    isFocused,
    creationDate,
    editingDate,
  },
  buttons,
  eventHandlers: {
    onClick,
    onHeaderBlur,
    onTextFieldBlur,
    onListItemAdd,
    onListItemBlur,
    onListItemRemove,
    onListItemCheck,
    onListItemUncheck,
  },
}) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={style.note}
      onSubmit={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <div className={style.note__check}>
        <IconButton
          iconSymbol="&#xe80b;"
          titleText="Выбрать заметку"
          modificators="icon-button_no-padding"
        />
      </div>
      <div className={style.note__cornerButtons}>
        <IconButton
          iconSymbol="&#xe812;"
          titleText="Закрепить заметку"
          modificators="icon-button_smaller"
        />
      </div>
      {(isFocused || headerText !== '') && (
        <input
          className={style.note__header}
          type="text"
          placeholder="Введите заголовок"
          value={headerText}
          // readOnly
          // onBlur={onHeaderBlur}
          onChange={onHeaderBlur}
        />
      )}
      {type !== 'list' && (
        <div className={style.note__text}>
          <Textarea
            placeholder="Заметка..."
            value={text}
            onBlur={onTextFieldBlur}
          />
        </div>
      )}
      {type === 'list' && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list}>
            {items.map((item) => (
              <ListItem
                text={item.text}
                onBlur={onListItemBlur(item.index)}
                onRemove={onListItemRemove(item.index)}
                onCheck={onListItemCheck(item.index)}
              />
            ))}
            <ListItem isAddItem onInput={onListItemAdd} />
          </ul>
          <div className={style.note__markedList}>
            <i>&#xe81a;</i>
            <span className={style.note__markedCount}>
              {`${markedItems.length} отмеченных пунктов`}
            </span>
            <ul className={style.note__list}>
              {markedItems.map((item) => (
                <ListItem
                  isChecked
                  text={item.text}
                  onBlur={onListItemBlur(item.index)}
                  onRemove={onListItemRemove(item.index)}
                  onCheck={onListItemUncheck(item.index)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className={style.note__info}>
        {isFocused && creationDate && editingDate && (
          <span className={style.note__creationTime}>
            <CreationTime
              creationDate={creationDate}
              editingDate={editingDate}
            />
          </span>
        )}
        <Notification />
      </div>
      <div className={style.note__buttons}>
        {isFocused && (
          <button className={style.note__button} type="button">
            Закрыть
          </button>
        )}
        {buttons}
      </div>
    </form>
  );
}
