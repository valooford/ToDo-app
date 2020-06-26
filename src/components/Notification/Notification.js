import './Notification-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function Notification({
  closeIconParams = {
    iconSymbol: '&#xe80c;',
    titleText: 'Удалить напоминание',
    modificators: 'icon-button_notification',
  },
} = {}) {
  return setupBuilder('template-notification')({
    '.notification__close': {
      append: IconButton(closeIconParams),
    },
  });
}
