import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import Button from '@components/Button/Button';
import IconButtonComponent from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
/* eslint-enable import/no-unresolved */
import ListItemComponent from './components/ListItem/ListItem';
import CreationTimeComponent from './components/CreationTime/CreationTime';
// ...add some tag/reminder general-purpose component
import style from './Note-cfg.module.scss';

function Note(
  {
    isSelectionMode,
    isHidden,
    noteData: {
      headerText,
      text,
      items,
      markedItems,
      isPinned,
      isArchived,
      isReminderPassed,
      creationDate,
      editingDate,
      color,
      isInteracting,
      isSelected,
    },
    eventHandlers: {
      onClick,
      onMouseDown,
      onMouseUp,
      onKeyDown,
      onClose, // on close button click / pressing Esc
      onSelection,
      onPin,
      onArchive,
      onRestore,
      onDelete,
      onHeaderChange,
      onTextFieldChange,
      onMoreButtonClick,
      onColorsButtonClick,
      onColorsButtonMouseEnter,
      onColorsButtonMouseLeave,
      onReminderButtonClick,

      onHeaderFocus,
      onTextFieldFocus,
    },
    IconButton = IconButtonComponent,
    CreationTime = CreationTimeComponent,
    refs: {
      moreButtonRef,
      colorsButtonRef,
      reminderButtonRef,

      headerRef,
      textFieldRef,
      listRef,
    } = {},
  },
  ref
) {
  const buttons = [];
  if (onDelete) {
    buttons.push({
      iconSymbol: '\ue825',
      titleText: 'Удалить навсегда',
      modificators: 'icon-button_smaller',
      onClick: onDelete,
    });
  }
  if (onRestore) {
    buttons.push({
      iconSymbol: '\ue824',
      titleText: 'Восстановить',
      modificators: 'icon-button_smaller',
      onClick: onRestore,
    });
  }
  if (onReminderButtonClick) {
    buttons.push({
      iconSymbol: isReminderPassed ? '\ue800' : '\uf0f3',
      titleText: isReminderPassed
        ? 'Отметить как выполненное'
        : 'Сохранить напоминание',
      modificators: 'icon-button_smaller',
      onClick: onReminderButtonClick,
      ref: reminderButtonRef,
    });
  }
  // buttons.push({
  //   iconSymbol: '\ue803',
  //   titleText: 'Соавторы',
  //   modificators: 'icon-button_smaller',
  // });
  if (onColorsButtonClick) {
    buttons.push({
      iconSymbol: '\ue804',
      titleText: 'Изменить цвет',
      modificators: 'icon-button_smaller',
      onClick: onColorsButtonClick,
      onMouseEnter: onColorsButtonMouseEnter,
      onMouseLeave: onColorsButtonMouseLeave,
      ref: colorsButtonRef,
    });
  }
  // buttons.push({
  //   iconSymbol: '\ue802',
  //   titleText: 'Добавить картинку',
  //   modificators: 'icon-button_smaller',
  // });
  if (onArchive) {
    buttons.push({
      iconSymbol: isArchived ? '\ue822' : '\ue805',
      titleText: isArchived ? 'Вернуть из архива' : 'Архивировать',
      modificators: 'icon-button_smaller',
      onClick: onArchive,
    });
  }
  if (onMoreButtonClick) {
    buttons.push({
      iconSymbol: '\ue81f',
      titleText: 'Ещё',
      modificators: 'icon-button_smaller',
      onClick: onMoreButtonClick,
      ref: moreButtonRef,
    });
  }
  // buttons.push({
  //   iconSymbol: '\ue807',
  //   titleText: 'Отменить',
  //   modificators: 'icon-button_smaller',
  //   disabled: true,
  // });
  // buttons.push({
  //   iconSymbol: '\ue808',
  //   titleText: 'Повторить',
  //   modificators: 'icon-button_smaller',
  //   disabled: true,
  // });
  // +
  const iconButtons = buttons
    .filter((params) => !params.disabled) // + add notes change history
    .map((params) => (
      <IconButton
        iconSymbol={params.iconSymbol}
        titleText={params.titleText}
        modificators={params.modificators}
        onClick={params.onClick}
        onMouseEnter={params.onMouseEnter}
        onMouseLeave={params.onMouseLeave}
        disabled={params.disabled}
        ref={params.ref || null}
        key={params.titleText}
      />
    ));
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={cn(style.note, style[`note_style-${color}`], {
        [style.note_focused]: onClose,
        [style.note_interacting]: isInteracting,
        [style.note_selected]: isSelected,
        [style['note_mode-selection']]: isSelectionMode,
        [style.note_hidden]: isHidden,
      })}
      onSubmit={(e) => e.preventDefault()}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
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
      {markedItems && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list} ref={listRef}>
            {items}
          </ul>
          <div className={style.note__markedList}>
            <i>&#xe81a;</i>
            <span className={style.note__markedCount}>
              {`${markedItems.length} отмеченных пунктов`}
            </span>
            <ul className={style.note__list}>
              {markedItems.map((item) => [
                <ListItemComponent
                  isChecked
                  isPreview={item.onFocus}
                  value={item.text}
                  onChange={item.onChange}
                  onRemove={item.onRemove}
                  onCheck={item.onCheck}
                  onMouseUp={item.onFocus}
                  key={item.id}
                  textareaRef={item.ref}
                />,
                ...item.sub.map((subItem) => (
                  <ListItemComponent
                    isChecked
                    isNested
                    isPreview={subItem.onFocus}
                    value={subItem.text}
                    onChange={subItem.onChange}
                    onRemove={subItem.onRemove}
                    onCheck={subItem.onCheck}
                    onMouseUp={subItem.onFocus}
                    key={subItem.id}
                    textareaRef={subItem.ref}
                  />
                )),
              ])}
            </ul>
          </div>
        </div>
      )}
      <div className={style.note__info}>
        {onClose && creationDate && editingDate && (
          <span className={style.note__creationTime}>
            <CreationTime
              creationDate={creationDate}
              editingDate={editingDate}
              extraText={
                (onRestore && 'Заметка в корзине') ||
                (isArchived && 'Заметка в архиве')
              }
            />
          </span>
        )}
      </div>
      <div className={style.note__buttons}>
        {onClose && (
          <span className={style.note__button}>
            <Button onClick={onClose}>Закрыть</Button>
          </span>
        )}
        {iconButtons}
      </div>
    </form>
  );
}

export default React.forwardRef(Note);
