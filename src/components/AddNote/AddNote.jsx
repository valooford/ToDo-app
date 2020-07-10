import './AddNote-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

const buttonsParams = [
  { iconSymbol: '\ue800', titleText: 'Создать список' },
  { iconSymbol: '\uf1fc', titleText: 'Создать заметку с рисунком' },
  { iconSymbol: '\ue802', titleText: 'Создать фотозаметку' },
];

// КОМПОНЕНТ БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
export default function AddNote({ onClick }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="addNote" onClick={onClick}>
      Заметка...
      <div className="addNote__buttons">
        {buttonsParams.map((params) => (
          <IconButton
            iconSymbol={params.iconSymbol}
            titleText={params.titleText}
            key={params.titleText}
          />
        ))}
      </div>
    </div>
  );
}
