import './Notification-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function setupNotification() {
  return setupBuilder('template-notification')();
}
