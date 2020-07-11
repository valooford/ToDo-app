import React from 'react';
/* eslint-disable import/no-unresolved */
import IconedMenuItem from '@components/MenuItem/MenuItem';
/* eslint-enable import/no-unresolved */
import style from './Aside-cfg.module.scss';

const menuItemsParams = [
  ['\ue80d', 'Заметки', true],
  ['\uf0f3', 'Напоминания'],
  ['\ue81d', '123'],
  ['\ue80e', 'Изменение ярлыков'],
  ['\ue805', 'Архив'],
  ['\ue80f', 'Корзина'],
];

// КОНТЕЙНЕР БОКОВОГО МЕНЮ / ASIDE
// *
export default function Aside() {
  return (
    <div className={style.aside}>
      <ul className={style.aside__menu}>
        {menuItemsParams.map((params) => (
          <IconedMenuItem
            iconSymbol={params[0]}
            text={params[1]}
            isSelected={params[2]}
            key={params[1]}
          />
        ))}
      </ul>
    </div>
  );
}
