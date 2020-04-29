import './Notification-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function setupNotification() {
  return setupBuilder('template-notification')({
    insert: {
      '.notification__close': {
        setup: setupIconButton,
        set: [
          [
            {
              iconSymbol: '&#xe80c;',
              titleText: 'Удалить напоминание',
              modificator: 'icon-button_notification',
            },
          ],
        ],
      },
    },
  });
}
