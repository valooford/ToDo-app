const SET_ADD_NOTE_FOCUS = 'main/switch-add-note-focus';
const ADD_NEW_NOTE = 'main/add-new-note';
const REMOVE_NOTE = 'main/remove-note';

function mainReducer(state, action) {
  let notes;
  let removedNotes;
  switch (action.type) {
    case SET_ADD_NOTE_FOCUS:
      return {
        ...state,
        isAddPostFocused: action.isFocused,
      };
    case ADD_NEW_NOTE:
      return {
        ...state,
        notes: [action.note, ...state.notes],
      };
    case REMOVE_NOTE:
      notes = [...state.notes];
      removedNotes = notes.splice(action.index, 1);
      return {
        ...state,
        notes,
        removedNotes: [...state.removedNotes, ...removedNotes],
      };
    default:
      return state;
  }
}

export default mainReducer;

export function focusAddNote() {
  return { type: SET_ADD_NOTE_FOCUS, isFocused: true };
}
export function blurAddNote() {
  return { type: SET_ADD_NOTE_FOCUS, isFocused: false };
}

export function addNewNote(text = '', headerText = '') {
  return { type: ADD_NEW_NOTE, note: { text, headerText } };
}

export function removeNote(index = null) {
  if (index === null) return {};
  return { type: REMOVE_NOTE, index };
}
