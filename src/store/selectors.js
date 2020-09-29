/* eslint-disable import/prefer-default-export */

export function getCurrentPage(state) {
  return state.app.page;
}

export function getAddingNoteId(state) {
  return state.main.addingNoteId;
}
export function getReminders(state) {
  return state.notification.reminders;
}
export function getNoteReminders(state) {
  return state.notification.noteReminders;
}
export function getReminder(state, reminderId) {
  return state.notification.reminders[reminderId];
}
export function getReminderIdByNoteId(state, noteId) {
  return state.notification.noteReminders[noteId];
}
export function hasPassedReminder(state, noteId) {
  const reminderId = state.notification.noteReminders[noteId];
  if (!reminderId) return false;
  const { date } = state.notification.reminders[reminderId];
  if (!date) return false;
  return date - Date.now() < 0;
}
