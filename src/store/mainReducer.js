const SET_ADD_POST_FOCUS = 'main/switch-add-post-focus';
const ADD_NEW_NOTE = 'main/add-new-note';

function mainReducer(state, action) {
  switch (action.type) {
    case SET_ADD_POST_FOCUS:
      return {
        ...state,
        isAddPostFocused: action.isFocused,
      };
    case ADD_NEW_NOTE:
      return {
        ...state,
        notes: [action.note, ...state.notes],
      };
    default:
      return state;
  }
}

export default mainReducer;

export function focusAddPost() {
  return { type: SET_ADD_POST_FOCUS, isFocused: true };
}
export function blurAddPost() {
  return { type: SET_ADD_POST_FOCUS, isFocused: false };
}

export function addNewNote(text, headerText) {
  return { type: ADD_NEW_NOTE, note: { text, headerText } };
}
