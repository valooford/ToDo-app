import React from 'react';
import cn from 'classnames';

import IconButtonComponent from '@components/IconButton/IconButton';

import style from './Note-cfg.module.scss';

function AddNote(
  { onClick, onInput, IconButton = IconButtonComponent },
  inputRef
) {
  const inputHandler = ({ target: { value: text }, keyCode }) => {
    // IE trigger an input event on creation
    if (text === '' && !keyCode) return;
    onInput(text);
  };
  const buttons = [
    { iconSymbol: '\ue800', titleText: 'Создать список', key: 'list' },
    {
      iconSymbol: '\uf1fc',
      titleText: 'Создать заметку с рисунком',
      key: 'drawing',
    },
    { iconSymbol: '\ue802', titleText: 'Создать фотозаметку', key: 'photo' },
  ].map((params) => (
    <IconButton
      iconSymbol={params.iconSymbol}
      titleText={params.titleText}
      key={params.key}
    />
  ));
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={cn(style.note, style.note_focused, style['note-add'])}
      onClick={onClick}
    >
      <input
        className={style['note-add__input']}
        type="text"
        placeholder="Заметка..."
        onInput={inputHandler}
        onKeyDown={(e) => {
          // Enter
          if (e.keyCode === 13) {
            inputHandler(e);
          }
        }}
        ref={inputRef}
      />
      <div className={style['note-add__buttons']}>{buttons}</div>
    </div>
  );
}

export default React.forwardRef(AddNote);
