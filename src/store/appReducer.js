import { SET_APP_PAGE } from './actionsTypes';

const handlers = {
  [SET_APP_PAGE]: (state, { page }) => {
    if (state.page === page) return state;
    return { ...state, page };
  },
};

const initialState = { page: null };

export default function appReducer(state = initialState, action) {
  if (handlers[action.type]) return handlers[action.type](state, action);
  return state;
}

// SET_APP_PAGE
export function setPage(page) {
  return { type: SET_APP_PAGE, page };
}
