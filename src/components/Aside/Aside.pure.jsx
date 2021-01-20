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
  const menuItems = {
    '/home': { to: '/home', iconSymbol: '\ue80d', text: 'Заметки' },
    '/reminders': {
      to: '/reminders',
      iconSymbol: '\uf0f3',
      text: 'Напоминания',
    },
    ...labels.reduce((res, label) => {
      res[label] = {
        to: `/label/${label}`,
        iconSymbol: '\ue81d',
        text: label,
      };
      return res;
    }, {}),
    'tag-edit': {
      iconSymbol: '\ue80e',
      text: 'Изменение ярлыков',
      onClick: onTagsEdit,
      ref: tagsEditButtonRef,
    },
    '/archive': { to: '/archive', iconSymbol: '\ue805', text: 'Архив' },
    '/trash': { to: '/trash', iconSymbol: '\ue80f', text: 'Корзина' },
  };
  menuItems[currentPage].isSelected = true;
  const menuItemsParams = Object.values(menuItems).map((itemData) => {
    const { to } = itemData;
    return {
      ...itemData,
      isActive: to === currentPage,
      isConcise: !isExpanded,
    };
  });
  return (
    <div className={style.aside}>
      <ul className={style.aside__menu}>
        {menuItemsParams.map((params) => (
          <IconedMenuItem params={params} key={params.text} />
        ))}
      </ul>
    </div>
  );
}
