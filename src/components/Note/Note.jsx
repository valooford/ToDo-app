import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
import Notification from '@components/Notification/Notification';
import CreationTime from '@components/CreationTime/CreationTime';
import ListItem from '@components/ListItem/ListItem';
/* eslint-enable import/no-unresolved */
import style from './Note-cfg.module.scss';

export { style };

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
  popup = {},
  eventHandlers: {
    onClick,
    onClose,
    onHeaderChange,
    onTextFieldChange,
    onListItemAdd,
    onMoreButtonClick,
  },
}) {
  const buttons = [
    {
      iconSymbol: '\uf0f3',
      titleText: 'Сохранить напоминание',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue803',
      titleText: 'Соавторы',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue804',
      titleText: 'Изменить цвет',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue802',
      titleText: 'Добавить картинку',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue805',
      titleText: 'Архивировать',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue81f',
      titleText: 'Ещё',
      modificators: popup.menu
        ? ['icon-button_smaller', 'icon-button_no-hover']
        : 'icon-button_smaller',
      onClick: onMoreButtonClick,
      append: popup.menu,
    },
    {
      iconSymbol: '\ue807',
      titleText: 'Отменить',
      modificators: 'icon-button_smaller',
      // disabled: true,
    },
    {
      iconSymbol: '\ue808',
      titleText: 'Повторить',
      modificators: 'icon-button_smaller',
      // disabled: true,
    },
  ].map((params) => (
    <IconButton
      iconSymbol={params.iconSymbol}
      titleText={params.titleText}
      modificators={params.modificators}
      onClick={params.onClick}
      key={params.titleText}
    >
      {params.append}
    </IconButton>
  ));
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={cn(
        style.note,
        { [style.note_focused]: isFocused },
        {
          [style.note_interacting]: Object.values(popup).some((v) => v),
        }
      )}
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
          onChange={onHeaderChange}
        />
      )}
      {type !== 'list' && (
        <div className={style.note__text}>
          <Textarea
            placeholder="Заметка..."
            value={text}
            onChange={onTextFieldChange}
          />
        </div>
      )}
      {type === 'list' && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list}>
            {items.map((item) => (
              <ListItem
                value={item.text}
                onChange={item.onChange}
                onRemove={item.onRemove}
                onCheck={item.onCheck}
                key={item.key}
              />
            ))}
            <ListItem isAddItem onChange={onListItemAdd} />
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
                  value={item.text}
                  onChange={item.onChange}
                  onRemove={item.onRemove}
                  onCheck={item.onCheck}
                  key={item.key}
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
          <button
            className={style.note__button}
            type="button"
            onClick={onClose}
          >
            Закрыть
          </button>
        )}
        {buttons}
      </div>
    </form>
  );
}
