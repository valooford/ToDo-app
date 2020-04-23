import './Header-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
import setupSearch from '@components/Search/Search';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ХЕДЕРА (ШАПКИ) / HEADER
// *
export default function setupHeader() {
  return setupBuilder('template-header')({
    prepend: [
      {
        setup: setupIconButton,
        set: [['&#xf0c9;', 'Главное меню', 'icon-button_bigger']],
      },
    ],
    insert: {
      '.header__search': {
        setup: setupSearch,
      },
      '.header__buttons': {
        setup: setupIconButton,
        set: [
          ['&#xe815;', 'Обновить', 'icon-button_bigger'],
          ['&#xe819;', 'Сетка', 'icon-button_bigger'],
          ['&#xe818;', 'Настройки', 'icon-button_bigger'],
          ['&#xe816;', 'Приложения Google'],
          ['V', 'Аккаунт Google'],
        ],
      },
    },
  });
}
