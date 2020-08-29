import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import Button from '@components/Button/Button';
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
import CreationTime from '@components/CreationTime/CreationTime';
import ListItem from '@components/ListItem/ListItem';
/* eslint-enable import/no-unresolved */
import style from './Note-cfg.module.scss';

// eslint-disable-next-line import/no-unresolved
export { style as listItemStyle } from '@components/ListItem/ListItem';
export { style };

function Note({
  noteData: {
    headerText,
    text,
    items,
    markedItems,
    // isFocused,
    isPinned,
    creationDate,
    editingDate,
  },
  popup = {},
  eventHandlers: {
    onClick,
    onMouseDown,
    onClose,
    onSelection,
    onPin,
    onHeaderChange,
    onHeaderFocus,
    onTextFieldChange,
    onTextFieldFocus,
    onListItemAdd,
    listItemMouseUpHandlerCreator,
    onMoreButtonClick,
    onColorsButtonClick,
    onColorsButtonHover,
    onColorsButtonMouseLeave,
    onReminderButtonClick,
  },
  children,
  refs: { moreButtonRef, colorsButtonRef, reminderButtonRef } = {},
  // focusInfo = {},
  // isSelected,
}) {
  // const fieldToFocusRef = useRef(null);
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!fieldToFocusRef.current) return;
  //     fieldToFocusRef.current.focus();
  //     const caretPos = focusInfo.caret != null ? focusInfo.caret : 9999;
  //     fieldToFocusRef.current.setSelectionRange(caretPos, caretPos);
  //   }, 0);
  // }, [focusInfo.fieldName, focusInfo.itemIndex]);
  // const { fieldName, itemIndex } = focusInfo;
  // const isHeaderToFocus = fieldName === 'header';
  // const isTextfieldToFocus = fieldName === 'textfield';
  // const isAddListItemToFocus = fieldName === 'add-list-item';
  // const isUnmarkedListItemToFocus = fieldName === 'unmarked-list-item';
  // const isMarkedListItemToFocus = fieldName === 'marked-list-item';

  // const noteRef = useRef(null);
  // const [isInteracting, setIsInteracting] = useState(isSelected);
  // // is any focused element inside this note
  // const [isFocusing, setIsFocusing] = useState(false);
  // useEffect(() => {
  //   if (!noteRef.current) return;
  //   noteRef.current.addEventListener('focusin', () => {
  //     setIsFocusing(true);
  //   });
  //   noteRef.current.addEventListener('focusout', () => {
  //     setIsFocusing(false);
  //   });
  // }, [noteRef.current]);
  // useEffect(() => {
  //   setIsInteracting(
  //     // isSelected || isFocusing || Object.values(popup).filter((v) => v).length
  //     isSelected || isFocusing || Object.keys(popup).filter((v) => v).length
  //   );
  // }, [isSelected, isFocusing]);

  const buttons = [
    {
      iconSymbol: '\uf0f3',
      titleText: 'Сохранить напоминание',
      modificators: 'icon-button_smaller',
      onClick: onReminderButtonClick,
      append: popup.reminder,
      ref: reminderButtonRef,
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
      onClick: onColorsButtonClick,
      onHover: onColorsButtonHover,
      onMouseLeave: onColorsButtonMouseLeave,
      append: popup.colors,
      ref: colorsButtonRef,
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
      ref: moreButtonRef,
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
  ]
    .filter((params) => !params.disabled) // add notes change history
    .map((params) => (
      <span key={params.titleText}>
        <IconButton
          iconSymbol={params.iconSymbol}
          titleText={params.titleText}
          modificators={params.modificators}
          onClick={params.onClick}
          onHover={params.onHover}
          onMouseLeave={params.onMouseLeave}
          disabled={params.disabled}
          ref={params.ref || null}
        />
        {params.append}
      </span>
    ));
  const note = (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={cn(
        style.note,
        { [style.note_focused]: onClose }
        // {
        //   [style.note_interacting]: isInteracting,
        // }
      )}
      onSubmit={(e) => e.preventDefault()}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onKeyDown={(e) => {
        // Esc
        if (onClose && e.keyCode === 27) {
          onClose();
        }
      }}
      // ref={noteRef}
    >
      {onSelection && (
        <div className={style.note__check}>
          <IconButton
            iconSymbol="&#xe80b;"
            titleText="Выбрать заметку"
            modificators="icon-button_no-padding"
            onClick={onSelection}
          />
        </div>
      )}
      <div className={style.note__cornerButtons}>
        <IconButton
          iconSymbol={isPinned ? '\ue801' : '\ue812'}
          titleText={isPinned ? 'Открепить заметку' : 'Закрепить заметку'}
          modificators="icon-button_smaller"
          onClick={onPin}
        />
      </div>
      {(onHeaderChange || headerText !== '') && (
        <input
          className={style.note__header}
          type="text"
          placeholder="Введите заголовок"
          value={headerText}
          onChange={onHeaderChange}
          onMouseUp={onHeaderFocus}
          tabIndex={onHeaderChange ? 0 : -1}
          // ref={isHeaderToFocus ? fieldToFocusRef : null}
        />
      )}
      {text != null && (
        <div className={style.note__text}>
          <Textarea
            placeholder="Заметка..."
            value={text}
            onChange={onTextFieldChange}
            onMouseUp={onTextFieldFocus}
            tabIndex={onTextFieldChange ? 0 : -1}
            // ref={isTextfieldToFocus ? fieldToFocusRef : null}
          />
        </div>
      )}
      {items && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list}>
            {items.map((item, i) => (
              <ListItem
                isPreview={!listItemMouseUpHandlerCreator}
                value={item.text}
                onChange={item.onChange}
                onRemove={item.onRemove}
                onCheck={item.onCheck}
                onMouseUp={
                  listItemMouseUpHandlerCreator &&
                  listItemMouseUpHandlerCreator(false, i)
                }
                key={item.id}
                // ref={
                //   isUnmarkedListItemToFocus && i === itemIndex
                //     ? fieldToFocusRef
                //     : null
                // }
              />
            ))}
            {onListItemAdd && (
              <ListItem
                isAddItem
                onChange={onListItemAdd}
                key="add-list-item"
                // ref={isAddListItemToFocus ? fieldToFocusRef : null}
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
                  isPreview={!listItemMouseUpHandlerCreator}
                  value={item.text}
                  onChange={item.onChange}
                  onRemove={item.onRemove}
                  onCheck={item.onCheck}
                  onMouseUp={
                    listItemMouseUpHandlerCreator &&
                    listItemMouseUpHandlerCreator(true, i)
                  }
                  key={item.id}
                  // ref={
                  //   isMarkedListItemToFocus && i === itemIndex
                  //     ? fieldToFocusRef
                  //     : null
                  // }
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className={style.note__info}>
        {onClose && (
          <span className={style.note__creationTime}>
            <CreationTime
              creationDate={creationDate}
              editingDate={editingDate}
            />
          </span>
        )}
        {children}
      </div>
      <div className={style.note__buttons}>
        {onClose && (
          <span className={style.note__button}>
            <Button onClick={onClose}>Закрыть</Button>
          </span>
        )}
        {buttons}
      </div>
    </form>
  );
  return note;
}

export default React.memo(Note);
