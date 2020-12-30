import React from 'react';

import IconedMenuItem from '@components/MenuItem/MenuItem';

import style from './Aside-cfg.module.scss';

export default function Aside({
  currentPage,
  labels,
  isExpanded,
  onTagsEdit,
  tagsEditButtonRef,
}) {
  const menuItemsParams = [
    { to: '/home', iconSymbol: '\ue80d', text: 'Заметки' },
    { to: '/reminders', iconSymbol: '\uf0f3', text: 'Напоминания' },
    ...labels.map((label) => ({
      to: `/label/${label}`,
      iconSymbol: '\ue81d',
      text: label,
    })),
    {
      iconSymbol: '\ue80e',
      text: 'Изменение ярлыков',
      onClick: onTagsEdit,
      ref: tagsEditButtonRef,
    },
    { to: '/archive', iconSymbol: '\ue805', text: 'Архив' },
    { to: '/trash', iconSymbol: '\ue80f', text: 'Корзина' },
  ];
  menuItemsParams.forEach((itemParams) => {
    if (itemParams.to === currentPage) {
      // eslint-disable-next-line no-param-reassign
      itemParams.isSelected = true;
    }
  });
  return (
    <div className={style.aside}>
      <ul className={style.aside__menu}>
        {menuItemsParams.map((params) => (
          <IconedMenuItem
            to={params.to}
            isActive={params.to === currentPage}
            isConcise={!isExpanded}
            iconSymbol={params.iconSymbol}
            text={params.text}
            isSelected={params.isSelected}
            onClick={params.onClick}
            key={params.text}
            ref={params.ref}
          />
        ))}
      </ul>
    </div>
  );
}
