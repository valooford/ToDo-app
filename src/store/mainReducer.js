const SET_ADD_POST_FOCUS = 'main/switch-add-post-focus';

function mainReducer(state, action) {
  switch (action.type) {
    case SET_ADD_POST_FOCUS:
      return {
        ...state,
        isAddPostFocused: action.isFocused,
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
