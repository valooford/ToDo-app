import React from 'react';
/* eslint-disable import/no-unresolved */
import IconedMenuItem from '@components/MenuItem/MenuItem';
/* eslint-enable import/no-unresolved */
import style from './Aside-cfg.module.scss';

const menuItemsParams = [
  { to: '/home', iconSymbol: '\ue80d', text: 'Заметки', isSelected: true },
  { to: '/reminders', iconSymbol: '\uf0f3', text: 'Напоминания' },
  { to: '/label/123', iconSymbol: '\ue81d', text: '123' },
  { iconSymbol: '\ue80e', text: 'Изменение ярлыков' },
  { to: '/archive', iconSymbol: '\ue805', text: 'Архив' },
  { to: '/trash', iconSymbol: '\ue80f', text: 'Корзина' },
];

// КОНТЕЙНЕР БОКОВОГО МЕНЮ / ASIDE
// *
export default function Aside() {
  return (
    <div className={style.aside}>
      <ul className={style.aside__menu}>
        {menuItemsParams.map((params) => (
          <IconedMenuItem
            to={params.to}
            iconSymbol={params.iconSymbol}
            text={params.text}
            isSelected={params.isSelected}
            key={params.text}
          />
        ))}
      </ul>
    </div>
  );
}
