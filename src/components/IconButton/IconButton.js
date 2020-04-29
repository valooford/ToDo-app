import './IconButton-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupTitle from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

// ШАБЛОН КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
export default function setupIconButton({
  iconSymbol = '',
  titleText = '',
  modificator,
  disabled,
  onClick,
}) {
  return setupBuilder('template-icon-button')({
    insert: {
      '.icon-button__icon': { html: iconSymbol },
      '.icon-button__title': {
        setup: setupTitle,
        set: [[titleText]],
      },
    },
    modificators: modificator ? [modificator] : [],
    /* eslint-disable indent */
    props: !disabled
      ? {}
      : {
          disabled: true,
          tabIndex: -1,
        },
    /* eslint-enable indent */
    eventHandlers: {
      click: onClick,
    },
  });
}
