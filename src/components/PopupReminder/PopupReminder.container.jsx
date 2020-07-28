import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import PopupReminder from '@components/PopupReminder/PopupReminder';

// import {} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ POPUP-REMINDER
// *
function PopupReminderContainer() {
  return <PopupReminder />;
}

export default connect()(PopupReminderContainer);
