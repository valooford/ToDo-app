import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import Button from '@components/Button/Button';
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
/* eslint-enable import/no-unresolved */
import ListItem from './components/ListItem/ListItem';
import CreationTime from './components/CreationTime/CreationTime';
// ...add some tag/reminder general-purpose component
import style from './Note-cfg.module.scss';

function Note(
  {
    isSelectionMode,
    noteData: {
      headerText,
      text,
      items,
      markedItems,
      isPinned,
      creationDate,
      editingDate,
      color,
      isInteracting,
      isSelected,
    },
    eventHandlers: {
      onClick,
      onMouseDown,
      onKeyDown,
      onClose, // on close button click / pressing Esc
      onSelection,
      onPin,
      onHeaderChange,
      onTextFieldChange,
      onListItemAdd,
      onMoreButtonClick,
      onColorsButtonClick,
      onColorsButtonHover,
      onColorsButtonMouseLeave,
      onReminderButtonClick,

      onHeaderFocus,
      onTextFieldFocus,
    },
    refs: {
      moreButtonRef,
      colorsButtonRef,
      reminderButtonRef,

      headerRef,
      textFieldRef,
      addListItemRef,
    } = {},

    // ---replace---
    children, // replace with tag/reminder component data
    // ---remove---
    popup = {}, // create global Popup state and remove this
  },
  ref
) {
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
    // +
    .filter((params) => !params.disabled) // + add notes change history
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
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={cn(style.note, style[`note_style-${color}`], {
        [style.note_focused]: onClose,
        [style.note_interacting]: isInteracting,
        [style.note_selected]: isSelected,
        [style['note_mode-selection']]: isSelectionMode,
      })}
      onSubmit={(e) => e.preventDefault()}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onKeyDown={(e) => {
        if (onKeyDown) onKeyDown(e);
        // Esc
        if (onClose && e.keyCode === 27) {
          onClose();
        }
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={!onClose ? 0 : -1}
      ref={ref}
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
        {onPin && (
          <IconButton
            iconSymbol={isPinned ? '\ue801' : '\ue812'}
            titleText={isPinned ? 'Открепить заметку' : 'Закрепить заметку'}
            modificators="icon-button_smaller"
            onClick={(e) => {
              if (isSelectionMode) e.stopPropagation();
              onPin();
            }}
          />
        )}
      </div>
      {(onHeaderChange || headerText !== '') && (
        <input
          className={style.note__header}
          type="text"
          placeholder="Введите заголовок"
          value={headerText}
          onChange={({ target: { value } }) => {
            onHeaderChange(value);
          }}
          onMouseUp={onHeaderFocus}
          tabIndex={onHeaderChange ? 0 : -1}
          ref={headerRef}
        />
      )}
      {text != null && (
        <div className={style.note__text}>
          <Textarea
            placeholder="Заметка..."
            value={text}
            onChange={
              onTextFieldChange &&
              (({ target: { value } }) => {
                onTextFieldChange(value);
              })
            }
            onMouseUp={onTextFieldFocus}
            tabIndex={onTextFieldChange ? 0 : -1}
            ref={textFieldRef}
          />
        </div>
      )}
      {items && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list}>
            {items.map((item) => (
              <ListItem
                isPreview={item.onFocus}
                value={item.text}
                onChange={item.onChange}
                onRemove={item.onRemove}
                onCheck={item.onCheck}
                onMouseUp={item.onFocus}
                key={item.id}
                ref={item.ref}
              />
            ))}
            {onListItemAdd && (
              <ListItem
                isAddItem
                onChange={({ target: { value } }) => {
                  if (value !== '') {
                    onListItemAdd(value);
                  }
                }}
                key="add-list-item"
                ref={addListItemRef}
              />
            )}
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
                  isPreview={item.onFocus}
                  value={item.text}
                  onChange={item.onChange}
                  onRemove={item.onRemove}
                  onCheck={item.onCheck}
                  onMouseUp={item.onFocus}
                  key={item.id}
                  ref={item.ref}
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
}

export default React.forwardRef(Note);
