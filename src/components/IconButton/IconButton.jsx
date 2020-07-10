import './IconButton-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

// КОМПОНЕНТ КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
export default function IconButton({
  iconSymbol = '',
  titleText = '',
  modificators,
  // disabled,
  onClick,
  children,
}) {
  let modificatorsList = '';
  if (modificators) {
    if (modificators.forEach) {
      modificatorsList = ` ${modificators.join(' ')}`;
    } else {
      modificatorsList = ` ${modificators}`;
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <span className={`icon-button${modificatorsList}`} onClick={onClick}>
      <span className="icon-button__icon">{iconSymbol}</span>
      <br />
      <span className="icon-button__title">
        {titleText && <Title text={titleText} />}
      </span>
      {children}
    </span>
  );
}
