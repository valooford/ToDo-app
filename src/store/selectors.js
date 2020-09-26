/* eslint-disable import/prefer-default-export */

export function getCurrentPage(state) {
  return state.app.page;
}

export function getReminders(state) {
  return state.notification.reminders;
}
export function getReminder(state, reminderId) {
  return state.notification.reminders[reminderId];
}
