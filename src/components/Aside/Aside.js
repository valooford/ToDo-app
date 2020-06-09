import './Aside-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import IconedMenuItem from '@components/MenuItem/MenuItem';
/* eslint-enable import/no-unresolved */

// ШАБЛОН МЕНЮ / ASIDE
// *
function Aside({ menuItemsParams = [] } = {}) {
  const asideMenuItems = menuItemsParams.map((params) =>
    IconedMenuItem(...params)
  );

  return setupBuilder('template-aside')({
    '.aside__menu': {
      append: asideMenuItems,
    },
  });
}

export default function AsideContainer(props) {
  const menuItemsParams = [
    ['&#xe80d;', 'Заметки', true],
    ['&#xf0f3;', 'Напоминания'],
    ['&#xe81d;', '123'],
    ['&#xe80e;', 'Изменение ярлыков'],
    ['&#xe805;', 'Архив'],
    ['&#xe80f;', 'Корзина'],
  ];

  return Aside({ ...props, menuItemsParams });
}
