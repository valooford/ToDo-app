const NOTIFY = 'modal/notify';
const CLOSE = 'modal/close';

const initialState = { callback: null };

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFY:
      return { ...state, callback: action.callback };
    case CLOSE:
      return { ...state, callback: null };
    default:
      return state;
  }
}

// NOTIFY
export function readyModal(callback) {
  return {
    type: NOTIFY,
    callback,
  };
}
export function closeModal() {
  return {
    type: CLOSE,
  };
}
