import React, { useRef, useEffect } from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './AddNote-cfg.module.scss';

const buttonsParams = [
  {
    iconSymbol: '\ue800',
    titleText: 'Создать список',
    key: 'list',
  },
  {
    iconSymbol: '\uf1fc',
    titleText: 'Создать заметку с рисунком',
    key: 'drawing',
  },
  {
    iconSymbol: '\ue802',
    titleText: 'Создать фотозаметку',
    key: 'photo',
  },
];

// КОМПОНЕНТ БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
export default function AddNote({ onClick, onInput }) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className={style.addNote} onClick={onClick}>
      <input
        className={style.addNote__input}
        type="text"
        placeholder="Заметка..."
        onInput={onInput}
        onKeyDown={(e) => {
          // Enter
          if (e.keyCode === 13) {
            onInput(e);
          }
        }}
        ref={inputRef}
      />
      <div className={style.addNote__buttons}>
        {buttonsParams.map((params) => (
          <IconButton
            iconSymbol={params.iconSymbol}
            titleText={params.titleText}
            key={params.key}
          />
        ))}
      </div>
    </div>
  );
}
