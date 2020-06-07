import './Aside-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconedMenuItem from '@components/MenuItem/MenuItem';
/* eslint-enable import/no-unresolved */

// ШАБЛОН МЕНЮ / ASIDE
// *
export default function setupAside() {
  return setupBuilder('template-aside')({
    '.aside__menu': {
      append: [
        ['&#xe80d;', 'Заметки', true],
        ['&#xf0f3;', 'Напоминания'],
        ['&#xe81d;', '123'],
        ['&#xe80e;', 'Изменение ярлыков'],
        ['&#xe805;', 'Архив'],
        ['&#xe80f;', 'Корзина'],
      ].map((props) => setupIconedMenuItem(...props)),
    },
  });
}
