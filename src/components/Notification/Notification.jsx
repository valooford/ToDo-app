import './Notification-cfg.scss';
import React from 'react';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// КОМПОНЕНТ УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export default function Notification() {
  return (
    <span className="notification">
      <span className="notification__icon">&#xe809;</span>
      10 июл., 10:00
      <span className="notification__close">
        ...
        <IconButton
          iconSymbol="&#xe80c;"
          titleText="Удалить напоминание"
          modificators="icon-button_notification"
        />
      </span>
    </span>
  );
}
