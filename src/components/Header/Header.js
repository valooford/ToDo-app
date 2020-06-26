import './Header-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import IconButton from '@components/IconButton/IconButton';
import Search from '@components/Search/Search';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ХЕДЕРА (ШАПКИ) / HEADER
// *
function Header({
  headerButtonParams = {
    iconSymbol: '&#xf0c9;',
    titleText: 'Главное меню',
    modificators: 'icon-button_bigger',
  },
  buttonsParams = [],
} = {}) {
  const headerButtons = buttonsParams.map((params) => IconButton(params));

  return setupBuilder('template-header')({
    '.header': {
      prepend: IconButton(headerButtonParams),
    },
    '.header__search': {
      append: Search(),
    },
    '.header__buttons': {
      append: headerButtons,
    },
  });
}

export default function HeaderContainer(props) {
  const buttonsParams = [
    {
      iconSymbol: '&#xe815;',
      titleText: 'Обновить',
      modificators: 'icon-button_bigger',
    },
    {
      iconSymbol: '&#xe819;',
      titleText: 'Сетка',
      modificators: 'icon-button_bigger',
    },
    {
      iconSymbol: '&#xe818;',
      titleText: 'Настройки',
      modificators: 'icon-button_bigger',
    },
    {
      iconSymbol: '&#xe816;',
      titleText: 'Приложения Google',
    },
    {
      iconSymbol: 'V',
      titleText: 'Аккаунт Google',
    },
  ];

  return Header({ ...props, buttonsParams });
}
