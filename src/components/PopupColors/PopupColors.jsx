import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButtonComponent from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

import style from './PopupColors-cfg.module.scss';

const buttonsParams = [
  {
    color: 'default',
    title: 'По умолчанию',
  },
  {
    color: 'red',
    title: 'Красный',
  },
  {
    color: 'orange',
    title: 'Оранжевый',
  },
  {
    color: 'yellow',
    title: 'Желтый',
  },
  {
    color: 'green',
    title: 'Зеленый',
  },
  {
    color: 'aquamarine',
    title: 'Сине-зеленый',
  },
  {
    color: 'blue',
    title: 'Синий',
  },
  {
    color: 'darkblue',
    title: 'Темно-синий',
  },
  {
    color: 'purple',
    title: 'Фиолетовый',
  },
  {
    color: 'pink',
    title: 'Розовый',
  },
  {
    color: 'brown',
    title: 'Коричневый',
  },
  {
    color: 'grey',
    title: 'Серый',
  },
];

function PopupColors(
  {
    onColorSelection,
    selectedColor,
    firstButtonRef,
    lastButtonRef,
    onKeyDown,
    onMouseEnter,
    onMouseQuit,
    IconButton = IconButtonComponent,
  },
  ref
) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
    <div
      className={style['popup-colors']}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseQuit}
      ref={ref}
    >
      {buttonsParams.map((params, i) => {
        let buttonRef;
        if (!i) {
          buttonRef = firstButtonRef;
        } else if (i === buttonsParams.length - 1) {
          buttonRef = lastButtonRef;
        } else {
          buttonRef = null;
        }
        return (
          <IconButton
            iconSymbol={selectedColor === params.color && '\ue800'}
            titleText={params.title}
            modificators={[
              'icon-button_colored',
              `icon-button_style-${params.color}`,
            ]}
            onClick={() => {
              onColorSelection(params.color);
            }}
            ref={buttonRef}
            key={params.color}
          />
        );
      })}
    </div>
  );
}

export default React.forwardRef(PopupColors);
