import './Title-cfg.scss';
import React from 'react';

// КОМПОНЕНТ ОКНА С ПОДСКАЗКОЙ / TITLE
// *
export default function Title({ text }) {
  return (
    <div className="title">
      <span className="title__text">{text}</span>
    </div>
  );
}
