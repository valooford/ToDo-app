import './IconButton-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

// ШАБЛОН КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
export default function IconButton({
  iconSymbol = '',
  titleText = '',
  modificators,
  disabled,
  onClick,
  append,
}) {
  let modificatorsList;
  if (modificators) {
    if (modificators.forEach) {
      modificatorsList = [...modificators];
    } else {
      modificatorsList = [modificators];
    }
  }

  return setupBuilder('template-icon-button')({
    '.icon-button': {
      append,
      props: !disabled
        ? {}
        : {
            disabled: true,
            tabIndex: -1,
          },
      modificators: modificatorsList,
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
