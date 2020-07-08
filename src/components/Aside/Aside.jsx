import './Aside-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
// import setupBuilder from '@components/templates';
import IconedMenuItem from '@components/MenuItem/MenuItem';
/* eslint-enable import/no-unresolved */

// ШАБЛОН МЕНЮ / ASIDE
// *
// function Aside({ menuItemsParams = [] } = {}) {
//   const asideMenuItems = menuItemsParams.map((params) =>
//     IconedMenuItem(...params)
//   );

//   return setupBuilder('template-aside')({
//     '.aside__menu': {
//       append: asideMenuItems,
//     },
//   });
// }

// export default function AsideContainer(props) {
//   const menuItemsParams = [
//     ['&#xe80d;', 'Заметки', true],
//     ['&#xf0f3;', 'Напоминания'],
//     ['&#xe81d;', '123'],
//     ['&#xe80e;', 'Изменение ярлыков'],
//     ['&#xe805;', 'Архив'],
//     ['&#xe80f;', 'Корзина'],
//   ];

//   return Aside({ ...props, menuItemsParams });
// }

const menuItemsParams = [
  ['\ue80d', 'Заметки', true],
  ['\uf0f3', 'Напоминания'],
  ['\ue81d', '123'],
  ['\ue80e', 'Изменение ярлыков'],
  ['\ue805', 'Архив'],
  ['\ue80f', 'Корзина'],
];

export default function Aside() {
  return (
    <div className="aside">
      <ul className="aside__menu">
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
