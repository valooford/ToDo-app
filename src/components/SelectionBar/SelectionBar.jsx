import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './SelectionBar-cfg.module.scss';

// КОМПОНЕНТ МЕНЮ ПРИ ВЫДЕЛЕНИИ / SELECTION-BAR
// *
export default function SelectionBar({
  selectedCount,
  pinSymbol = '\ue812',
  eventHandlers: {
    onClose,
    onMoreButtonClick,
    onColorsButtonClick,
    onColorsButtonMouseEnter,
    onColorsButtonMouseLeave,
    onReminderButtonClick,
    onPin,
  },
  refs: { moreButtonRef, colorsButtonRef, reminderButtonRef },
}) {
  const buttonsParams = [
    {
      // iconSymbol: isPinned ? '\ue801' : '\ue812',
      iconSymbol: pinSymbol,
      // titleText: isPinned ? 'Открепить заметку' : 'Закрепить заметку',
      titleText: 'Закрепить заметку',
      modificators: ['icon-button_bigger', 'icon-button_style-selection-bar'],
      onClick: onPin,
    },
    {
      iconSymbol: '\uf0f3',
      titleText: 'Сохранить напоминание',
      modificators: ['icon-button_bigger', 'icon-button_style-selection-bar'],
      onClick: onReminderButtonClick,
      ref: reminderButtonRef,
    },
    {
      iconSymbol: '\ue804',
      titleText: 'Изменить цвет',
      modificators: ['icon-button_bigger', 'icon-button_style-selection-bar'],
      onClick: onColorsButtonClick,
      onMouseEnter: onColorsButtonMouseEnter,
      onMouseLeave: onColorsButtonMouseLeave,
      ref: colorsButtonRef,
    },
    {
      iconSymbol: '\ue805',
      titleText: 'Архивировать',
      modificators: ['icon-button_bigger', 'icon-button_style-selection-bar'],
    },
    {
      iconSymbol: '\ue81f',
      titleText: 'Ещё',
      modificators: ['icon-button_bigger', 'icon-button_style-selection-bar'],
      onClick: onMoreButtonClick,
      ref: moreButtonRef,
    },
  ];
  let text;
  const remainder10 = selectedCount % 10;
  const remainder100 = selectedCount % 100;
  if (remainder100 <= 10 || remainder100 >= 20) {
    if (remainder10 > 1 && remainder10 < 5) {
      text = `Выбрано ${selectedCount} заметки`;
    } else if (remainder10 === 1) {
      text = `Выбрана ${selectedCount} заметка`;
    } else {
      text = `Выбрано ${selectedCount} заметок`;
    }
  } else {
    text = `Выбрано ${selectedCount} заметок`;
  }
  return (
    <div className={style['selection-bar']}>
      <IconButton
        iconSymbol="&#xe80c;"
        titleText="Отменить выбор"
        modificators="icon-button_bigger"
        onClick={onClose}
      />
      <span className={style['selection-bar__selected-notes-count']}>
        {text}
      </span>
      <span className={style['selection-bar__buttons']}>
        {buttonsParams.map((params) => (
          <IconButton
            iconSymbol={params.iconSymbol}
            titleText={params.titleText}
            modificators={params.modificators}
            onClick={params.onClick}
            onMouseEnter={params.onMouseEnter}
            onMouseLeave={params.onMouseLeave}
            ref={params.ref}
            key={params.titleText}
          />
        ))}
      </span>
    </div>
  );
}
