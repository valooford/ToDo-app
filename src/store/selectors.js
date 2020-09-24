/* eslint-disable import/prefer-default-export */

export function getCurrentPage(state) {
  return state.app.page;
}

export function getNoteReminders(state) {
  return state.notification.noteReminders;
}
export function getReminderById(state, id) {
  return state.notification.noteReminders[`note-${id}`];
}
export function getNoteIdByReminderId(state, reminderId) {
  return reminderId.replace('note-', '');
}
