import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
import Notification from '@components/Notification/Notification';
import CreationTime from '@components/CreationTime/CreationTime';
import ListItem from '@components/ListItem/ListItem';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
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
    onHeaderFocus,
    onTextFieldChange,
    onTextFieldFocus,
    onListItemAdd,
    listItemFocusHandlerCreator,
    onMoreButtonClick,
  },
  focusInfo = {},
  isSelected,
}) {
  const fieldToFocusRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (!fieldToFocusRef.current) return;
      fieldToFocusRef.current.focus();
      // must be some maxCharCount instead of 1000
      // used only for focusing to a text end in IE
      fieldToFocusRef.current.setSelectionRange(1000, 1000);
    }, 0);
  }, [focusInfo.fieldName, focusInfo.itemIndex]);
  const { fieldName, itemIndex } = focusInfo;
  const isHeaderToFocus = fieldName === 'header';
  const isTextfieldToFocus = fieldName === 'textfield';
  const isAddListItemToFocus = fieldName === 'add-list-item';
  const isUnmarkedListItemToFocus = fieldName === 'unmarked-list-item';
  const isMarkedListItemToFocus = fieldName === 'marked-list-item';

  const noteRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(isSelected);
  useEffect(() => {
    noteRef.current.addEventListener('focusin', () => {
      setIsInteracting(true);
    });
    noteRef.current.addEventListener('focusout', () => {
      setIsInteracting(false);
    });
  }, [noteRef.current]);
  useEffect(() => {
    setIsInteracting(isSelected);
  }, [isSelected]);

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
      modificators: 'icon-button_smaller',
      onClick: onMoreButtonClick,
      append: popup.menu,
    },
    {
      iconSymbol: '\ue807',
      titleText: 'Отменить',
      modificators: 'icon-button_smaller',
      disabled: true,
    },
    {
      iconSymbol: '\ue808',
      titleText: 'Повторить',
      modificators: 'icon-button_smaller',
      disabled: true,
    },
  ].map((params) => (
    <span key={params.titleText}>
      <IconButton
        iconSymbol={params.iconSymbol}
        titleText={params.titleText}
        modificators={params.modificators}
        onClick={params.onClick}
        disabled={params.disabled}
      />
      {params.append}
    </span>
  ));
  const note = (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={cn(
        style.note,
        { [style.note_focused]: isFocused },
        {
          [style.note_interacting]: isInteracting,
        }
      )}
      onSubmit={(e) => e.preventDefault()}
      onClick={onClick}
      ref={noteRef}
    >
      {!isFocused && (
        <div className={style.note__check}>
          <IconButton
            iconSymbol="&#xe80b;"
            titleText="Выбрать заметку"
            modificators="icon-button_no-padding"
          />
        </div>
      )}
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
          onFocus={onHeaderFocus}
          tabIndex={isFocused ? 0 : -1}
          ref={isHeaderToFocus ? fieldToFocusRef : null}
        />
      )}
      {type !== 'list' && (
        <div className={style.note__text}>
          <Textarea
            placeholder="Заметка..."
            value={text}
            onChange={onTextFieldChange}
            onFocus={onTextFieldFocus}
            tabIndex={isFocused ? 0 : -1}
            ref={isTextfieldToFocus ? fieldToFocusRef : null}
          />
        </div>
      )}
      {type === 'list' && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list}>
            {items.map((item, i) => (
              <ListItem
                isPreview={!isFocused}
                value={item.text}
                onChange={item.onChange}
                onRemove={item.onRemove}
                onCheck={item.onCheck}
                onFocus={listItemFocusHandlerCreator(false, i)}
                key={item.key}
                ref={
                  isUnmarkedListItemToFocus && i === itemIndex
                    ? fieldToFocusRef
                    : null
                }
              />
            ))}
            {isFocused && (
              <ListItem
                isAddItem
                onChange={onListItemAdd}
                ref={isAddListItemToFocus ? fieldToFocusRef : null}
              />
            )}
          </ul>
          <div className={style.note__markedList}>
            <i>&#xe81a;</i>
            <span className={style.note__markedCount}>
              {`${markedItems.length} отмеченных пунктов`}
            </span>
            <ul className={style.note__list}>
              {markedItems.map((item, i) => (
                <ListItem
                  isChecked
                  isPreview={!isFocused}
                  value={item.text}
                  onChange={item.onChange}
                  onRemove={item.onRemove}
                  onCheck={item.onCheck}
                  onFocus={listItemFocusHandlerCreator(true, i)}
                  key={item.key}
                  ref={
                    isMarkedListItemToFocus && i === itemIndex
                      ? fieldToFocusRef
                      : null
                  }
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

  return isFocused ? <KeyboardTrap>{note}</KeyboardTrap> : note;
}
