import {
  SET_APP_PAGE,
  SWITCH_ASIDE_EXPANSION,
  SET_TITLE_DATA,
} from './actionsTypes';

const handlers = {
  [SET_APP_PAGE]: (state, { page }) => {
    if (state.page === page) return state;
    return { ...state, page };
  },
  [SWITCH_ASIDE_EXPANSION]: (state) => ({
    ...state,
    isAsideExpanded: !state.isAsideExpanded,
  }),
  [SET_TITLE_DATA]: (state, { data }) => ({
    ...state,
    titleData: data,
  }),
};

const initialState = { page: null, isAsideExpanded: true };

export default function appReducer(state = initialState, action) {
  if (handlers[action.type]) return handlers[action.type](state, action);
  return state;
}

// SET_APP_PAGE
export function setPage(page) {
  return { type: SET_APP_PAGE, page };
}

// SWITCH_ASIDE_EXPANSION
export function switchAsideExpansion() {
  return { type: SWITCH_ASIDE_EXPANSION };
}

// SET_TITLE_DATA
export function setTitleData(text, coords) {
  return { type: SET_TITLE_DATA, data: { text, coords } };
}
export function clearTitleData() {
  return { type: SET_TITLE_DATA, data: null };
}
