import './Header-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
import setupSearch from '@components/Search/Search';
/* eslint-enable import/no-unresolved */

const headerButtons = [
  [
    {
      iconSymbol: '&#xe815;',
      titleText: 'Обновить',
      modificator: 'icon-button_bigger',
    },
  ],
  [
    {
      iconSymbol: '&#xe819;',
      titleText: 'Сетка',
      modificator: 'icon-button_bigger',
    },
  ],
  [
    {
      iconSymbol: '&#xe818;',
      titleText: 'Настройки',
      modificator: 'icon-button_bigger',
    },
  ],
  [{ iconSymbol: '&#xe816;', titleText: 'Приложения Google' }],
  [{ iconSymbol: 'V', titleText: 'Аккаунт Google' }],
];

// ШАБЛОН ХЕДЕРА (ШАПКИ) / HEADER
// *
export default function setupHeader() {
  return setupBuilder('template-header')({
    prepend: [
      {
        setup: setupIconButton,
        set: [
          [
            {
              iconSymbol: '&#xf0c9;',
              titleText: 'Главное меню',
              modificator: 'icon-button_bigger',
            },
          ],
        ],
      },
    ],
    insert: {
      '.header__search': {
        setup: setupSearch,
      },
      '.header__buttons': {
        setup: setupIconButton,
        set: headerButtons,
      },
    },
  });
}
