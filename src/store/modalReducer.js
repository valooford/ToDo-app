// import { NOTIFY, CLOSE } from './actionsTypes';

// const handlers = {
//   [NOTIFY]: (state, { callback }) => {
//     return { ...state, isOpen: true, callback };
//   },
//   [CLOSE]: (state) => {
//     return { ...state, isOpen: false, callback: null };
//   },
// };

// const initialState = { isOpen: false, callback: null };

// export default function mainReducer(state = initialState, action) {
//   if (handlers[action.type]) return handlers[action.type](state, action);
//   return state;
// }

// // NOTIFY
// export function readyModal(callback) {
//   return { type: NOTIFY, callback };
// }
// // CLOSE
// export function closeModal() {
//   return { type: CLOSE };
// }
