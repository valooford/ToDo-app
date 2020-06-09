import './IconButton-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

// ШАБЛОН КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
export default function setupIconButton({
  iconSymbol = '',
  titleText = '',
  modificator,
  disabled,
  onClick,
  append,
}) {
  return setupBuilder('template-icon-button')({
    '.icon-button': {
      append,
      props: !disabled
        ? {}
        : {
            disabled: true,
            tabIndex: -1,
          },
      modificators: modificator ? [modificator] : [],
      eventHandlers: { click: onClick },
    },
    '.icon-button__icon': {
      html: iconSymbol,
    },
    '.icon-button__title': {
      append: titleText !== '' && Title(titleText),
    },
  });
}
